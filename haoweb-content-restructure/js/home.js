/* home.js — 메인 v8 스크롤 모션(네이티브 스크롤)
   스크롤 위치 기반 리빌 + 레이아웃 확정 가드(초기 오발화 방지).
   reduced-motion·무JS = 정적 표시(CSS 처리). */
(function () {
  if (!document.querySelector(".x-hero")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  window.addEventListener("load", req);
  // 초기 1회는 'load'(모든 리소스·폰트 로드 후, 레이아웃 확정)에서만 처리
})();
