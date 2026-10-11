(() => {
  const nav = document.querySelector('.site-header nav');
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.textContent = isOpen ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); if (menu) menu.textContent = '☰';
  }));

  const grid=document.getElementById('app-grid'), empty=document.getElementById('empty-state'), count=document.getElementById('app-count');
  const safeUrl=value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}};
  const element=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const money=n=>Number(n||0).toLocaleString('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:2});
  async function getApps(){
    const url=window.YAZONI_SUPABASE_URL||'', key=window.YAZONI_SUPABASE_PUBLISHABLE_KEY||'';
    if(url&&key&&window.supabase?.createClient){
      const client=window.supabase.createClient(url,key);
      const {data,error}=await client.from('apps').select('id,name,description,version,platform,price,published,checkout_url,icon_url,color,file_path').eq('published',true).order('created_at',{ascending:false});
      if(error)throw error;
      return await Promise.all((data||[]).map(async app=>{
        let downloadUrl='';
        if(Number(app.price||0)===0&&app.file_path){
          const {data:link}=await client.storage.from('app-files').createSignedUrl(app.file_path,3600);
          downloadUrl=link?.signedUrl||'';
        }
        return {name:app.name,description:app.description,version:app.version,platform:app.platform,status:Number(app.price||0)>0?'PAID ACCESS':'EARLY ACCESS',icon:app.name?.slice(0,1)||'Y',color:app.color,iconColor:app.color,iconUrl:app.icon_url,price:Number(app.price||0),checkoutUrl:app.checkout_url,downloadUrl};
      }));
    }
    return Array.isArray(window.YAZONI_APPS)?window.YAZONI_APPS:[];
  }
  function render(apps){
    count.textContent=apps.length+' '+(apps.length===1?'APP':'APPS');
    empty.hidden=apps.length>0;grid.replaceChildren();
    apps.forEach(app=>{
      const card=element('article','app-card'),cover=element('div','app-cover');
      cover.style.setProperty('--app-color',app.color||'#e9e8dd');cover.style.setProperty('--app-icon',app.iconColor||app.color||'#d7f36a');
      if(app.iconUrl&&safeUrl(app.iconUrl)){const img=element('img','app-icon-image');img.src=safeUrl(app.iconUrl);img.alt=(app.name||'')+' icon';cover.append(img);}
      else cover.append(element('span','app-icon',app.icon||(app.name||'Y').slice(0,1)));
      cover.append(element('span','app-version',app.version?'v'+app.version:'EARLY BUILD'));
      const body=element('div','app-card-body'),meta=element('div','app-meta');
      meta.append(element('span','app-platform',app.platform||'PLATFORM TBC'),element('span','app-status',app.status||'EARLY ACCESS'));
      body.append(meta,element('h3','',app.name||'Untitled app'),element('p','app-description',app.description||'Details coming soon.'));
      const actions=element('div','app-actions');
      const price=Number(app.price||0);
      actions.append(element('span','app-price',price>0?money(price):'FREE'));
      const target=price>0?safeUrl(app.checkoutUrl):safeUrl(app.downloadUrl||app.downloadUrl);
      if(target){const link=element('a','',price>0?'Buy access ↗':'Download ↓');link.href=target;link.target='_blank';link.rel='noreferrer';actions.append(link);}
      else actions.append(element('span','',price>0?'PURCHASE SOON':'BUILD NOT RELEASED'));
      body.append(actions);card.append(cover,body);grid.append(card);
    });
  }
  getApps().then(render).catch(error=>{
    count.textContent='STORE UNAVAILABLE';empty.hidden=false;
    const message=empty.querySelector('p:not(.eyebrow)');if(message)message.textContent='The app catalogue could not load right now. Please try again later.';
    console.error('Yazoni Labs catalogue:',error);
  });
})();