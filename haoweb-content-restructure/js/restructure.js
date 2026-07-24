/* HAOWEB 재정립 · restructure.js — v6 (핵심 페이지 시각 근거 보완 단계)
   모션 4유형(docs/current/CORE_PAGE_MOTION_MAP.md): A 마스크 / B 클립 / C Sticky / D Hover.
   숨김은 JS 클래스로만 발생(무JS·reduced-motion=전부 표시). 폼은 API 연결 전 전송·이동 금지. */
(function () {
  "use strict";

  var here = (location.pathname.split("/").pop() || "index.html");

  // 1) 현재 페이지 + 부모 GNB 활성(route map)
  var ROUTES = {
    "website.html": ["website.html", "company.html", "hospital.html", "lawyer.html", "shop.html", "franchise.html", "landing.html", "app.html", "graphic-design.html", "studio.html", "content-production.html"],
    "renewal.html": ["renewal.html", "diagnosis.html", "renewal-proposal.html"],
    "search-ai.html": ["search-ai.html", "seo.html", "aeo.html", "geo.html", "ai-content.html", "content-operation.html"],
    "global.html": ["global.html", "global-vn.html", "global-cn.html", "global-th.html", "global-jp.html", "global-en.html"],
    "portfolio.html": ["portfolio.html", "portfolio-detail.html", "interview.html", "interview-detail.html"],
    "plan.html": ["plan.html", "process.html", "price-guide.html"],
    "faq.html": ["faq.html", "free-proposal.html", "maintenance.html", "inquiry.html", "about.html", "columns.html", "column-detail.html", "column-prepare.html", "column-renewal.html", "column-search.html", "column-after.html", "government.html", "notice.html", "privacy.html"]
  };
  document.querySelectorAll('.hd a[href], .m-panel a[href]').forEach(function (a) {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });
  Object.keys(ROUTES).forEach(function (parent) {
    if (ROUTES[parent].indexOf(here) < 0) return;
    document.querySelectorAll('.hd-nav > div > a[href="' + parent + '"], .m-panel .m-grp > a[href="' + parent + '"]').forEach(function (a) {
      if (!a.hasAttribute("aria-current")) a.setAttribute("aria-current", "true");
    });
  });

  // 2) 모바일 메뉴(details) aria-expanded 동기화 + 링크 클릭 시 닫기 + ESC
  var m = document.querySelector(".m-menu");
  if (m) {
    var sum = m.querySelector("summary");
    var sync = function () { sum.setAttribute("aria-expanded", m.open ? "true" : "false"); };
    m.addEventListener("toggle", sync); sync();
    m.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { m.open = false; });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && m.open) { m.open = false; sum.focus(); }
    });
  }

  // 2-b) site-config 주입 — 회사·연락처·개인정보. 빈 값이면 해당 표시를 넣지 않는다.
  var C = (window.HAOWEB_CONFIG || {});
  var setCfg = function (sel, text) {
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = text; });
  };
  if (C.privacy) {
    if (C.privacy.officer && C.privacy.officerEmail) {
      setCfg('[data-cfg="officer"]', "개인정보 보호 담당자: " + C.privacy.officer + " (" + C.privacy.officerEmail + ")");
    }
    if (C.privacy.effectiveDate) {
      setCfg('[data-cfg="effective"]', "본 방침은 " + C.privacy.effectiveDate + "부터 시행됩니다.");
    }
    if (C.privacy.analytics === true) {
      setCfg('[data-cfg="analytics-line"]', "서비스 개선을 위해 방문 분석 도구를 사용하며, 관련 쿠키가 저장될 수 있습니다.");
    }
  }
  // Footer 연락처 — 값이 있을 때만 노출
  var ftContact = document.querySelector("[data-cfg='footer-contact']");
  if (ftContact && C.contact) {
    var lines = [];
    if (C.contact.tel) lines.push("T. " + C.contact.tel);
    if (C.contact.email) lines.push("E. " + C.contact.email);
    if (C.company && C.company.address) lines.push(C.company.address);
    if (lines.length) { ftContact.textContent = lines.join("  ·  "); ftContact.hidden = false; }
  }

  // 3) 헤더 스크롤 축소(과한 숨김·등장 없음)
  var hd = document.querySelector(".hd");
  if (hd) {
    var syncHd = function () { hd.classList.toggle("scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", syncHd, { passive: true });
    syncHd();
  }

  // 4) 무료 제안: ?type=renewal 진입 시 리뉴얼 선택
  if (new URLSearchParams(location.search).get("type") === "renewal") {
    var rr = document.querySelector('input[name="type"][value="renewal"]');
    if (rr) rr.checked = true;
  }

  // 5) 폼 처리 — 검증 → 입력 확인 → 제출 어댑터.
  //    site-config.form.endpoint가 없으면 네트워크 전송하지 않고 확인 단계까지만 동작.
  //    개인정보를 URL query string으로 노출하지 않는다(GET·페이지 이동 금지).
  var CFG = (window.HAOWEB_CONFIG || {});
  var FORM_ENDPOINT = (CFG.form && CFG.form.endpoint) || "";
  document.querySelectorAll("form[data-hao-form]").forEach(function (form) {
    var msg = form.querySelector(".form-msg");
    var submitBtn = form.querySelector('button[type="submit"]');
    var confirming = false; // 확인 단계 진입 여부
    var busy = false;

    var showMsg = function (text, kind) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = "form-msg" + (kind ? " is-" + kind : "");
      msg.hidden = false;
    };
    var labelFor = function (el) {
      var lab = form.querySelector('label[for="' + el.id + '"]');
      var t = lab ? lab.textContent : (el.name || "");
      return t.replace(/\s*\*\s*$/, "").replace(/\(.*?\)/g, "").trim();
    };
    var collect = function () {
      var rows = [];
      form.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (el.type === "checkbox" && el.name === "privacy") return;
        if (el.type === "radio") { if (el.checked) rows.push([labelFor(form.querySelector('input[name="' + el.name + '"]')) || "유형", el.parentElement.textContent.trim()]); return; }
        if (!el.value) return;
        rows.push([labelFor(el) || el.name, el.value]);
      });
      return rows;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;

      // 1차 제출: 검증 후 확인 화면
      if (!confirming) {
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var rows = collect();
        var html = '<p class="fc-title">입력 내용을 확인해 주세요</p><dl class="fc-dl">';
        rows.forEach(function (r) {
          html += "<div><dt>" + r[0] + "</dt><dd>" + r[1].replace(/</g, "&lt;") + "</dd></div>";
        });
        html += "</dl>";
        showMsg("", "");
        msg.innerHTML = html; msg.className = "form-msg is-confirm"; msg.hidden = false;
        confirming = true;
        submitBtn.textContent = "이대로 제출";
        var back = document.createElement("button");
        back.type = "button"; back.className = "btn btn-ghost fc-back"; back.textContent = "수정하기";
        back.addEventListener("click", function () {
          confirming = false; msg.hidden = true; msg.innerHTML = "";
          submitBtn.textContent = submitBtn.dataset.orig || "신청 내용 확인";
          back.remove();
        });
        submitBtn.dataset.orig = submitBtn.dataset.orig || submitBtn.textContent;
        submitBtn.textContent = "이대로 제출";
        submitBtn.insertAdjacentElement("afterend", back);
        msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }

      // 2차 제출: 실제 전송
      if (!FORM_ENDPOINT) {
        // API 미연결: 전송하지 않음. 접수 완료로 표시하지 않는다.
        showMsg("현재는 검토용 화면으로, 접수 기능이 아직 연결되지 않았습니다. 문의는 상단 연락처로 부탁드립니다.", "info");
        return;
      }
      busy = true; submitBtn.disabled = true;
      showMsg("전송 중입니다…", "info");
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error("bad status");
        showMsg("신청이 접수되었습니다. 확인 후 연락드리겠습니다.", "ok");
        form.reset();
        confirming = false;
      }).catch(function () {
        showMsg("전송 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 상단 연락처로 문의해 주세요.", "error");
      }).then(function () {
        busy = false; submitBtn.disabled = false;
      });
    });
  });

  // 6) 제작 유형 미리보기(index·website): hover/focus 시 우측 구조 전환
  document.querySelectorAll(".type-sel").forEach(function (sel) {
    var items = Array.prototype.slice.call(sel.querySelectorAll(".ts-item"));
    var panels = Array.prototype.slice.call(sel.querySelectorAll(".tsp"));
    if (!items.length || !panels.length) return;
    var setAct = function (idx) {
      items.forEach(function (el, i) { el.classList.toggle("act", i === idx); });
      panels.forEach(function (el, i) { el.classList.toggle("act", i === idx); });
    };
    items.forEach(function (el, i) {
      el.addEventListener("mouseenter", function () { setAct(i); });
      el.addEventListener("focus", function () { setAct(i); });
    });
    setAct(0);
  });

  // 7) 모션 층 — 지원 브라우저·모션 허용 환경에서만
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var root = document.documentElement;
    root.classList.add("js-anim");
    var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
    var desktopMotion = window.matchMedia("(min-width:961px)").matches;

    // 7-A) 텍스트 마스크 리빌
    var masks = document.querySelectorAll(".mask-rv");
    masks.forEach(function (el) {
      var lines = [[]];
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType === 1 && node.tagName === "BR") { lines.push([]); node.remove(); }
        else lines[lines.length - 1].push(node);
      });
      lines.forEach(function (bucket) {
        if (!bucket.length) return;
        var ln = document.createElement("span"); ln.className = "ln";
        var li = document.createElement("span"); li.className = "li";
        el.insertBefore(ln, bucket[0]);
        bucket.forEach(function (n) { li.appendChild(n); });
        ln.appendChild(li);
      });
      el.classList.add("pre");
    });
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.querySelectorAll(".li").forEach(function (l, i) { l.style.transitionDelay = (i * 110) + "ms"; });
        el.classList.add("go");
        mio.unobserve(el);
        setTimeout(function () {
          el.classList.remove("pre", "go");
          el.querySelectorAll(".li").forEach(function (l) { l.style.transitionDelay = ""; });
        }, 1700);
      });
    }, { threshold: 0.25 });
    masks.forEach(function (el) { mio.observe(el); });

    // 7-B) 클립 리빌
    var clips = document.querySelectorAll(".clip-rv");
    clips.forEach(function (el) { el.classList.add("pre"); });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("go");
        cio.unobserve(e.target);
        (function (el) { setTimeout(function () { el.classList.remove("pre", "go"); }, 1400); })(e.target);
      });
    }, { threshold: 0.2 });
    clips.forEach(function (el) { cio.observe(el); });

    // 7-보조) 소형 요소 리빌(선택 적용 — 전 섹션 일괄 금지)
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      ".col-block, .path > a, .path > div, .quote-card, .demo-win, .hb-doc," +
      " ol.flow li, ol.steps li, .dl > div, details.faq, .form, .tbl-wrap," +
      " .cta-band .cta-grid a, .svc-index a, .svc-map .sm-l, .plan-rows a, .plan-free, .cta-rows a," +
      " .split-choice .sc, .giant-list a"
    )).filter(function (el) { return !el.querySelector(".mask-rv"); });
    var settle = function (el) {
      setTimeout(function () { el.classList.remove("rv", "in"); el.style.transitionDelay = ""; }, 1100);
    };
    targets.forEach(function (el) { el.classList.add("rv"); });
    var io = new IntersectionObserver(function (entries) {
      var i = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(i * 70, 350) + "ms";
        e.target.classList.add("in");
        io.unobserve(e.target);
        settle(e.target);
        i++;
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      targets.forEach(function (el) { if (el.classList.contains("rv")) { el.classList.add("in"); settle(el); } });
      masks.forEach(function (el) { el.classList.remove("pre"); });
      clips.forEach(function (el) { el.classList.remove("pre"); });
    }, 2600); // 안전망

    // 7-C1) 히어로 로드 시퀀스
    var hero = document.querySelector(".page-hero");
    var hs = document.querySelectorAll(
      ".page-hero .crumbs, .page-hero .lead, .page-hero .hero-meta, .page-hero .hero-actions, .hero-board"
    );
    hs.forEach(function (el, i) {
      el.classList.add("hs");
      el.style.transitionDelay = (260 + i * 120) + "ms";
    });
    setTimeout(function () { hs.forEach(function (el) { el.classList.add("on"); }); }, 40);
    setTimeout(function () {
      hs.forEach(function (el) { el.classList.remove("hs", "on"); el.style.transitionDelay = ""; });
    }, 2400);

    // 7-C2) 제작 방식: 데스크톱에서 단계별 작업 문서를 좌측 보드로 이동(모바일·무JS는 각 단계 아래 유지)
    var mth = document.querySelector(".mth-steps");
    var mthItems = [];
    var mvPanels = [];
    var mvBoard = document.querySelector(".mth-visual");
    if (mth && mvBoard && desktopMotion) {
      mth.classList.add("scrub");
      mthItems = Array.prototype.slice.call(mth.children);
      mthItems.forEach(function (li) {
        var p = li.querySelector(".mv-panel");
        if (p) { mvBoard.appendChild(p); mvPanels.push(p); }
      });
      if (mvPanels.length) mvPanels[0].classList.add("act");
    }

    // 7-C3) 플로팅 상담 버튼: 히어로 통과 후 표시 · 최종 CTA/푸터/핵심 장면과 겹치면 숨김 · 폼 입력 중 숨김
    var fc = document.querySelector(".float-cta");
    var fcToggle = fc ? fc.querySelector(".fc-toggle") : null;
    var fcPanel = fc ? fc.querySelector(".fc-panel") : null;
    var fcFormFocus = false;
    var fcVisibleBlockers = []; // IO가 보고한 화면 내 숨김 유발 요소(중복 카운트 방지 — 목록으로 관리)
    // 숨김 유발 영역: 최종 CTA·CTA 밴드·푸터는 항상.
    // 제작 방식 Sticky·리뉴얼 X-ray 등 핵심 시각 장면은 버튼이 콘텐츠를 침범할 여지가 큰
    // 좁은 화면(≤1279px)에서만 추가(넓은 화면에서는 우하단 여백에 위치해 겹치지 않음).
    var fcSel = ".cta-final, .cta-band, .ft";
    if (window.matchMedia("(max-width:1279px)").matches) fcSel += ", .method, .xray";
    var fcBlockEls = Array.prototype.slice.call(document.querySelectorAll(fcSel));
    // IO 콜백이 지연·미발화하는 환경 대비: 관찰 대상의 실제 겹침도 함께 판정(임의 px 기준 아님)
    var fcOverlapping = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < fcBlockEls.length; i++) {
        var r = fcBlockEls[i].getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) return true;
      }
      return false;
    };
    var syncFloat = function () {
      if (!fc || !hero) return;
      var show = window.scrollY > hero.offsetHeight + 80 && fcVisibleBlockers.length === 0 && !fcOverlapping() && !fcFormFocus;
      fc.classList.toggle("show", show);
      if (!show && fcPanel && !fcPanel.hidden) {
        fc.classList.remove("open"); fcPanel.hidden = true;
        if (fcToggle) fcToggle.setAttribute("aria-expanded", "false");
      }
    };
    if (fc && fcToggle && fcPanel) {
      var fcClose = function () {
        fc.classList.remove("open"); fcPanel.hidden = true;
        fcToggle.setAttribute("aria-expanded", "false");
      };
      fcToggle.addEventListener("click", function () {
        var opening = fcPanel.hidden;
        fcPanel.hidden = !opening;
        fc.classList.toggle("open", opening);
        fcToggle.setAttribute("aria-expanded", opening ? "true" : "false");
      });
      document.addEventListener("click", function (e) { if (!fc.contains(e.target)) fcClose(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") fcClose(); });
      document.addEventListener("focusin", function (e) {
        fcFormFocus = /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
        syncFloat();
      });
      document.addEventListener("focusout", function () { fcFormFocus = false; syncFloat(); });
      if (fcBlockEls.length) {
        var bio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            var i = fcVisibleBlockers.indexOf(e.target);
            if (e.isIntersecting && i < 0) fcVisibleBlockers.push(e.target);
            else if (!e.isIntersecting && i >= 0) fcVisibleBlockers.splice(i, 1);
          });
          syncFloat();
        }, { threshold: 0.15 });
        fcBlockEls.forEach(function (el) { bio.observe(el); });
      }
      window.addEventListener("scroll", syncFloat, { passive: true });
      syncFloat();
    }

    // 7-C4) 스크럽 엔진 — scroll 갱신 + rAF 렌더링 + IO 활성 구간 게이트(상시 계산 없음)
    var xrTop = document.querySelector(".xr-top");
    var xrFrame = document.querySelector(".xr-frame");
    var zones = [];
    var zoneVisible = 0;
    [mth, xrFrame].forEach(function (el) { if (el) zones.push(el); });
    var scrubTick = false;
    var applyScrub = function () {
      scrubTick = false;
      var vh = window.innerHeight;
      if (mthItems.length) {
        var best = -1, bestD = Infinity;
        mthItems.forEach(function (li, i) {
          var r = li.getBoundingClientRect();
          var d = Math.abs((r.top + r.height / 2) - vh * 0.45);
          if (d < bestD) { bestD = d; best = i; }
        });
        mthItems.forEach(function (li, i) { li.classList.toggle("act", i === best); });
        mvPanels.forEach(function (p, i) { p.classList.toggle("act", i === best); });
      }
      if (xrTop && xrFrame) {
        var r3 = xrFrame.getBoundingClientRect();
        var pr3 = clamp01((vh * 0.9 - r3.top) / (vh * 0.9));
        xrTop.style.clipPath = "inset(0 0 " + (pr3 * 78).toFixed(1) + "% 0)";
      }
    };
    var reqScrub = function () {
      if (scrubTick || zoneVisible === 0) return;
      scrubTick = true;
      if (window.requestAnimationFrame) requestAnimationFrame(applyScrub); else setTimeout(applyScrub, 16);
    };
    if (zones.length) {
      var zio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { zoneVisible += e.isIntersecting ? 1 : -1; });
        if (zoneVisible < 0) zoneVisible = 0;
        if (zoneVisible > 0) reqScrub();
      }, { rootMargin: "20% 0px 20% 0px" });
      zones.forEach(function (z) { zio.observe(z); });
    }
    window.__haoScrub = applyScrub; // 검수용 수동 훅
    window.addEventListener("scroll", reqScrub, { passive: true });
    window.addEventListener("resize", reqScrub, { passive: true });
    setTimeout(applyScrub, 60);

    // 뒤로 가기(bfcache) 복귀: 숨김 상태 강제 마감 + 상태 재계산
    window.addEventListener("pageshow", function (e) {
      if (!e.persisted) return;
      document.querySelectorAll(".rv,.mask-rv.pre,.clip-rv.pre").forEach(function (el) {
        el.classList.remove("rv", "in", "pre", "go");
      });
      applyScrub();
      syncFloat();
    });
  }
})();
