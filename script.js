(() => {
  const nav = document.querySelector('.site-header nav');
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.textContent = isOpen ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    if (menu) menu.textContent = '☰';
  }));

  const apps = Array.isArray(window.YAZONI_APPS) ? window.YAZONI_APPS : [];
  const grid = document.getElementById('app-grid');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('app-count');
  count.textContent = `${apps.length} ${apps.length === 1 ? 'APP' : 'APPS'}`;
  empty.hidden = apps.length > 0;

  const safeUrl = value => {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  const element = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  apps.forEach(app => {
    const card = element('article', 'app-card');
    const cover = element('div', 'app-cover');
    cover.style.setProperty('--app-color', app.color || '#e9e8dd');
    cover.style.setProperty('--app-icon', app.iconColor || '#d7f36a');
    const icon = element('span', 'app-icon', app.icon || (app.name || 'Y').slice(0, 1));
    cover.append(icon, element('span', 'app-version', app.version ? 'v' + app.version : 'EARLY BUILD'));
    const body = element('div', 'app-card-body');
    const meta = element('div', 'app-meta');
    meta.append(element('span', 'app-platform', app.platform || 'PLATFORM TBC'), element('span', 'app-status', app.status || 'EARLY ACCESS'));
    body.append(meta, element('h3', '', app.name || 'Untitled app'), element('p', 'app-description', app.description || 'Details coming soon.'));
    const actions = element('div', 'app-actions');
    const detailsUrl = safeUrl(app.detailsUrl);
    const downloadUrl = safeUrl(app.downloadUrl);
    if (detailsUrl) {
      const details = element('a', '', 'Details ↗');
      details.href = detailsUrl; details.target = '_blank'; details.rel = 'noreferrer';
      actions.append(details);
    } else actions.append(element('span', '', 'DETAILS SOON'));
    if (downloadUrl) {
      const download = element('a', '', 'Download ↓');
      download.href = downloadUrl; download.target = '_blank'; download.rel = 'noreferrer';
      actions.append(download);
    } else actions.append(element('span', '', 'NOT RELEASED'));
    body.append(actions); card.append(cover, body); grid.append(card);
  });
})();