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

  /* Hero 장면: 노드 → 홈페이지 프레임 연결선을 실제 좌표로 그림 */
  function drawConnectors() {
    var stage = document.querySelector(".x-stage");
    if (!stage) return;
    var svg = stage.querySelector(".x-stage__svg");
    var fr = stage.querySelector(".hs-frame");
    if (!svg || !fr) return;
    var sb = stage.getBoundingClientRect(), fb = fr.getBoundingClientRect();
    if (sb.width < 10) return;
    svg.setAttribute("viewBox", "0 0 " + Math.round(sb.width) + " " + Math.round(sb.height));
    var fx = fb.left - sb.left, fy = fb.top - sb.top, fw = fb.width, fh = fb.height;
    var paths = svg.querySelectorAll("path");
    var nodes = stage.querySelectorAll(".hs-node");
    for (var i = 0; i < nodes.length && i < paths.length; i++) {
      var nb = nodes[i].getBoundingClientRect();
      var nx = nb.left - sb.left + nb.width / 2, ny = nb.top - sb.top + nb.height / 2;
      var tx = Math.max(fx + 6, Math.min(nx, fx + fw - 6));   // 프레임 위 최근접점
      var ty = Math.max(fy + 6, Math.min(ny, fy + fh - 6));
      if (nx < fx) tx = fx; else if (nx > fx + fw) tx = fx + fw;
      if (ny < fy) ty = fy; else if (ny > fy + fh) ty = fy + fh;
      var sx = nx + (tx > nx ? nb.width / 2 : -nb.width / 2);
      var sy = ny;
      var mx = (sx + tx) / 2;
      paths[i].setAttribute("d", "M" + sx.toFixed(1) + " " + sy.toFixed(1) +
        " C " + mx.toFixed(1) + " " + sy.toFixed(1) + ", " + mx.toFixed(1) + " " + ty.toFixed(1) +
        ", " + tx.toFixed(1) + " " + ty.toFixed(1));
    }
  }
  window.addEventListener("load", drawConnectors);
  window.addEventListener("resize", drawConnectors);
  requestAnimationFrame(function () { requestAnimationFrame(drawConnectors); });

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
      gsap.set([".x-hero__eye", ".x-hero__sub", ".x-hero__actions", ".hs-node", ".hs-cursor"],
        { opacity: 1, y: 0, clearProps: "transform" });
      gsap.set(".hs-frame", { clipPath: "inset(0 0% 0 0)" });
      gsap.set(".x-stage__svg path", { strokeDashoffset: 0 });
    };
    setTimeout(revealAll, 3200);

    requestAnimationFrame(function () {
     try {
      drawConnectors();
      var lines = hero.querySelectorAll("h1 .li");
      var paths = hero.querySelectorAll(".x-stage__svg path");
      // 연결선 초기 상태(길이만큼 숨김)
      Array.prototype.forEach.call(paths, function (p) {
        var len = 300;
        try { if (p.getTotalLength) len = p.getTotalLength() || 300; } catch (e) {}
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      // 초기 상태는 gsap.set으로 확정(CSS opacity:0 + .from() 충돌 방지)
      var eye = hero.querySelector(".x-hero__eye");
      var sub = hero.querySelector(".x-hero__sub");
      var acts = hero.querySelector(".x-hero__actions");
      gsap.set([eye, sub, acts], { opacity: 0, y: 16 });
      gsap.set(".hs-node", { y: 12 });

      var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(sweep, { scaleX: 1, duration: .7, ease: "power2.inOut" })                 // 1 레드 선
        .to(sweep, { scaleX: 0, transformOrigin: "right", duration: .5 }, "+=.05")
        .to(eye, { opacity: 1, y: 0, duration: .5 }, .25)                             // 2 아이브로
        .from(lines, { yPercent: 115, duration: 1, stagger: .09 }, .3)                // 3 줄 마스크 리빌
        .from(".x-hero h1 .r", { x: -18, opacity: 0, duration: .7 }, "-=.5")          // 4 '문의하는' 별도
        .to(".hs-frame", { clipPath: "inset(0 0% 0 0)", duration: .9 }, "-=.6")       // 5 화면 프레임 클립 리빌
        .to(paths, { strokeDashoffset: 0, duration: .8, stagger: .12 }, "-=.35")      // 6 연결선 순차 연결
        .to(".hs-node", { opacity: 1, y: 0, duration: .5, stagger: .1 }, "-=.7")
        .to(".hs-cursor", { opacity: 1, duration: .3 }, "-=.25")
        .to([sub, acts], { opacity: 1, y: 0, duration: .55, stagger: .1 }, "-=.55");

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
