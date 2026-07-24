/* home.js — 메인 v8 스크롤 모션 엔진 (네이티브 스크롤 · Lenis 제거)
   레퍼런스 모션 이식: 스크롤 스크럽(패럴랙스·회전·스케일) + 스티키 핀 씬(노드 조립).
   네이티브 스크롤을 가로채지 않음 → 스크롤 정상. reduced-motion·무JS = 정적 표시. */
(function () {
  if (!document.querySelector(".x-hero")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var scrubs = Array.prototype.slice.call(document.querySelectorAll("[data-scrub]"));
  var pins = Array.prototype.slice.call(document.querySelectorAll("[data-pin]"));
  var vh = function () { return window.innerHeight || document.documentElement.clientHeight; };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ticking = false;

  function frame() {
    var h = vh();

    // 1) 스크럽: 요소가 뷰포트를 통과하는 진행도(0~1)로 transform
    scrubs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = clamp((h - r.top) / (h + r.height));   // 아래 진입 0 → 위 이탈 1
      var t = "";
      el.getAttribute("data-scrub").split(",").forEach(function (k) {
        var kv = k.split(":"), key = kv[0].trim(), amt = parseFloat(kv[1]);
        if (key === "y") t += " translateY(" + ((p - 0.5) * amt) + "px)";
        else if (key === "rot") t += " rotate(" + ((p - 0.5) * amt) + "deg)";
        else if (key === "scale") t += " scale(" + (1 + (p - 0.5) * amt / 100) + ")";
      });
      el.style.transform = t;
    });

    // 2) 핀 씬: 섹션 고정 구간 진행도 → --p + 키워드 순차 활성
    pins.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      var total = sec.offsetHeight - h;
      if (total <= 0) return;
      var p = clamp(-r.top / total);
      sec.style.setProperty("--p", p.toFixed(4));
      var kws = sec.querySelectorAll("[data-kw]");
      if (kws.length) {
        var active = Math.min(kws.length - 1, Math.floor(p * kws.length * 0.9999));
        for (var i = 0; i < kws.length; i++) kws[i].classList.toggle("on", i <= active);
      }
    });

    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  frame();
})();
