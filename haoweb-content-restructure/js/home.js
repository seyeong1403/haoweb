/* home.js — 메인 v8 스크롤 모션(네이티브 스크롤)
   ★스크롤 위치 기반 리빌: 요소가 뷰포트 하단 86%선을 넘어오면 .in 부여.
   IntersectionObserver 초기 오발화(레이아웃 미확정 시 전부 등장) 문제를 회피.
   reduced-motion·무JS = 정적 표시(CSS가 처리). */
(function () {
  if (!document.querySelector(".x-hero")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var vh = function () { return window.innerHeight || document.documentElement.clientHeight || 800; };
  var rvs = Array.prototype.slice.call(document.querySelectorAll(".x-rv, .x-stag"));
  var glow = document.querySelector(".x-hero__glow");
  var dots = document.querySelector(".x-hero__dots");
  var ticking = false;

  function frame() {
    var h = vh(), trigger = h * 0.86, y = window.scrollY || window.pageYOffset || 0;

    // 스크롤 위치 기반 리빌
    for (var i = rvs.length - 1; i >= 0; i--) {
      var el = rvs[i], r = el.getBoundingClientRect();
      if (r.top < trigger && r.bottom > 0) { el.classList.add("in"); rvs.splice(i, 1); }
    }
    // 히어로 배경 패럴랙스(장식층)
    if (y < 1000) {
      if (glow) glow.style.transform = "translateY(" + (y * 0.18) + "px)";
      if (dots) dots.style.transform = "translateY(" + (y * 0.09) + "px)";
    }
    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  window.addEventListener("load", req);
  // 초기 실행: 폰트/레이아웃 안정화 대비 몇 차례
  frame();
  setTimeout(frame, 60);
  setTimeout(frame, 300);
})();
