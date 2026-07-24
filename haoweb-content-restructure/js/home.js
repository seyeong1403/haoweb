/* home.js — 메인 v8 모션(레퍼런스 이식: Lenis 스무스 스크롤 + 히어로 패럴랙스)
   레퍼런스: Wembi/Digitalists/Itddaa(Lenis·GSAP ScrollTrigger). 홈에서만 동작. */
(function () {
  if (!document.querySelector(".x-hero")) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  // 1) Lenis 부드러운 스크롤(레퍼런스 공통 모션). 로드 실패 시 조용히 스킵.
  if (window.Lenis) {
    try {
      var lenis = new window.Lenis({
        duration: 1.05,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true, wheelMultiplier: 1
      });
      var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      window.__lenis = lenis;
    } catch (e) {}
  }

  // 2) 히어로 스크롤 패럴랙스(글로우·도트 그리드 — 장식층만, 애니메이션 충돌 없음)
  var glow = document.querySelector(".x-hero__glow");
  var dots = document.querySelector(".x-hero__dots");
  if (glow || dots) {
    var ticking = false;
    var upd = function () {
      var y = window.scrollY || window.pageYOffset || 0;
      if (y < 900) {
        if (glow) glow.style.transform = "translateY(" + (y * 0.16) + "px)";
        if (dots) dots.style.transform = "translateY(" + (y * 0.08) + "px)";
      }
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  }
})();
