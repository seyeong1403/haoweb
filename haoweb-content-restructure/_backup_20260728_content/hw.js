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

  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce||!window.gsap) return;
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
    var dist=function(){return track.scrollWidth-track.parentElement.clientWidth;};
    var htween=gsap.to(track,{x:function(){return -dist();},ease:"none",
      scrollTrigger:{trigger:".hpin",start:"top top",end:function(){return "+="+dist();},scrub:1,pin:true,invalidateOnRefresh:true,anticipatePin:1}});
    /* 패널 넘버: 가로 스크롤(containerAnimation)에 연동해 등장 */
    gsap.utils.toArray(".hpanel .no").forEach(function(no){
      gsap.from(no,{opacity:0,x:50,ease:"none",scrollTrigger:{trigger:no,containerAnimation:htween,start:"left 88%"}});
    });
  });

  /* 6 · 문장 단어 순차 밝아짐 */
  gsap.to("#stmt .w",{opacity:1,duration:.6,stagger:.12,ease:"none",
    scrollTrigger:{trigger:"#stmt",start:"top 78%",end:"top 40%",scrub:true}});

  addEventListener("load",function(){ScrollTrigger.refresh();});
})();
