(function(){
  /* 네비 + 모바일 메뉴 · 모션과 무관하게 항상 동작 */
  var nav=document.getElementById("nav"),burger=document.getElementById("burger"),mnav=document.getElementById("mnav");
  if(nav) addEventListener("scroll",function(){nav.classList.toggle("nav--solid",(window.scrollY||0)>30);},{passive:true});
  if(burger&&mnav){
    burger.addEventListener("click",function(){
      var o=mnav.classList.toggle("open"); mnav.hidden=!o;
      burger.setAttribute("aria-expanded",o); burger.textContent=o?"CLOSE":"MENU";
    });
    mnav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){mnav.classList.remove("open");mnav.hidden=true;burger.textContent="MENU";burger.setAttribute("aria-expanded","false");});});
  }

  /* 포트폴리오·인터뷰: 실데이터 있을 때만 노출(모션과 무관, 항상 실행) */
  (function(){
    var grid=document.getElementById("showcase-grid"), sec=document.getElementById("showcase");
    if(!grid||!sec) return;
    function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
    function load(u){return u?fetch(u).then(function(r){return r.ok?r.json():[];}).catch(function(){return[];}):Promise.resolve([]);}
    function card(href,t,s){return '<a href="'+esc(href)+'"><b>'+esc(t)+'</b>'+(s?'<span>'+esc(s)+'</span>':'')+'</a>';}
    Promise.all([load(grid.getAttribute("data-portfolio")),load(grid.getAttribute("data-interview"))]).then(function(r){
      var pf=Array.isArray(r[0])?r[0]:[], iv=Array.isArray(r[1])?r[1]:[];
      if(!pf.length&&!iv.length) return; /* 데이터 없음 → 섹션 숨김 유지 */
      var h="";
      pf.slice(0,2).forEach(function(p){h+=card(p.url||"portfolio.html",p.title||p.name||"프로젝트",p.summary||p.client||"");});
      iv.slice(0,2).forEach(function(v){h+=card(v.url||"interview.html",v.company||v.name||"고객 인터뷰",v.summary||v.quote||"");});
      grid.innerHTML=h; sec.hidden=false; sec.removeAttribute("aria-hidden");
    });
  })();

  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* CDN(gsap/ScrollTrigger) 로드 실패나 reduced-motion이면 모션 미적용 —
     콘텐츠는 무JS 기준 CSS로 전부 표시되므로 숨겨지지 않음 */
  if(reduce||!window.gsap||!window.ScrollTrigger) return;
  document.documentElement.classList.add("anim");
  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll (원리는 동일하나 lerp 등 세팅은 다르게) */
  if(window.Lenis){
    var lenis=new Lenis({lerp:.11,wheelMultiplier:1});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
  }

  /* 1 · 히어로 — 가로 클립 와이프(L→R), Narnia 세로 마스크와 다른 방향 */
  gsap.set(".hero h1 .ln>i",{clipPath:"inset(0 100% 0 0)"});
  gsap.to(".hero h1 .ln>i",{clipPath:"inset(0 0% 0 0)",duration:1.1,ease:"power4.out",stagger:.12,delay:.2});
  gsap.from(".hero__meta,.hero__sub,.cue,.hero__motif",{opacity:0,y:16,duration:.9,ease:"power3.out",stagger:.08,delay:.7});
  /* 히어로 라인 모티프 도트 패럴럭스 */
  gsap.to(".hero__motif",{"--p":"78%",ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:.6}});

  /* 2 · 몰입 — 스케일 스크럽 */
  gsap.fromTo(".imm__t",{scale:.82,opacity:.4},{scale:1,opacity:1,ease:"none",
    scrollTrigger:{trigger:".imm",start:"top bottom",end:"top top",scrub:.6}});

  /* 공통 리빌 */
  gsap.utils.toArray("[data-rv]").forEach(function(el){
    gsap.to(el,{opacity:1,y:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%"}});
  });

  /* 3 · 가로 핀 (데스크톱만 · 모바일은 세로 스택) */
  var mm=gsap.matchMedia();
  mm.add("(min-width:821px)",function(){
    var track=document.getElementById("htrack");
    if(!track) return; /* 서브페이지엔 가로핀 없음 — 가드 */
    var hpin=track.closest(".hpin");
    var dist=function(){return Math.max(0, track.scrollWidth - track.parentElement.clientWidth);};
    if(dist()<=0) return; /* 넘칠 게 없으면 핀 불필요(가로 스크롤도 발생 안 함) */
    if(hpin) hpin.classList.add("is-pinned"); /* 핀 활성일 때만 overflow 숨김(콘텐츠 갇힘 방지) */
    var htween=gsap.to(track,{x:function(){return -dist();},ease:"none",
      scrollTrigger:{trigger:".hpin",start:"top top",end:function(){return "+="+dist();},scrub:1,pin:true,invalidateOnRefresh:true,anticipatePin:1}});
    /* 활성 패널 토글 — 가로 스크롤로 뷰포트 중앙에 온 패널의 숫자만 레드(모션 따라 이동) */
    var panels=gsap.utils.toArray(".hpanel");
    panels.forEach(function(panel){
      ScrollTrigger.create({trigger:panel,containerAnimation:htween,start:"left center",end:"right center",
        onToggle:function(self){panel.classList.toggle("is-active",self.isActive);}});
    });
    if(panels[0]) panels[0].classList.add("is-active"); /* 초기 활성 */
    return function(){ if(hpin) hpin.classList.remove("is-pinned"); }; /* 미디어 이탈 시 정리 */
  });

  /* 6 · 문장 단어 순차 밝아짐 */
  gsap.to("#stmt .w",{opacity:1,duration:.6,stagger:.12,ease:"none",
    scrollTrigger:{trigger:"#stmt",start:"top 78%",end:"top 40%",scrub:true}});

  addEventListener("load",function(){ScrollTrigger.refresh();});
})();
