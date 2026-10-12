(() => {
  const $ = id => document.getElementById(id);
  const safeUrl = value => { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const node = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
  const money = n => Number(n || 0).toLocaleString('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:2});
  const params = new URLSearchParams(location.search);
  function setupNav() {
    const nav=document.querySelector('.site-header nav'),menu=document.querySelector('.menu-toggle');
    menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰';});
    nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu)menu.textContent='☰';}));
  }
  async function loadApps() {
    const url=window.YAZONI_SUPABASE_URL||'',key=window.YAZONI_SUPABASE_PUBLISHABLE_KEY||'';
    if(url&&key&&window.supabase?.createClient){
      const client=window.supabase.createClient(url,key);
      const {data,error}=await client.from('apps').select('id,name,description,version,platform,price,published,checkout_url,icon_url,color,file_path,release_notes,download_count,created_at,updated_at').eq('published',true).order('created_at',{ascending:false});
      if(error)throw error;
      return await Promise.all((data||[]).map(async a=>{
        let downloadUrl='';
        if(Number(a.price||0)===0&&a.file_path){
          if(/^https:\/\//i.test(a.file_path)) downloadUrl=safeUrl(a.file_path);
          else {const {data:link}=await client.storage.from('app-files').createSignedUrl(a.file_path,3600);downloadUrl=link?.signedUrl||'';}
        }
        return {...a,key:String(a.id),status:Number(a.price||0)>0?'PAID ACCESS':'AVAILABLE',icon:a.name?.slice(0,1)||'Y',iconColor:a.color,iconUrl:a.icon_url,downloadUrl,downloadCount:Number(a.download_count||0)};
      }));
    }
    return (Array.isArray(window.YAZONI_APPS)?window.YAZONI_APPS:[]).map((a,i)=>({...a,key:String(a.id||a.slug||a.name||i),status:a.status||'AVAILABLE',price:Number(a.price||0)}));
  }
  function makeCard(app) {
    const card=node('article','app-card'),cover=node('div','app-cover');
    cover.style.setProperty('--app-color',app.color||'#e9e8dd');cover.style.setProperty('--app-icon',app.iconColor||app.color||'#d7f36a');
    if(app.iconUrl&&safeUrl(app.iconUrl)){const img=node('img','app-icon-image');img.src=safeUrl(app.iconUrl);img.alt=(app.name||'')+' app icon';cover.append(img);}
    else cover.append(node('span','app-icon',app.icon||app.name?.slice(0,1)||'Y'));
    cover.append(node('span','app-version',app.version?'v'+app.version:'NEW APP'));
    const body=node('div','app-card-body'),meta=node('div','app-meta');
    meta.append(node('span','app-platform',app.platform||'Platform details soon'),node('span','app-status',app.status||'AVAILABLE'));
    body.append(meta,node('h3','',app.name||'Untitled app'),node('p','app-description',app.description||'App details coming soon.'));
    const actions=node('div','app-actions');actions.append(node('span','app-price',Number(app.price)>0?money(app.price):'FREE'));
    const link=node('a','app-details-link','View app ↗');link.href='app.html?id='+encodeURIComponent(app.key);actions.append(link);
    body.append(actions);card.append(cover,body);return card;
  }
  function renderCards(container,apps) { if(!container)return;container.replaceChildren();apps.forEach(a=>container.append(makeCard(a))); }
  function renderCatalog(apps) {
    const grid=$('all-apps'),empty=$('catalog-empty'),search=$('catalog-search'),total=$('catalog-total');
    if(!grid)return;
    const paint=()=>{const q=(search?.value||'').trim().toLowerCase(),shown=apps.filter(a=>(a.name+' '+a.description+' '+a.platform).toLowerCase().includes(q));
      renderCards(grid,shown);if(total)total.textContent=shown.length+' '+(shown.length===1?'APP':'APPS');
      if(empty)empty.hidden=shown.length>0;
      if($('empty-title'))$('empty-title').textContent=apps.length?'No apps match that search.':'The library is getting ready.';
      if($('empty-description'))$('empty-description').textContent=apps.length?'Try a different name or platform.':'There are no published apps yet. Check back when the next release is ready.';
    };
    search?.addEventListener('input',paint);paint();
  }
  function renderDetail(apps) {
    const root=$('app-detail');if(!root)return;
    const id=params.get('id'),app=apps.find(a=>String(a.id)===id||String(a.key)===id||String(a.slug)===id);
    if(!app){root.className='detail-not-found';root.replaceChildren(node('div','not-found-mark','⌘'),node('p','eyebrow','APP NOT FOUND'),node('h1','','This app isn’t here.'),node('p','','It may not be published yet, or the link may be outdated.'),Object.assign(node('a','button button-dark','Back to all apps ↗'),{href:'apps.html'}));$('detail-crumb').textContent='Not found';return;}
    document.title=app.name+' — Yazoni Labs';$('detail-crumb').textContent=app.name;
    const layout=node('section','detail-hero'),visual=node('div','detail-visual');visual.style.setProperty('--app-color',app.color||'#e9e8dd');
    if(app.iconUrl&&safeUrl(app.iconUrl)){const img=node('img','detail-app-icon');img.src=safeUrl(app.iconUrl);img.alt=app.name+' icon';visual.append(img);}else visual.append(node('div','detail-app-icon detail-icon-letter',app.icon||app.name?.slice(0,1)||'Y'));
    visual.append(node('span','detail-visual-label','YAZONI LABS APP'));
    const copy=node('div','detail-copy');copy.append(node('p','eyebrow','APP OVERVIEW'),node('h1','',app.name),node('p','detail-description',app.description||'More information coming soon.'));
    const tags=node('div','detail-tags');tags.append(node('span','detail-tag',app.platform||'Platform details soon'),node('span','detail-tag',app.version?'Version '+app.version:'Version not specified'),node('span','detail-tag',Number(app.price)>0?'Paid app':'Free app'));copy.append(tags);
    const price=node('p','detail-price',Number(app.price)>0?money(app.price):'Free to use');copy.append(price);
    const action=Number(app.price)>0?safeUrl(app.checkout_url):safeUrl(app.downloadUrl);
    if(action){const cta=node('a','button button-dark',Number(app.price)>0?'Get this app ↗':'Download app ↓');cta.href=action;cta.target='_blank';cta.rel='noreferrer';if(Number(app.price)===0&&app.id){cta.addEventListener('click',async e=>{e.preventDefault();cta.textContent='Preparing download…';cta.setAttribute('aria-disabled','true');try{const {data,error}=await window.supabase.createClient(window.YAZONI_SUPABASE_URL,window.YAZONI_SUPABASE_PUBLISHABLE_KEY).rpc('record_app_download',{p_app_id:app.id});if(error)throw error;const count=Number(data);app.downloadCount=count;const el=$('app-download-count');if(el)el.textContent=count.toLocaleString('en-US');}catch(err){console.warn('Download count could not be updated:',err);}window.location.assign(action);});}copy.append(cta);}
    else {const cta=node('span','button button-disabled',Number(app.price)>0?'Purchase link not available':'Build not available yet');copy.append(cta);}
    copy.append(node('p','detail-footnote',Number(app.price)>0?'Checkout opens on the provider’s website.':'Only install software you trust. Back up important data before installing early builds.'));
    layout.append(visual,copy);root.className='';root.replaceChildren(layout);
    const notes=node('section','release-panel'),noteHead=node('div','release-heading');noteHead.append(node('p','eyebrow','RELEASE INFORMATION'),node('h2','','About this release'));notes.append(noteHead,node('p','release-copy',app.release_notes||'No release notes have been added for this version yet.'));
    const info=node('div','release-facts');[['PLATFORM',app.platform||'Not specified'],['VERSION',app.version||'Not specified'],['PRICE',Number(app.price)>0?money(app.price):'Free'],['STATUS',app.status||'Published']].forEach(([label,value])=>{const fact=node('div','release-fact');fact.append(node('span','',label),node('strong','',value));info.append(fact);});const downloadFact=node('div','release-fact');downloadFact.append(node('span','','DOWNLOADS'),Object.assign(node('strong','',''+Number(app.downloadCount||0).toLocaleString('en-US')),{id:'app-download-count'}));info.append(downloadFact);notes.append(info);root.append(notes);
    renderCards($('related-apps'),apps.filter(a=>a.key!==app.key).slice(0,3));
    if(!$('related-apps').children.length)$('related-apps').append(node('p','catalog-loading','More apps will appear here as they are released.'));
  }
  async function init() {
    setupNav();
    try {
      const apps=await loadApps();
      const featured=$('featured-apps');if(featured){renderCards(featured,apps.slice(0,3));if(!apps.length)featured.append(node('p','catalog-loading','No apps published yet. New releases will appear here.'));}
      renderCatalog(apps);renderDetail(apps);
    } catch(error) {
      console.error('Yazoni Labs app catalogue:',error);
      const grid=$('all-apps')||$('featured-apps');
      if(grid)grid.replaceChildren(node('p','catalog-loading','The app library could not load. Please refresh in a moment.'));
      if($('catalog-total'))$('catalog-total').textContent='UNAVAILABLE';
    }
  }
  init();
})();