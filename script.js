const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine=window.matchMedia("(pointer:fine)").matches;

/* reveal setup */
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}})},{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

const topbar=document.querySelector(".topbar"),progress=document.querySelector(".page-progress");let lastScroll=0;
addEventListener("scroll",()=>{const current=scrollY,max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=max>0?(current/max)*100+"%":"0%";if(topbar)topbar.style.transform=current>lastScroll&&current>140?"translate(-50%,-120px)":"translate(-50%,0)";lastScroll=current},{passive:true});

/* custom cursor */
const cursor=document.querySelector(".custom-cursor"),core=document.querySelector(".cursor-core"),ring=document.querySelector(".cursor-ring"),label=document.querySelector(".cursor-label"),glow=document.querySelector(".cursor-glow"),trail=document.querySelector(".cursor-trail");
let gx=innerWidth/2,gy=innerHeight/2,cx=gx,cy=gy,rx=gx,ry=gy,tx=gx,ty=gy;
const cursorTargets=()=>document.querySelectorAll("a,.button,.pill-row span,.project-visual,.brand-mark");
if(fine&&!reduce){
 cursor?.classList.add("active");
 addEventListener("pointermove",e=>{gx=e.clientX;gy=e.clientY;if(glow){glow.style.left=gx+"px";glow.style.top=gy+"px"}});
 function cursorLoop(){
   cx+=(gx-cx)*.42;cy+=(gy-cy)*.42;rx+=(gx-rx)*.16;ry+=(gy-ry)*.16;
   if(cursor){cursor.style.transform="translate3d("+cx+"px,"+cy+"px,0)";}
   if(ring){ring.style.transform="translate3d("+((rx-cx)*.18)+"px,"+((ry-cy)*.18)+"px,0) translate(-50%,-50%)";}
   requestAnimationFrame(cursorLoop);
 }
 cursorLoop();
 const setCursor=(mode,text="")=>{cursor?.classList.remove("is-link","is-project");if(mode)cursor?.classList.add(mode);if(label)label.textContent=text};
 cursorTargets().forEach(el=>{
   el.addEventListener("pointerenter",()=>{if(el.matches(".project-visual"))setCursor("is-project","open");else setCursor("is-link")});
   el.addEventListener("pointerleave",()=>setCursor(""));
 });
 addEventListener("pointerdown",e=>{
   cursor?.classList.add("is-click");
   const ripple=document.createElement("span");ripple.className="cursor-ripple";ripple.style.left=e.clientX+"px";ripple.style.top=e.clientY+"px";document.querySelector(".cursor-ripple-layer")?.appendChild(ripple);setTimeout(()=>ripple.remove(),750);
 });
 addEventListener("pointerup",()=>cursor?.classList.remove("is-click"));
}

/* trailing particles */
if(fine&&!reduce&&trail){
 const dots=[];for(let i=0;i<16;i++){const d=document.createElement("span");d.className="trail-dot";trail.appendChild(d);dots.push({el:d,x:gx,y:gy})}
 function animateTrail(){tx+=(gx-tx)*.16;ty+=(gy-ty)*.16;let x=tx,y=ty;dots.forEach((d,i)=>{d.x+=(x-d.x)*(.34-i*.015);d.y+=(y-d.y)*(.34-i*.015);d.el.style.transform="translate3d("+d.x+"px,"+d.y+"px,0) translate(-50%,-50%)";x=d.x;y=d.y});requestAnimationFrame(animateTrail)}animateTrail();
}

/* tilt + depth */
function tilt(el,strength){if(!fine||reduce)return;el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty("--mx",(x*100+50)+"%");el.style.setProperty("--my",(y*100+50)+"%");el.style.transform="perspective(1200px) rotateX("+(-y*strength)+"deg) rotateY("+(x*strength)+"deg) translateZ(8px) scale(1.015)"});el.addEventListener("pointerleave",()=>{el.style.transform="";el.style.removeProperty("--mx");el.style.removeProperty("--my")})}
document.querySelectorAll(".project-visual").forEach(c=>tilt(c,10));
document.querySelectorAll(".about-card,.contact-card").forEach(c=>tilt(c,5));

/* hero parallax */
const hero=document.querySelector(".hero-art"),orb=document.querySelector(".orb");
if(hero&&fine&&!reduce){hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.transform="perspective(1200px) rotateX("+(-y*4)+"deg) rotateY("+(x*6)+"deg)";if(orb){orb.style.transform="translate3d("+(x*18)+"px,"+(y*18)+"px,35px) rotateX("+(-y*5)+"deg) rotateY("+(x*5)+"deg)";orb.style.setProperty("--orb-x",(35+x*12)+"%");orb.style.setProperty("--orb-y",(28+y*12)+"%")}});hero.addEventListener("pointerleave",()=>{hero.style.transform="";if(orb)orb.style.transform=""})}

/* magnetic controls */
document.querySelectorAll(".magnetic").forEach(el=>{if(!fine||reduce)return;el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform="translate("+x*.14+"px,"+y*.14+"px) translateY(-2px)"});el.addEventListener("pointerleave",()=>el.style.transform="")});

/* project micro physics */
if(fine&&!reduce){
 document.querySelectorAll(".project-visual").forEach(card=>{
  card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty("--mx",(x*100+50)+"%");card.style.setProperty("--my",(y*100+50)+"%");card.style.setProperty("--depth-x",(x*14)+"px");card.style.setProperty("--depth-y",(y*14)+"px")});
 });
 document.querySelectorAll(".pill-row span").forEach(pill=>{pill.addEventListener("pointermove",e=>{const r=pill.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;pill.style.transform="translate("+x*5+"px,"+y*5+"px) translateY(-4px) rotate("+x*1.5+"deg)"});pill.addEventListener("pointerleave",()=>pill.style.transform="")});
}

/* staggered reveals */
document.querySelectorAll(".project").forEach((el,i)=>el.classList.add(i%2?"reveal-right":"reveal-left"));
document.querySelectorAll(".section-heading,.about-card,.contact-card").forEach(el=>el.classList.add("reveal-scale"));
document.querySelectorAll(".project-info").forEach((el,i)=>{el.classList.add("reveal");el.style.transitionDelay=(.08+(i%4)*.08)+"s";revealObserver.observe(el)});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

/* tiny easter egg: triple click the big Y */
const heroLetter=document.querySelector(".hero-letter");
let yClicks=0,yTimer;
heroLetter?.addEventListener("click",()=>{yClicks++;clearTimeout(yTimer);yTimer=setTimeout(()=>yClicks=0,700);if(yClicks===3){heroLetter.classList.add("y-found");setTimeout(()=>heroLetter.classList.remove("y-found"),1200)}});

/* smooth anchors */
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",()=>{const target=document.querySelector(link.getAttribute("href"));if(target)target.scrollIntoView({behavior:"smooth",block:"start"})}));
