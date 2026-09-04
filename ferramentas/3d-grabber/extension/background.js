// Tier 1: assets 3D que o site baixa por HTTP.
const EXT = /\.(glb|gltf|fbx|obj|mtl|dae|stl|ply|usdz?|3dm|drc|ktx2|basis|hdr|exr|splat|ksplat|spz|sog|vrm|abc|bin)(\?|$)/i;

// SOG (formato splat da PlayCanvas): nao e um arquivo, e um meta.json + varios .webp.
// So vale re-baixar quando o nome bate; ai o meta lista o bundle inteiro.
async function sogBundle(url) {
  try {
    const m = await (await fetch(url)).json();
    if (!(m.means && m.scales && m.quats && m.sh0)) return null;
    const files = [m.means, m.scales, m.quats, m.sh0, m.shN]
      .filter(Boolean)
      .flatMap((f) => f.files || []);
    return [...new Set(files)].map((f) => new URL(f, url).href);
  } catch {
    return null;
  }
}

const byTab = new Map(); // tabId -> Map<url, asset>

const header = (h, name) =>
  (h || []).find((x) => x.name.toLowerCase() === name)?.value || '';

chrome.webRequest.onCompleted.addListener(
  async (d) => {
    if (d.tabId < 0) return;
    if (d.type === 'main_frame') byTab.delete(d.tabId);

    const type = header(d.responseHeaders, 'content-type');
    const path = new URL(d.url).pathname;
    const ext = path.match(EXT)?.[1]?.toLowerCase();
    const isSog = /\/meta\.json$/i.test(path);
    if (!ext && !isSog && !/^model\//i.test(type)) return;

    const add = (asset) => {
      const tab = byTab.get(d.tabId) || new Map();
      tab.set(asset.url, asset);
      byTab.set(d.tabId, tab);
      chrome.action.setBadgeText({ tabId: d.tabId, text: String(tab.size) });
      chrome.action.setBadgeBackgroundColor({ tabId: d.tabId, color: '#7c3aed' });
    };

    const base = {
      url: d.url,
      name: decodeURIComponent(path.split('/').pop()) || 'asset',
      size: +header(d.responseHeaders, 'content-length') || 0,
    };

    if (isSog) {
      const parts = await sogBundle(d.url);
      if (parts) add({ ...base, ext: 'sog', name: `${path.split('/').at(-2) || 'splat'} (SOG)`, parts });
      return;
    }
    add({ ...base, ext: ext || 'model' });
  },
  { urls: ['<all_urls>'] },
  ['responseHeaders']
);

chrome.tabs.onRemoved.addListener((id) => byTab.delete(id));

chrome.runtime.onMessage.addListener((msg, _s, send) => {
  if (msg.type === 'assets') send([...(byTab.get(msg.tabId)?.values() || [])]);
  return true;
});
