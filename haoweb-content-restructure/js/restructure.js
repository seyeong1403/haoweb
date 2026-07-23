/* HAOWEB 재정립 · restructure.js — v5 (핵심 페이지 집중 단계)
   모션 원칙(docs/DESIGN_DIRECTION_CURRENT.md):
   A 텍스트 마스크 리빌 / B 클립 리빌 / C Sticky·Pin / D Hover(CSS)
   숨김은 전부 JS가 붙이는 클래스로만 발생 — 무JS·reduced-motion에서는 항상 표시. */
(function () {
  "use strict";

  // 1) 현재 페이지 표시(aria-current) — 헤더·모바일 메뉴 공통
  var here = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll('.hd a[href], .m-panel a[href]').forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === here) a.setAttribute("aria-current", "page");
  });

  // 2) 모바일 메뉴(details) aria-expanded 동기화 + 링크 클릭 시 닫기 + ESC
  var m = document.querySelector(".m-menu");
  if (m) {
    var sum = m.querySelector("summary");
    var sync = function () { sum.setAttribute("aria-expanded", m.open ? "true" : "false"); };
    m.addEventListener("toggle", sync); sync();
    m.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { m.open = false; });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && m.open) { m.open = false; sum.focus(); }
    });
  }

  // 3) 무료 제안 페이지: ?type=renewal 진입 시 리뉴얼 항목 선택 상태로
  if (/type=renewal/.test(location.search)) {
    var rr = document.querySelector('input[name="type"][value="renewal"]');
    if (rr) rr.checked = true;
  }

  // 4) 모션 층 — 지원 브라우저·모션 허용 환경에서만
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var root = document.documentElement;
    root.classList.add("js-anim");
    var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };

    // 4-A) 텍스트 마스크 리빌 — <br> 기준 줄 분해 → 줄 단위 상승
    var masks = document.querySelectorAll(".mask-rv");
    masks.forEach(function (el) {
      var lines = [[]];
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType === 1 && node.tagName === "BR") { lines.push([]); node.remove(); }
        else lines[lines.length - 1].push(node);
      });
      lines.forEach(function (bucket) {
        if (!bucket.length) return;
        var ln = document.createElement("span"); ln.className = "ln";
        var li = document.createElement("span"); li.className = "li";
        el.insertBefore(ln, bucket[0]);
        bucket.forEach(function (n) { li.appendChild(n); });
        ln.appendChild(li);
      });
      el.classList.add("pre");
    });
    var settleMask = function (el) {
      setTimeout(function () {
        el.classList.remove("pre", "go");
        el.querySelectorAll(".li").forEach(function (l) { l.style.transitionDelay = ""; });
      }, 1700);
    };
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.querySelectorAll(".li").forEach(function (l, i) { l.style.transitionDelay = (i * 110) + "ms"; });
        el.classList.add("go");
        mio.unobserve(el);
        settleMask(el);
      });
    }, { threshold: 0.25 });
    masks.forEach(function (el) { mio.observe(el); });

    // 4-B) 클립 리빌 — 화면·이미지 블록(텍스트보다 늦게: delay는 CSS transition으로)
    var clips = document.querySelectorAll(".clip-rv");
    clips.forEach(function (el) { el.classList.add("pre"); });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("go");
        cio.unobserve(e.target);
        (function (el) { setTimeout(function () { el.classList.remove("pre", "go"); }, 1400); })(e.target);
      });
    }, { threshold: 0.2 });
    clips.forEach(function (el) { cio.observe(el); });

    // 4-보조) 소형 요소 리빌(.rv) — 마스크·핀 대상 제외, 선택 적용
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      ".col-block, .path > a, .path > div, .quote-card, .demo-win," +
      " ol.flow li, ol.steps li, .dl > div, details.faq, .form, .tbl-wrap," +
      " .cta-band .cta-grid a, .svc-index a, .plan-rows a, .plan-free, .cta-rows a," +
      " .type-grid .tg, .split-choice .sc, .giant-list a"
    )).filter(function (el) { return !el.closest(".pin-stage") && !el.querySelector(".mask-rv"); });
    var settle = function (el) {
      setTimeout(function () { el.classList.remove("rv", "in"); el.style.transitionDelay = ""; }, 1100);
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
    setTimeout(function () {
      targets.forEach(function (el) { if (el.classList.contains("rv")) { el.classList.add("in"); settle(el); } });
      masks.forEach(function (el) { el.classList.remove("pre"); });
      clips.forEach(function (el) { el.classList.remove("pre"); });
    }, 2600); // 안전망: 어떤 이유로든 누락되면 전부 표시

    // 4-C1) 히어로 로드 시퀀스(마스크 h1 제외 요소 순차 등장)
    var hero = document.querySelector(".page-hero");
    var hs = document.querySelectorAll(
      ".page-hero .crumbs, .page-hero .lead, .page-hero .hero-meta, .page-hero .hero-actions, .hero-grid > div[aria-hidden]"
    );
    hs.forEach(function (el, i) {
      el.classList.add("hs");
      el.style.transitionDelay = (260 + i * 120) + "ms";
    });
    setTimeout(function () { hs.forEach(function (el) { el.classList.add("on"); }); }, 40);
    setTimeout(function () {
      hs.forEach(function (el) { el.classList.remove("hs", "on"); el.style.transitionDelay = ""; });
    }, 2400);

    // 4-C2) 거대 키워드(.sec-kw) 글자 단위 라이즈
    var kws = document.querySelectorAll(".sec-kw");
    kws.forEach(function (kw) {
      Array.prototype.slice.call(kw.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split("").forEach(function (chr) {
            var s = document.createElement("span");
            s.className = "ch";
            s.textContent = chr === " " ? " " : chr;
            frag.appendChild(s);
          });
          kw.replaceChild(frag, node);
        } else if (node.nodeType === 1) node.classList.add("ch");
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
    setTimeout(function () { kws.forEach(function (el) { el.classList.remove("pre", "go"); }); }, 3200);

    // 4-C3) 플로팅 문의 필: 히어로를 지나면 표시
    var fc = document.querySelector(".float-cta");
    if (fc && hero) {
      var syncFloat = function () {
        fc.classList.toggle("show", window.scrollY > hero.offsetHeight + 80);
      };
      window.addEventListener("scroll", syncFloat, { passive: true });
      syncFloat();
    }

    // 4-C4) 스크럽 엔진 — 스크롤 위치 실시간 연동(핀·하이라이트·클립 진행)
    var desktopMotion = window.matchMedia("(min-width:961px)").matches;
    var pinSec = document.querySelector(".pin-sec");
    var pinSpace = (pinSec && desktopMotion) ? pinSec.querySelector(".pin-space") : null;
    var pinItems = pinSpace ? Array.prototype.slice.call(pinSec.querySelectorAll(".pin-item")) : [];
    var pinNavs = pinSpace ? Array.prototype.slice.call(pinSec.querySelectorAll(".pin-nav span")) : [];
    if (pinItems.length) pinItems[0].classList.add("act");
    var mth = document.querySelector(".mth-steps");
    var mthItems = [];
    if (mth && desktopMotion) { mth.classList.add("scrub"); mthItems = Array.prototype.slice.call(mth.children); }
    var xrTop = document.querySelector(".xr-top");
    var xrFrame = document.querySelector(".xr-frame");
    var kwList = Array.prototype.slice.call(kws);
    var scrubTick = false;
    var applyScrub = function () {
      scrubTick = false;
      var vh = window.innerHeight;
      // 거대 키워드 좌우 드리프트
      kwList.forEach(function (kw) {
        var r = kw.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var pr = clamp01((vh - r.top) / (vh + r.height));
        kw.classList.add("scrub-x");
        kw.style.transform = "translateX(" + ((pr - 0.5) * -70).toFixed(1) + "px)";
      });
      // 핀 장면: 진행률로 항목·인디케이터 전환
      if (pinSpace && pinItems.length) {
        var pr2 = pinSpace.getBoundingClientRect();
        var total = pinSpace.offsetHeight - vh;
        if (total > 0) {
          var pp = clamp01(-pr2.top / total);
          var idx = Math.min(pinItems.length - 1, Math.floor(pp * pinItems.length));
          pinItems.forEach(function (el, i) { el.classList.toggle("act", i === idx); });
          pinNavs.forEach(function (el, i) { el.classList.toggle("on", i === idx); });
        }
      }
      // 제작 방식: 화면 중심에 가장 가까운 단계 하이라이트
      if (mthItems.length) {
        var best = -1, bestD = Infinity;
        mthItems.forEach(function (li, i) {
          var r = li.getBoundingClientRect();
          var d = Math.abs((r.top + r.height / 2) - vh * 0.45);
          if (d < bestD) { bestD = d; best = i; }
        });
        mthItems.forEach(function (li, i) { li.classList.toggle("act", i === best); });
      }
      // 리뉴얼 X-ray: 진행률만큼 표면이 걷히고 내부 구조가 드러남
      if (xrTop && xrFrame) {
        var r3 = xrFrame.getBoundingClientRect();
        var pr3 = clamp01((vh * 0.9 - r3.top) / (vh * 0.9));
        xrTop.style.clipPath = "inset(0 0 " + (pr3 * 78).toFixed(1) + "% 0)";
      }
    };
    var reqScrub = function () {
      if (scrubTick) return;
      scrubTick = true;
      if (window.requestAnimationFrame) requestAnimationFrame(applyScrub); else setTimeout(applyScrub, 16);
    };
    window.addEventListener("scroll", reqScrub, { passive: true });
    window.addEventListener("resize", reqScrub, { passive: true });
    setInterval(applyScrub, 300); // rAF가 멈춘 환경(일부 내장 브라우저) 보조
    setTimeout(applyScrub, 60);
  }
})();
