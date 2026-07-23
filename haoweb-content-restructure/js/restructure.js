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

  // 3) 스크롤 리빌 + 잇다 모션 층 — 지원 브라우저·모션 허용 환경에서만.
  //    숨김은 전부 JS가 붙이는 클래스로만 발생(무JS=항상 표시), 종료 후 클래스 제거.
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var root = document.documentElement;
    root.classList.add("js-anim");

    // 3-1) 히어로 로드 시퀀스: 레드 바(h1) → 타이틀 → 리드 → 버튼 → 데모 순차 등장
    var hs = document.querySelectorAll(
      ".page-hero .crumbs, .page-hero h1, .page-hero .lead, .page-hero .hero-actions, .hero-grid > div[aria-hidden]"
    );
    hs.forEach(function (el, i) {
      el.classList.add("hs");
      el.style.transitionDelay = (100 + i * 110) + "ms";
    });
    setTimeout(function () { hs.forEach(function (el) { el.classList.add("on"); }); }, 40);
    setTimeout(function () {
      hs.forEach(function (el) { el.classList.remove("hs", "on"); el.style.transitionDelay = ""; });
    }, 2200);

    // 3-2) 거대 키워드(.sec-kw) 글자 단위 라이즈
    var kws = document.querySelectorAll(".sec-kw");
    kws.forEach(function (kw) {
      Array.prototype.slice.call(kw.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split("").forEach(function (chr) {
            var s = document.createElement("span");
            s.className = "ch";
            s.textContent = chr === " " ? " " : chr;
            frag.appendChild(s);
          });
          kw.replaceChild(frag, node);
        } else if (node.nodeType === 1) {
          node.classList.add("ch");
        }
      });
      kw.classList.add("split", "pre");
    });
    var kio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.querySelectorAll(".ch").forEach(function (c, i) { c.style.transitionDelay = (i * 38) + "ms"; });
        el.classList.add("go");
        kio.unobserve(el);
        setTimeout(function () {
          el.classList.remove("pre", "go");
          el.querySelectorAll(".ch").forEach(function (c) { c.style.transitionDelay = ""; });
        }, 1600);
      });
    }, { threshold: 0.3 });
    kws.forEach(function (k) { kio.observe(k); });
    // 안전망: 누락 시 전부 표시
    setTimeout(function () { kws.forEach(function (el) { el.classList.remove("pre", "go"); }); }, 3200);

    // 3-3) 플로팅 문의 필: 히어로를 지나 스크롤하면 표시
    var fc = document.querySelector(".float-cta");
    var hero = document.querySelector(".page-hero");
    if (fc && hero) {
      var syncFloat = function () {
        fc.classList.toggle("show", window.scrollY > hero.offsetHeight + 80);
      };
      window.addEventListener("scroll", syncFloat, { passive: true });
      syncFloat();
    }
    var targets = document.querySelectorAll(
      ".sec-head, .col-block, .path > a, .path > div, .quote-card, .demo-win, .giant-list a," +
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
