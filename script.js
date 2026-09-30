
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine=window.matchMedia("(pointer:fine)").matches;
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}})},{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));
const topbar=document.querySelector(".topbar"),progress=document.querySelector(".page-progress");let lastScroll=0;
addEventListener("scroll",()=>{const current=scrollY,max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=max>0?(current/max)*100+"%":"0%";if(topbar)topbar.style.transform=current>lastScroll&&current>140?"translate(-50%,-120px)":"translate(-50%,0)";lastScroll=current},{passive:true});
const glow=document.querySelector(".cursor-glow"),trail=document.querySelector(".cursor-trail");let gx=0,gy=0,tx=0,ty=0;
addEventListener("pointermove",e=>{gx=e.clientX;gy=e.clientY;if(glow){glow.style.left=gx+"px";glow.style.top=gy+"px"}});
if(fine&&!reduce&&trail){const dots=[];for(let i=0;i<14;i++){const d=document.createElement("span");d.className="trail-dot";trail.appendChild(d);dots.push({el:d,x:innerWidth/2,y:innerHeight/2})}function animateTrail(){tx+=(gx-tx)*.16;ty+=(gy-ty)*.16;let x=tx,y=ty;dots.forEach((d,i)=>{d.x+=(x-d.x)*(.34-i*.015);d.y+=(y-d.y)*(.34-i*.015);d.el.style.transform="translate3d("+d.x+"px,"+d.y+"px,0) translate(-50%,-50%)";x=d.x;y=d.y});requestAnimationFrame(animateTrail)}animateTrail()}
function tilt(el,strength){if(!fine||reduce)return;el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty("--mx",(x*100+50)+"%");el.style.setProperty("--my",(y*100+50)+"%");el.style.transform="perspective(1200px) rotateX("+(-y*strength)+"deg) rotateY("+(x*strength)+"deg) translateZ(8px) scale(1.015)"});el.addEventListener("pointerleave",()=>{el.style.transform="";el.style.removeProperty("--mx");el.style.removeProperty("--my")})}
document.querySelectorAll(".project-visual").forEach(c=>tilt(c,10));
document.querySelectorAll(".about-card,.contact-card").forEach(c=>tilt(c,5));
const hero=document.querySelector(".hero-art"),orb=document.querySelector(".orb");
if(hero&&fine&&!reduce){hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.transform="perspective(1200px) rotateX("+(-y*4)+"deg) rotateY("+(x*6)+"deg)";if(orb){orb.style.transform="translate3d("+(x*18)+"px,"+(y*18)+"px,35px) rotateX("+(-y*5)+"deg) rotateY("+(x*5)+"deg)";orb.style.setProperty("--orb-x",(35+x*12)+"%");orb.style.setProperty("--orb-y",(28+y*12)+"%")}});hero.addEventListener("pointerleave",()=>{hero.style.transform="";if(orb)orb.style.transform=""})}
document.querySelectorAll(".magnetic").forEach(el=>{if(!fine||reduce)return;el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform="translate("+(x*.14)+"px,"+(y*.14)+"px) translateY(-2px)"});el.addEventListener("pointerleave",()=>el.style.transform="")});
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",()=>{const target=document.querySelector(link.getAttribute("href"));if(target)target.scrollIntoView({behavior:"smooth",block:"start"})}));
