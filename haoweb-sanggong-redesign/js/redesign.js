/* ============================================================
   HAOWEB — 상공 레퍼런스 재설계 · redesign.js
   오버레이 메뉴 · 히어로 슬라이더 · 헤더 상태 · 프리뷰 안전망
   진행적 향상: JS 없으면 전체 콘텐츠 그대로 노출.
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("rd-js");
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* ---------- 단어 분할(split-text): <br>·<b> 보존, 각 단어를 마스크 span으로 ---------- */
  function splitWords(rootEl) {
    var words = [], idx = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var parts = ch.nodeValue.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (p === "") return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "rd-w";
            var wi = document.createElement("span"); wi.className = "rd-wi"; wi.textContent = p;
            wi.style.transitionDelay = Math.min(idx * 0.04, 0.5) + "s"; idx++;
            w.appendChild(wi); frag.appendChild(w); words.push(wi);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && ch.tagName !== "BR") {
          walk(ch); // <b> 등 인라인 요소 안으로 재귀(굵기 유지)
        }
      });
    })(rootEl);
    return words;
  }
  // 단어 리빌 안전망: CSS transition이 진행되지 않으면(프리뷰 정지) transition 끄고 최종값 강제
  function forceWords(words) {
    setTimeout(function () {
      words.forEach(function (w) {
        var m = getComputedStyle(w).transform;
        var ty = m === "none" ? 0 : parseFloat((m.match(/matrix\([^)]*,\s*([\-0-9.]+)\)\s*$/) || [])[1] || 0);
        if (Math.abs(ty) > 2) { w.style.transition = "none"; w.style.transform = "translateY(0)"; }
      });
    }, 1400);
  }

  /* ---------- Header: 스크롤 시 solid ---------- */
  var header = document.querySelector(".rd-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("solid", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 오버레이 메뉴 ---------- */
  var overlay = document.querySelector(".rd-overlay");
  var openBtn = document.querySelector("[data-menu-open]");
  var closeBtn = document.querySelector("[data-menu-close]");
  var lastFocus = null;

  function focusables() {
    if (!overlay) return [];
    return Array.prototype.slice.call(
      overlay.querySelectorAll('a[href],button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }
  var ovBg = overlay ? overlay.querySelector(".rd-overlay-bg") : null;
  var ovIn = overlay ? overlay.querySelector(".rd-overlay-in") : null;
  var menuWords = overlay ? overlay.querySelectorAll(".rd-menu-list > li > a") : [];
  function openMenu() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("rd-lock");
    var f = focusables();
    if (f[0]) setTimeout(function () { f[0].focus(); }, 60);
    // 안전망: 배경/메뉴어 transition이 진행되지 않으면 최종상태 강제(프리뷰 정지 대비)
    setTimeout(function () {
      if (!overlay.classList.contains("open")) return;
      if (ovBg && getComputedStyle(ovBg).transform.indexOf(", 0, 0)") > -1) {
        ovBg.style.transition = "none"; ovBg.style.transform = "scaleY(1)";
      }
      if (ovIn && parseFloat(getComputedStyle(ovIn).opacity) < 0.05) {
        ovIn.style.transition = "none"; ovIn.style.opacity = "1";
      }
      menuWords.forEach(function (a) {
        var t = getComputedStyle(a).transform;
        if (t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)") {
          a.style.transition = "none"; a.style.transform = "translateY(0)";
        }
      });
    }, 760);
  }
  function closeMenu() {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("rd-lock");
    // 강제했던 inline 초기화 — 다음 열림에서 다시 애니메이션되도록
    if (ovBg) { ovBg.style.transform = ""; ovBg.style.transition = ""; }
    if (ovIn) { ovIn.style.opacity = ""; ovIn.style.transition = ""; }
    menuWords.forEach(function (a) { a.style.transform = ""; a.style.transition = ""; });
    if (lastFocus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (!overlay || !overlay.classList.contains("open")) return;
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.key === "Tab") {
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- 히어로 슬라이더 ---------- */
  var hero = document.querySelector(".rd-hero");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".rd-hero-slide"));
    var frames = Array.prototype.slice.call(hero.querySelectorAll(".rd-hframe"));
    // 각 슬라이드 헤드라인을 단어 단위로 분할(마스크 스태거용)
    slides.forEach(function (s) {
      var t = s.querySelector(".rd-htitle");
      if (t) s._words = splitWords(t);
    });
    var cur = document.querySelector("[data-count-cur]");
    var totalEl = document.querySelector("[data-count-total]");
    var progBar = document.querySelector(".rd-prog i");
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var i = 0, timer = null, frameTimer = null, DURATION = 6400;
    var n = slides.length;
    if (totalEl) totalEl.textContent = ("0" + n).slice(-2);

    function reconcileFrames() {
      // 실브라우저: 이 시점(0.9s)엔 이미 transition(0.7s) 완료 → 대개 no-op(페이드 유지)
      // 프리뷰(transition 정지): 값이 안 넘어가면 transition을 끄고 최종값 강제
      frames.forEach(function (f) {
        var want = f.classList.contains("active") ? "1" : "0";
        if (getComputedStyle(f).opacity !== want) {
          f.style.transition = "none";
          f.style.opacity = want;
        }
        f.style.transform = want === "1" ? "none" : "";
      });
    }

    function paint(idx, dir) {
      slides.forEach(function (s, k) {
        var on = k === idx;
        s.classList.toggle("active", on);
        if (on) revealSlide(s, dir);
      });
      frames.forEach(function (f, k) { f.classList.toggle("active", k === idx); });
      // 안전망(debounce): 클래스(=진실원본) 기준으로만 최종 opacity 강제 — 프리뷰 transition 정지 대비
      clearTimeout(frameTimer);
      frameTimer = setTimeout(reconcileFrames, 900);
      if (cur) cur.textContent = ("0" + (idx + 1)).slice(-2);
    }
    function revealSlide(s, dir) {
      // 헤드라인 단어(CSS transition 마스크): 비활성 슬라이드는 리셋해 재진입 시 다시 애니메이션
      slides.forEach(function (o) {
        if (o === s) return;
        var ot = o.querySelector(".rd-htitle"); if (ot) ot.classList.remove("rd-in");
        (o._words || []).forEach(function (w) { w.style.transition = ""; w.style.transform = ""; });
      });
      var t = s.querySelector(".rd-htitle"); if (t) t.classList.add("rd-in");
      if (!reduce) forceWords(s._words || []);

      // 카테고리·리드·CTA (블록 페이드 — GSAP)
      var blocks = s.querySelectorAll(".rd-anim");
      if (!hasGSAP || reduce) { blocks.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; }); return; }
      window.gsap.killTweensOf(blocks);
      window.gsap.fromTo(blocks,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.08, delay: 0.18, overwrite: true });
      setTimeout(function () {
        if (!s.classList.contains("active")) return;
        blocks.forEach(function (el) {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) { el.style.opacity = 1; el.style.transform = "none"; }
        });
      }, 1250);
    }
    function runProgress() {
      if (!progBar) return;
      if (hasGSAP && !reduce) {
        window.gsap.killTweensOf(progBar);
        window.gsap.fromTo(progBar, { scaleX: 0 }, { scaleX: 1, duration: DURATION / 1000, ease: "none" });
      }
    }
    function go(idx, manual) {
      var dir = idx > i || (i === n - 1 && idx === 0) ? 1 : -1;
      i = (idx + n) % n;
      paint(i, manual ? dir : 1);
      runProgress();
      if (manual) restart();
    }
    function nextSlide() { go(i + 1); }
    function start() { if (n > 1) timer = setInterval(nextSlide, DURATION); runProgress(); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (prev) prev.addEventListener("click", function () { go(i - 1, true); });
    if (next) next.addEventListener("click", function () { go(i + 1, true); });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", function () { if (!timer) start(); });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (!timer) start();
    });

    // 초기: 첫 슬라이드 즉시 노출(폰트/IO 대기 없음 — 프리뷰 프리즈 안전)
    paint(0, 1);
    if (!reduce && n > 1) start();
    // 안전망: 혹시 애니메이션이 걸려 숨어있으면 강제 노출
    setTimeout(function () {
      var a = hero.querySelector(".rd-hero-slide.active");
      if (a) a.querySelectorAll(".rd-anim").forEach(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) { el.style.opacity = 1; el.style.transform = "none"; }
      });
    }, 1600);
  }

  /* ---------- 04 Production Services: 목록 hover → 비주얼 반응 ---------- */
  var serv = document.querySelector(".rd-serv");
  if (serv) {
    var sItems = Array.prototype.slice.call(serv.querySelectorAll(".rd-serv-item"));
    var sFrames = Array.prototype.slice.call(serv.querySelectorAll(".rd-serv-frame"));
    var activateServ = function (idx) {
      sItems.forEach(function (it, k) { it.classList.toggle("on", k === idx); });
      sFrames.forEach(function (f, k) { f.classList.toggle("active", k === idx); });
      // 안전망(프리뷰 opacity transition 정지 대비)
      setTimeout(function () {
        sFrames.forEach(function (f) {
          var want = f.classList.contains("active") ? "1" : "0";
          if (getComputedStyle(f).opacity !== want) { f.style.transition = "none"; f.style.opacity = want; }
        });
      }, 600);
    };
    sItems.forEach(function (it, k) {
      it.addEventListener("mouseenter", function () { activateServ(k); });
      it.addEventListener("focusin", function () { activateServ(k); });
    });
    activateServ(0);
  }

  /* ---------- 스크롤 리빌: 단어 분할(타이틀 전반) · 블록(그 외) ---------- */
  // 전 페이지 타이틀을 단어별로 분할(마스크 스태거) — 세부페이지 .section-title / .page-hero-title 포함
  var SPLIT_SEL = ".rd-split, .page-hero-title, .section-title, .rd-serv-name, .rd-work-name";
  var splitEls = Array.prototype.slice.call(document.querySelectorAll(SPLIT_SEL));
  splitEls.forEach(function (el) { el._split = true; el._words = splitWords(el); });
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".rd-reveal, .reveal"))
    .filter(function (el) { return !el._split; });

  function fireSplit(el) {
    if (el._done) return; el._done = true;
    el.style.opacity = 1;                          // .reveal opacity 게이트 해제(있어도)
    el.classList.add("rd-in");                     // CSS transition 마스크 리빌
    if (!reduce) forceWords(el._words || []);      // 프리뷰 정지 대비 안전망
  }
  function fireReveal(el) {
    if (el._done) return; el._done = true;
    if (!hasGSAP || reduce) { el.style.opacity = 1; el.style.transform = "none"; return; }
    window.gsap.fromTo(el, { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", overwrite: true });
    // 안전망: 애니메이션 시간 이후 최종값 무조건 스냅(실브라우저 no-op, 프리뷰 정지 대비)
    setTimeout(function () { window.gsap.killTweensOf(el); window.gsap.set(el, { y: 0, opacity: 1 }); }, 1300);
  }

  var allReveal = splitEls.concat(revealEls);
  function fireEl(el) { el._split ? fireSplit(el) : fireReveal(el); }

  // 스크롤 기반 체크(주력 · IO가 얼리는 프리뷰에서도 확실 · 실브라우저에도 안전)
  // rAF는 프리뷰에서 정지되므로 사용하지 않고 직접 호출(리스트는 완료분을 splice해 작게 유지)
  function checkReveal() {
    var vh = innerHeight;
    for (var j = allReveal.length - 1; j >= 0; j--) {
      var el = allReveal[j];
      if (el._done) { allReveal.splice(j, 1); continue; }
      if (el.getBoundingClientRect().top < vh * 0.88) { fireEl(el); allReveal.splice(j, 1); }
    }
  }
  window.addEventListener("scroll", checkReveal, { passive: true });
  window.addEventListener("resize", checkReveal, { passive: true });
  // IO도 병행(지원 시)
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { fireEl(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    allReveal.slice().forEach(function (el) { io.observe(el); });
  }
  checkReveal();                 // 초기(첫 화면) 즉시
  setTimeout(checkReveal, 400);  // 폰트/레이아웃 안정 후 재확인
})();
