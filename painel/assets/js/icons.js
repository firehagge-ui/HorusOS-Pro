/* =========================================================================
   HORUS · Painel — icons.js
   One consistent stroke family (feather-style, 24 grid). App.icon(name).
   ========================================================================= */
(function () {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    chat: '<path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 16 0Z"/><path d="M8 11h8M8 14h5"/>',
    wand: '<path d="m5 19 9-9"/><path d="M14 6.5 17.5 3 21 6.5 17.5 10Z"/><path d="M6 4v3M4.5 5.5h3M17 15v2.5M15.75 16.25h2.5"/>',
    columns: '<rect x="3" y="4" width="5" height="16" rx="1.4"/><rect x="9.5" y="4" width="5" height="16" rx="1.4"/><rect x="16" y="4" width="5" height="16" rx="1.4"/>',
    activity: '<path d="M3 12h4l2.5-7 5 15 2.5-8H21"/>',
    barchart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.4"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
    template: '<rect x="3" y="3.5" width="18" height="17" rx="2.4"/><path d="M3 9h18M9 9v11.5"/>',
    images: '<rect x="3" y="3.5" width="18" height="14" rx="2.4"/><path d="m6 14 3.5-3.5 3 3L16 10l5 4.5"/><circle cx="9" cy="8" r="1.4"/><path d="M7 20.5h13"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    folderOpen: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2"/><path d="m3 9.5 2.2 8A2 2 0 0 0 7.1 19H18a2 2 0 0 0 1.9-1.4L22 10.5H5.2A2 2 0 0 0 3.3 12"/>',
    briefcase: '<rect x="3" y="7.5" width="18" height="12.5" rx="2.2"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12.5h18"/>',
    brain: '<path d="M12 5a3 3 0 0 0-5.9.7A3 3 0 0 0 4 11a3 3 0 0 0 2 4.9A2.6 2.6 0 0 0 12 18Z"/><path d="M12 5a3 3 0 0 1 5.9.7A3 3 0 0 1 20 11a3 3 0 0 1-2 4.9A2.6 2.6 0 0 1 12 18Z"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.4-1.2-1.6-1.2-2.8 0-.9.8-1.7 1.9-1.7H17a4 4 0 0 0 4-4c0-4-4-7.5-9-7.5Z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="11" cy="7.5" r="1.1"/><circle cx="15.5" cy="8.5" r="1.1"/>',
    settings: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 13.9H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
    dollar: '<circle cx="12" cy="12" r="9"/><path d="M14.8 8.5c-.5-.9-1.6-1.4-2.8-1.4-1.7 0-3 .9-3 2.3 0 3.2 6.2 1.6 6.2 4.8 0 1.5-1.4 2.4-3.2 2.4-1.4 0-2.6-.6-3.1-1.6M12 5.5v13"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
    bell: '<path d="M18 8a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14 18 8Z"/><path d="M10.3 20a2 2 0 0 0 3.4 0"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    checkSm: '<path d="m5 12 4.5 4.5L19 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>',
    chevD: '<path d="m6 9 6 6 6-6"/>',
    arrowR: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2.4"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 4.5-4.5 3.5 3.5 3-3L21 15"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.4"/><path d="m4 7 8 6 8-6"/>',
    star: '<path d="m12 3.5 2.6 5.4 6 .8-4.3 4.2 1 6-5.3-2.9L6.7 20l1-6L3.4 9.7l6-.8Z"/>',
    google: '<path d="M21 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.05a4.3 4.3 0 0 1-1.87 2.8v2.3h3.02C19.96 17.5 21 15.1 21 12.2Z"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-3.02-2.3c-.84.56-1.9.9-2.94.9-2.26 0-4.18-1.52-4.87-3.58H4.02v2.37A9 9 0 0 0 12 21Z"/><path d="M7.13 13.84a5.4 5.4 0 0 1 0-3.44V8.03H4.02a9 9 0 0 0 0 8.18Z"/><path d="M12 6.98c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.98 8.98 0 0 0 4.02 8.03L7.13 10.4C7.82 8.34 9.74 6.98 12 6.98Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>',
    facebook: '<path d="M14 8.5V7c0-.8.5-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.6V8.5H8V12h2.5v9H14v-9h2.3l.7-3.5Z"/>',
    whatsapp: '<path d="M3.5 20.5 5 16a8 8 0 1 1 3 3Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-1.4-.9-1 .8c-1.1-.4-2-1.3-2.4-2.4l.8-1L9.6 9c-.5 0-1 .4-1 .5Z" fill="currentColor" stroke="none"/>',
    megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h2l4.5 3.5A1 1 0 0 0 12 17V7a1 1 0 0 0-1.5-.8L6 9.7H4a1 1 0 0 0-1 1Z"/><path d="M16 8.5a4 4 0 0 1 0 7M6 14v4a1.5 1.5 0 0 0 3 0v-2.5"/>',
    trendUp: '<path d="M3 17 9.5 10.5l4 4L21 7"/><path d="M15 7h6v6"/>',
    fileText: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M8.5 13h7M8.5 16.5h7M8.5 9.5h2"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M10.7 6.2A9.7 9.7 0 0 1 12 6c6.5 0 10 6 10 6a15.4 15.4 0 0 1-3.3 3.9M6.5 7.6C3.9 9 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 3.7-.7"/><path d="m4 4 16 16M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M4 7h16M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    calPlus: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.4"/><path d="M3 9h18M8 2.5v4M16 2.5v4M12 13v5M9.5 15.5h5"/>',
    zap: '<path d="M13 2 4 13.5h6L9 22l10-12h-6Z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z"/><path d="m9 12 2 2 4-4.5"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2.6"/><path d="M3 10h18M16.5 14.5h1.5"/><path d="M17 6V4.6A1.6 1.6 0 0 0 15 3L5 5"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-2.5-4.6"/>',
    tooth: '<path d="M7 3.5C5 3.5 3.5 5 3.5 7.3c0 1.8.7 2.7 1.2 4.4.4 1.4.3 2.6.7 4.6.3 1.7.6 3.7 1.6 3.7 1.1 0 1.2-2.2 1.7-3.8.3-.9.6-1.4 1.3-1.4s1 .5 1.3 1.4c.5 1.6.6 3.8 1.7 3.8 1 0 1.3-2 1.6-3.7.4-2 .3-3.2.7-4.6.5-1.7 1.2-2.6 1.2-4.4C17.5 5 16 3.5 14 3.5c-1.3 0-2 .7-2.9.7S8.3 3.5 7 3.5Z"/>',
    horusEye: '<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/><path d="M12 17.5c-.5 1.8-1.5 3-3 3.5M15.5 15.5c.4 1.6 1.4 2.6 3 3"/>',
    play: '<path d="M7 4.5 19 12 7 19.5Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    upload: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    link: '<path d="M9 15l6-6"/><path d="M11 6.5 12.8 4.7a4 4 0 0 1 5.6 5.6L16.5 12"/><path d="M13 17.5 11.2 19.3a4 4 0 0 1-5.6-5.6L7.5 12"/>',
    heart: '<path d="M12 20s-7-4.4-9.3-8.6C1 8 2.6 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.4 0 5 3.5 3.3 6.9C19 15.6 12 20 12 20Z"/>',
    flame: '<path d="M12 22c3.9 0 6-2.6 6-5.8 0-3.4-2.6-5-3.8-7.7-.6 1.2-1.4 1.9-2.4 2.4.2-2-.4-4.3-2.6-6.4-.2 2.3-1.6 3.4-2.8 4.8A7.5 7.5 0 0 0 6 16.2C6 19.4 8.1 22 12 22Z"/>',
    party: '<path d="M3 21 8 8l8 8Z"/><path d="M14 6a3 3 0 0 1 3 3M18 3.5c.8.8.8 2 0 3M20.5 9c-1 0-2 .6-2 2M13.5 4c0 1 .5 1.8 1.5 2"/>',
    camera: '<path d="M4 8h3l1.5-2.2h7L17 8h3a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9.5A1.5 1.5 0 0 1 4 8Z"/><circle cx="12" cy="13" r="3.2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    grad: '<path d="M12 4 2.5 8.5 12 13l9.5-4.5Z"/><path d="M6 10.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M21.5 8.5V14"/>',
    bookmark: '<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5M3 16.5 12 21.5l9-5"/>',
    send: '<path d="M4 12 20 4l-6 16-3-7Z"/><path d="m11 13 9-9"/>',
    more: '<circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
    dot: '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4M20 20v-4h-4"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h13M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4-2v-4Z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    volumeX: '<path d="M4 9v6h4l5 4V5L8 9Z"/><path d="m16 9 5 6M21 9l-5 6"/>',
    lightbulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
    hash: '<path d="M9 3 7 21M17 3l-2 18M4 8.5h16M3 15.5h16"/>',
  };
  const cache = {};
  window.App = window.App || {};
  App.icon = function (name, cls) {
    const body = P[name];
    if (!body) return '';
    const key = name + '|' + (cls || '');
    if (cache[key]) return cache[key];
    const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ''} aria-hidden="true">${body}</svg>`;
    cache[key] = svg;
    return svg;
  };
  App.hasIcon = (n) => !!P[n];
})();
