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
})();
