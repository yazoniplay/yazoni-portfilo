(() => {
  const $ = (id) => document.getElementById(id);
  const configUrl = window.YAZONI_SUPABASE_URL || "";
  const configKey = window.YAZONI_SUPABASE_PUBLISHABLE_KEY || "";
  const configured = Boolean(configUrl && configKey && window.supabase?.createClient);
  const setupAlert = $("setup-alert"), loginPanel = $("login-panel"), dashboard = $("dashboard");
  const loginForm = $("login-form"), loginMessage = $("login-message"), dashboardMessage = $("dashboard-message");
  const modal = $("app-modal"), appForm = $("app-form"), appList = $("app-list"), emptyLibrary = $("empty-library");
  let client = null, currentUser = null, allApps = [], selectedColor = "#d7f36a", toastTimer;
  const esc = (s="") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = n => Number(n || 0).toLocaleString("sv-SE",{style:"currency",currency:"SEK",maximumFractionDigits:2});
  const say = (el, message, kind="") => { el.textContent = message; el.className = "form-message " + kind; };
  const toast = (message) => { const t=$("toast");t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,3200); };
  const safeImage = (url) => { try { const u=new URL(url); return ["https:","http:"].includes(u.protocol)?u.href:""; } catch { return ""; } };
  const fileExt = file => (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g,"");
  function showSignedOut() { currentUser=null; loginPanel.hidden=false; dashboard.hidden=true; $("sign-out").hidden=true; }
  function showDashboard() { loginPanel.hidden=true; dashboard.hidden=false; $("sign-out").hidden=false; }
  function setSetupMessage() {
    if (!configured) { setupAlert.hidden=false; say(loginMessage,"Configure Supabase before signing in.","error"); return; }
    setupAlert.hidden=true;
  }
  function showModal(app=null) {
    appForm.reset(); $("app-id").value=app?.id||""; $("modal-title").textContent=app?"Edit app":"Add an app";
    $("app-name").value=app?.name||""; $("app-description").value=app?.description||""; $("app-version").value=app?.version||"";
    $("app-platform").value=app?.platform||"Android"; $("app-price").value=app?.price??0;
    $("app-published").value=String(Boolean(app?.published)); $("app-checkout").value=app?.checkout_url||""; $("app-notes").value=app?.release_notes||"";
    $("app-build-url").value=/^https:\/\//i.test(app?.file_path||"")?app.file_path:"";
    selectedColor=app?.color||"#d7f36a"; document.querySelectorAll(".color-chip").forEach(b=>b.classList.toggle("selected",b.dataset.color===selectedColor));
    $("upload-status").textContent=""; modal.hidden=false; document.body.style.overflow="hidden"; $("app-name").focus();
  }
  function hideModal(){modal.hidden=true;document.body.style.overflow="";}
  async function uploadFile(file, folder, oldPath) {
    if (!file) return oldPath || null;
    const safeName=file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g,"-").slice(-90);
    const path=folder+"/"+crypto.randomUUID()+"-"+safeName;
    const {error}=await client.storage.from("app-files").upload(path,file,{upsert:false,contentType:file.type||"application/octet-stream"});
    if(error) throw error;
    return path;
  }
  async function getAdminStatus(user) {
    const {data,error}=await client.from("app_admins").select("user_id").eq("user_id",user.id).maybeSingle();
    if(error) throw error;
    return Boolean(data);
  }
  async function loadApps() {
    say(dashboardMessage,"Loading your app library…");
    const {data,error}=await client.from("apps").select("*").order("updated_at",{ascending:false});
    if(error){say(dashboardMessage,"Could not load apps: "+error.message,"error");return;}
    allApps=data||[]; renderApps(); updateStats(); say(dashboardMessage,"");
  }
  function updateStats() {
    $("stat-total").textContent=allApps.length;
    $("stat-published").textContent=allApps.filter(a=>a.published).length;
    $("stat-paid").textContent=allApps.filter(a=>Number(a.price)>0).length;
    $("stat-drafts").textContent=allApps.filter(a=>!a.published).length;
    $("stat-downloads").textContent=allApps.reduce((sum,a)=>sum+Number(a.download_count||0),0).toLocaleString("en-US");
  }
  function renderApps() {
    const q=$("search-apps").value.trim().toLowerCase(), filter=$("filter-status").value;
    const filtered=allApps.filter(a=>(!q||(a.name+" "+a.description+" "+a.platform).toLowerCase().includes(q))&&(filter==="all"||(filter==="published"?a.published:!a.published)));
    appList.replaceChildren(); emptyLibrary.hidden=filtered.length>0;
    filtered.forEach(app=>{
      const row=document.createElement("article");row.className="admin-app";
      const icon=document.createElement("div");icon.className="admin-icon";icon.style.setProperty("--app-color",app.color||"#d7f36a");
      if(app.icon_url){const img=document.createElement("img");img.src=safeImage(app.icon_url);img.alt="";img.onerror=()=>{img.remove();icon.textContent=(app.name||"Y").slice(0,1)};icon.append(img);}else icon.textContent=(app.name||"Y").slice(0,1);
      const info=document.createElement("div");info.className="admin-app-info";
      const title=document.createElement("div");title.className="admin-app-title";
      const h=document.createElement("h3");h.textContent=app.name;
      const status=document.createElement("span");status.className="status-pill "+(app.published?"published":"");status.textContent=app.published?"PUBLISHED":"DRAFT";title.append(h,status);
      const desc=document.createElement("p");desc.textContent=app.description;
      const meta=document.createElement("div");meta.className="admin-app-meta";
      const platform=document.createElement("span");platform.textContent=app.platform||"Platform not set";
      const version=document.createElement("span");version.textContent=app.version?"v"+app.version:"No version";
      const price=document.createElement("span");price.className="price-tag";price.textContent=Number(app.price)>0?money(app.price):"FREE";
      const downloads=document.createElement("span");downloads.textContent=Number(app.download_count||0).toLocaleString("en-US")+" downloads";meta.append(platform,version,price,downloads);
      info.append(title,desc,meta);
      const actions=document.createElement("div");actions.className="admin-actions";
      const edit=document.createElement("button");edit.className="small-button";edit.textContent="Edit";edit.addEventListener("click",()=>showModal(app));
      const toggle=document.createElement("button");toggle.className="small-button";toggle.textContent=app.published?"Unpublish":"Publish";toggle.addEventListener("click",()=>togglePublished(app));
      const del=document.createElement("button");del.className="small-button delete";del.textContent="Delete";del.addEventListener("click",()=>deleteApp(app));
      actions.append(edit,toggle,del);row.append(icon,info,actions);appList.append(row);
    });
  }
  async function togglePublished(app) {
    const {error}=await client.from("apps").update({published:!app.published}).eq("id",app.id);
    if(error){toast("Couldn't update app: "+error.message);return;} toast(app.published?"App unpublished":"App published");await loadApps();
  }
  async function deleteApp(app) {
    if(!confirm('Delete "'+app.name+'"? This removes its listing. Uploaded files may need to be removed from Storage separately.'))return;
    const {error}=await client.from("apps").delete().eq("id",app.id);
    if(error){toast("Couldn't delete app: "+error.message);return;} toast("App deleted");await loadApps();
  }
  loginForm.addEventListener("submit",async e=>{
    e.preventDefault();if(!configured)return;
    say(loginMessage,"Signing in…");const {data,error}=await client.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
    if(error){say(loginMessage,error.message,"error");return;}
    currentUser=data.user;
    try { if(!await getAdminStatus(currentUser)){await client.auth.signOut();showSignedOut();say(loginMessage,"This account isn't on the admin allowlist yet. Add its user ID to app_admins in Supabase.","error");return;} }
    catch(err){await client.auth.signOut();showSignedOut();say(loginMessage,"Admin check failed: "+err.message,"error");return;}
    showDashboard();await loadApps();
  });
  $("sign-out").addEventListener("click",async()=>{await client?.auth.signOut();showSignedOut();});
  $("new-app").addEventListener("click",()=>showModal());$("empty-add").addEventListener("click",()=>showModal());
  $("close-modal").addEventListener("click",hideModal);$("cancel-modal").addEventListener("click",hideModal);
  modal.addEventListener("click",e=>{if(e.target===modal)hideModal();});
  $("search-apps").addEventListener("input",renderApps);$("filter-status").addEventListener("change",renderApps);$("refresh-apps").addEventListener("click",loadApps);
  document.querySelectorAll(".color-chip").forEach(b=>b.addEventListener("click",()=>{selectedColor=b.dataset.color;document.querySelectorAll(".color-chip").forEach(x=>x.classList.toggle("selected",x===b));}));
  appForm.addEventListener("submit",async e=>{
    e.preventDefault();if(!client||!currentUser)return;
    const save=$("save-app");save.disabled=true;save.textContent="Saving…";$("upload-status").textContent="Saving app details…";
    try {
      const id=$("app-id").value||crypto.randomUUID(), existing=allApps.find(a=>a.id===id);
      const iconFile=$("app-image").files[0];
      const buildUrlInput=$("app-build-url").value.trim();
      $("upload-status").textContent="Saving listing…";
      let filePath=existing?.file_path||null;
      if(buildUrlInput){
        let parsed;
        try { parsed=new URL(buildUrlInput); } catch { throw new Error("Enter a valid build download URL."); }
        if(parsed.protocol!=="https:") throw new Error("Build download URLs must use HTTPS.");
        filePath=parsed.href;
      }
      // Icon files use a public icon bucket; app builds stay in private Storage.
      let publicIconPath=existing?.icon_path||null, publicIconUrl=existing?.icon_url||null;
      if(iconFile){
        const publicPath="icons/"+id+"/"+crypto.randomUUID()+"-"+iconFile.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g,"-").slice(-90);
        const {error:iconError}=await client.storage.from("app-icons").upload(publicPath,iconFile,{upsert:false,contentType:iconFile.type||"image/png"});
        if(iconError)throw iconError;publicIconPath=publicPath;publicIconUrl=client.storage.from("app-icons").getPublicUrl(publicPath).data.publicUrl;
      }
      const price=Number($("app-price").value||0);
      const payload={id,name:$("app-name").value.trim(),description:$("app-description").value.trim(),version:$("app-version").value.trim()||null,platform:$("app-platform").value,price,published:$("app-published").value==="true",checkout_url:$("app-checkout").value.trim()||null,release_notes:$("app-notes").value.trim()||null,color:selectedColor,icon_path:publicIconPath,icon_url:publicIconUrl,file_path:filePath,updated_at:new Date().toISOString(),created_by:existing?.created_by||currentUser.id};
      if(price>0&&!payload.checkout_url){payload.published=false;$("upload-status").textContent="Paid app saved as a draft: add a checkout URL before publishing.";}
      const {error}=await client.from("apps").upsert(payload);
      if(error)throw error;
      hideModal();toast(price>0&&!payload.checkout_url?"Saved as draft — add checkout URL to publish.":"App saved");await loadApps();
    } catch(err){$("upload-status").textContent="Couldn't save: "+err.message;say(dashboardMessage,"Save failed: "+err.message,"error");}
    finally{save.disabled=false;save.innerHTML='Save app <span>↗</span>';}
  });
  async function boot() {
    setSetupMessage();
    if(!configured){showSignedOut();return;}
    client=window.supabase.createClient(configUrl,configKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data:{session}}=await client.auth.getSession();
    if(session?.user){
      currentUser=session.user;
      try{if(await getAdminStatus(currentUser)){showDashboard();await loadApps();}else{await client.auth.signOut();showSignedOut();}}
      catch(e){showSignedOut();say(loginMessage,"Admin check failed: "+e.message,"error");}
    }else showSignedOut();
    client.auth.onAuthStateChange(async(event,session)=>{if(event==="SIGNED_OUT")showSignedOut();});
  }
  boot();
})();