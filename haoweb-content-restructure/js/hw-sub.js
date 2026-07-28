/* ============================================================
   hw-sub.js · 하오웹 서브페이지 공용 (2026-07-28)
   - site-config 값 주입(회사·연락처·개인정보). 빈 값은 '준비중'으로 표시(빈 줄 방지).
   - 문의 폼: 검증 → 입력 확인 → 전송. endpoint 없으면 전송하지 않고 사용자용 준비중 안내.
     (내부 문구·'검토용 화면' 노출 금지) endpoint가 연결되면 문구 변경 없이 실제 전송·성공 화면 자동 활성화.
   - 개인정보는 URL query로 노출하지 않음(GET·페이지 이동 금지).
   ============================================================ */
(function () {
  "use strict";
  var C = (window.HAOWEB_CONFIG || {});
  var company = C.company || {}, contact = C.contact || {}, privacy = C.privacy || {}, form = C.form || {};

  /* ---- 값 주입 유틸 ---- */
  function fill(sel, value, pendingText) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (value) { el.textContent = value; el.classList.remove("pending"); }
      else if (pendingText != null) { el.textContent = pendingText; el.classList.add("pending"); }
    });
  }
  // data-cfg 훅: 값 있으면 실값, 없으면 준비중 문구(요소가 준비중 문구를 data-pending으로 지정 가능)
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    var map = {
      "company.legalName": company.legalName, "company.ceo": company.ceo,
      "company.bizNo": company.bizNo, "company.address": company.address,
      "company.established": company.established,
      "contact.tel": contact.tel, "contact.email": contact.email,
      "contact.kakao": contact.kakao, "contact.hours": contact.hours,
      "privacy.officer": privacy.officer, "privacy.officerEmail": privacy.officerEmail,
      "privacy.effectiveDate": privacy.effectiveDate
    };
    if (key in map) {
      var v = map[key];
      var pending = el.getAttribute("data-pending");
      if (v) { el.textContent = v; el.classList.remove("pending"); if (el.hasAttribute("data-href-tel")) el.href = "tel:" + v.replace(/[^0-9+]/g, ""); if (el.hasAttribute("data-href-mail")) el.href = "mailto:" + v; }
      else if (pending != null) { el.textContent = pending; el.classList.add("pending"); }
      else { var row = el.closest("[data-cfg-row]"); if (row) row.hidden = true; }
    }
  });

  // Footer 연락처 한 줄(값 있을 때만 실제, 없으면 준비중 안내 — 빈 줄 남기지 않음)
  document.querySelectorAll("[data-foot-contact]").forEach(function (el) {
    var parts = [];
    if (contact.tel) parts.push("T. " + contact.tel);
    if (contact.email) parts.push("E. " + contact.email);
    if (company.address) parts.push(company.address);
    if (parts.length) { el.textContent = parts.join("  ·  "); el.classList.remove("pending"); }
    else { el.textContent = "대표 연락처는 오픈 시 안내됩니다."; el.classList.add("pending"); }
  });

  /* ---- ?type=renewal 프리셋 ---- */
  if (new URLSearchParams(location.search).get("type") === "renewal") {
    var rr = document.querySelector('input[name="type"][value="renewal"]');
    if (rr) { rr.checked = true; rr.dispatchEvent(new Event("change", { bubbles: true })); }
  }

  /* ---- 조건부 필드(신규/리뉴얼) ---- */
  document.querySelectorAll('form[data-hao-form]').forEach(function (form0) {
    var groups = form0.querySelectorAll(".fp-grp[data-for]");
    if (!groups.length) return;
    function apply() {
      var checked = form0.querySelector('input[name="type"]:checked');
      var type = checked ? checked.value : "new";
      groups.forEach(function (g) {
        var on = g.getAttribute("data-for") === type;
        g.hidden = !on;
        var primary = g.querySelector("[data-fp-primary]");
        if (primary) primary.required = on;
      });
    }
    form0.querySelectorAll('input[name="type"]').forEach(function (r) { r.addEventListener("change", apply); });
    apply();
  });

  /* ---- 폼 제출: 검증 → 확인 → 전송/준비중 ---- */
  var ENDPOINT = form.endpoint || "";
  document.querySelectorAll("form[data-hao-form]").forEach(function (form0) {
    var msg = form0.querySelector(".form-msg");
    var btn = form0.querySelector('button[type="submit"]');
    var confirming = false, busy = false;
    function show(t, kind) { if (!msg) return; msg.textContent = t; msg.className = "form-msg" + (kind ? " is-" + kind : ""); msg.hidden = false; }
    function labelFor(el) { var l = form0.querySelector('label[for="' + el.id + '"]'); var t = l ? l.textContent : (el.name || ""); return t.replace(/\s*\*\s*$/, "").replace(/\(.*?\)/g, "").trim(); }
    function collect() {
      var rows = [];
      form0.querySelectorAll("input,select,textarea").forEach(function (el) {
        if (el.type === "checkbox" && el.name === "privacy") return;
        if (el.type === "radio") { if (el.checked) rows.push(["유형", (el.nextElementSibling ? el.nextElementSibling.textContent : el.value).trim()]); return; }
        if (!el.value) return;
        if (el.closest("[hidden]")) return;
        rows.push([labelFor(el) || el.name, el.value]);
      });
      return rows;
    }
    form0.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      if (!confirming) {
        if (!form0.checkValidity()) { form0.reportValidity(); return; }
        var rows = collect(), html = '<p class="fc-title">입력하신 내용을 확인해 주세요</p><dl class="fc-dl">';
        rows.forEach(function (r) { html += "<div><dt>" + r[0] + "</dt><dd>" + String(r[1]).replace(/</g, "&lt;") + "</dd></div>"; });
        html += "</dl>";
        msg.innerHTML = html; msg.className = "form-msg is-confirm"; msg.hidden = false;
        confirming = true;
        btn.dataset.orig = btn.dataset.orig || btn.textContent;
        btn.textContent = "이대로 신청";
        if (!form0.querySelector(".fc-back")) {
          var back = document.createElement("button");
          back.type = "button"; back.className = "p-btn p-btn--ghost fc-back"; back.textContent = "수정하기";
          back.style.marginLeft = "10px";
          back.addEventListener("click", function () { confirming = false; msg.hidden = true; msg.innerHTML = ""; btn.textContent = btn.dataset.orig; back.remove(); });
          btn.insertAdjacentElement("afterend", back);
        }
        msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      if (!ENDPOINT) {
        show("온라인 접수 기능을 준비하고 있습니다. 입력하신 내용은 현재 전송되지 않습니다. 문의는 상단 연락처 또는 제작 문의를 이용해 주세요.", "info");
        return;
      }
      busy = true; btn.disabled = true; show("전송 중입니다…", "info");
      var data = {}; new FormData(form0).forEach(function (v, k) { data[k] = v; });
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw 0; show("신청이 접수되었습니다. 확인 후 연락드리겠습니다.", "ok"); form0.reset(); confirming = false; })
        .catch(function () { show("전송 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 상단 연락처로 문의해 주세요.", "error"); })
        .then(function () { busy = false; btn.disabled = false; });
    });
  });
})();
