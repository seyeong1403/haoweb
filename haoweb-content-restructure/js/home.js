/* home.js — 메인 v8 스크롤 모션(네이티브 스크롤)
   스크롤 위치 기반 리빌 + 레이아웃 확정 가드(초기 오발화 방지).
   reduced-motion·무JS = 정적 표시(CSS 처리). */
(function () {
  if (!document.querySelector(".x-hero")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // GSAP + ScrollTrigger 등록(씬 모션에서 사용). 로드 실패 시 조용히 스킵.
  var HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  if (HAS_GSAP) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
  }

  var vh = function () { return window.innerHeight || document.documentElement.clientHeight || 800; };
  var rvs = Array.prototype.slice.call(document.querySelectorAll(".x-rv, .x-stag"));
  var glow = document.querySelector(".x-hero__glow");
  var dots = document.querySelector(".x-hero__dots");
  var ticking = false;

  function frame() {
    ticking = false;
    var h = vh();
    // 레이아웃 미확정(페이지가 아직 짧게 잡힘) 시 리빌 스킵 → 아래쪽 요소 오발화 방지
    var settled = document.body.scrollHeight > h * 1.6;
    var y = window.scrollY || window.pageYOffset || 0;

    if (settled) {
      var trigger = h * 0.86;
      for (var i = rvs.length - 1; i >= 0; i--) {
        var el = rvs[i], r = el.getBoundingClientRect();
        if (r.top < trigger && r.bottom > -40) { el.classList.add("in"); rvs.splice(i, 1); }
      }
    }
    if (y < 1000) {
      if (glow) glow.style.transform = "translateY(" + (y * 0.18) + "px)";
      if (dots) dots.style.transform = "translateY(" + (y * 0.09) + "px)";
    }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  /* Hero 영상: 탭 비활성·오프스크린일 때 재생 정지(모바일 배터리·디코딩 절약) */
  (function () {
    var v = document.querySelector(".x-vid__v");
    if (!v) return;
    var play = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) v.pause(); else play();
    });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) play(); else v.pause(); });
      }, { threshold: 0.05 }).observe(v);
    }
  })();

  /* ===== Hero GSAP 시퀀스 ===== */
  if (HAS_GSAP) {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var hero = document.querySelector(".x-hero");
    var h1 = hero && hero.querySelector("h1");

    // 헤드라인을 줄 단위로 감싸기(마스크 리빌용)
    if (h1 && !h1.querySelector(".ln")) {
      var html = h1.innerHTML.split(/<br\s*\/?>/i);
      h1.innerHTML = html.map(function (l) {
        return '<span class="ln"><span class="li">' + l + "</span></span>";
      }).join("");
    }
    document.documentElement.classList.add("gsap-ready");

    // 레드 스윕 라인
    var sweep = document.createElement("div");
    sweep.className = "x-hero__sweep";
    hero.appendChild(sweep);

    // 안전망: 어떤 이유로든 시퀀스가 끊겨도 3초 뒤엔 반드시 보이게
    var revealAll = function () {
      // 헤드라인 글자(.li/.r)까지 반드시 포함 — 빠지면 해당 줄이 opacity 0으로 남는다
      gsap.set([".x-hero__eye", ".x-hero__sub", ".x-hero__actions", ".x-vid__cap",
                ".x-hero h1 .li", ".x-hero h1 .r"],
        { opacity: 1, x: 0, y: 0, yPercent: 0, clearProps: "transform" });
      gsap.set(".x-vid", { clipPath: "inset(0 0% 0 0)" });
      gsap.set(".x-vid__v", { scale: 1 });
    };
    setTimeout(revealAll, 3200);

    requestAnimationFrame(function () {
     try {
      var lines = hero.querySelectorAll("h1 .li");

      // 초기 상태는 gsap.set으로 확정(CSS opacity:0 + .from() 충돌 방지)
      var eye = hero.querySelector(".x-hero__eye");
      var sub = hero.querySelector(".x-hero__sub");
      var acts = hero.querySelector(".x-hero__actions");
      var cap = hero.querySelector(".x-vid__cap");
      gsap.set([eye, sub, acts], { opacity: 0, y: 16 });
      gsap.set(cap, { opacity: 0, y: 12 });
      gsap.set(".x-hero h1 .r", { opacity: 0, x: -18 });

      var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(sweep, { scaleX: 1, duration: .7, ease: "power2.inOut" })                 // 1 레드 선
        .to(sweep, { scaleX: 0, transformOrigin: "right", duration: .5 }, "+=.05")
        .to(eye, { opacity: 1, y: 0, duration: .5 }, .25)                             // 2 아이브로
        .from(lines, { yPercent: 115, duration: 1, stagger: .09 }, .3)                // 3 줄 마스크 리빌
        .to(".x-hero h1 .r", { x: 0, opacity: 1, duration: .7 }, "-=.5")              // 4 '문의하는' 별도
        .to(".x-vid", { clipPath: "inset(0 0% 0 0)", duration: 1.05 }, .55)           // 5 영상 클립 리빌(좌→우)
        .from(".x-vid__v", { scale: 1.14, duration: 1.5, ease: "expo.out" }, .55)     // 6 영상 살짝 줌아웃
        .to(cap, { opacity: 1, y: 0, duration: .5 }, "-=.7")                          // 7 영상 캡션
        .to([sub, acts], { opacity: 1, y: 0, duration: .55, stagger: .1 }, "-=.75");

      // 6~7 스크롤: 헤드라인 축소·이동 / 장면 확대
      if (ST && window.matchMedia("(min-width:961px)").matches) {
        gsap.to(hero.querySelector(".x-hero__grid > div"), {
          y: -60, scale: .94, opacity: .35, transformOrigin: "left top", ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .5 }
        });
        gsap.to(".x-stage", {
          scale: 1.12, y: -20, ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .5 }
        });
      }
     } catch (err) { revealAll(); }   // 예외 시 즉시 전체 표시(콘텐츠 실종 방지)
    });
  }

  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  window.addEventListener("load", req);
  // 초기 1회는 'load'(모든 리소스·폰트 로드 후, 레이아웃 확정)에서만 처리
})();
