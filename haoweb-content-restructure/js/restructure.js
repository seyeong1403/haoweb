/* HAOWEB 재정립 · restructure.js
   최소 기능만: 현재 페이지 표시 · 모바일 메뉴 aria 동기화.
   JS가 없어도 모든 콘텐츠·메뉴(details)가 동작한다. */
(function () {
  "use strict";

  // 1) 현재 페이지 표시(aria-current) — 헤더·모바일 메뉴 공통
  var here = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll('.hd a[href], .m-panel a[href]').forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === here) a.setAttribute("aria-current", "page");
  });

  // 2) 모바일 메뉴(details) aria-expanded 동기화 + 링크 클릭 시 닫기
  var m = document.querySelector(".m-menu");
  if (m) {
    var sum = m.querySelector("summary");
    var sync = function () { sum.setAttribute("aria-expanded", m.open ? "true" : "false"); };
    m.addEventListener("toggle", sync); sync();
    m.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { m.open = false; });
    });
    // ESC로 닫기
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && m.open) { m.open = false; sum.focus(); }
    });
  }

  // 3) 스크롤 리빌 — 지원 브라우저·모션 허용 환경에서만.
  //    리빌 완료 후 클래스를 제거해 각 컴포넌트의 hover 트랜지션으로 복귀한다.
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll(
      ".sec-head, .col-block, .path > a, .path > div, .quote-card, .demo-win," +
      " ol.flow li, ol.steps li, .dl > div, details.faq, .form, .tbl-wrap, .cta-band .cta-grid a"
    );
    var settle = function (el) {
      setTimeout(function () {
        el.classList.remove("rv", "in");
        el.style.transitionDelay = "";
      }, 800);
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
    // 안전망: 어떤 이유로든 관찰이 누락되면 전부 표시
    setTimeout(function () {
      targets.forEach(function (el) {
        if (el.classList.contains("rv")) { el.classList.add("in"); settle(el); }
      });
    }, 2500);
  }
})();
