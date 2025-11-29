// Dynamically update favicon color to match CSS --primary
function buildSvg(color: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\">\n  <defs><style>.fill{fill:${color}} .stroke{stroke:${color}}</style></defs>\n  <path d=\"M4 9L12 5L10 2L2 6L4 9Z\" class=\"fill\" opacity=\"0.3\"/>\n  <path d=\"M4 9L12 5L10 2L2 6L4 9\" class=\"stroke\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n  <path d=\"M12 5L20 9L22 6L14 2L12 5Z\" class=\"fill\" opacity=\"0.3\"/>\n  <path d=\"M12 5L20 9L22 6L14 2L12 5\" class=\"stroke\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n  <path d=\"M4 9L12 13L20 9L12 5L4 9Z\" class=\"fill\" opacity=\"0.1\"/>\n  <path d=\"M4 9L12 13V21L4 17V9Z\" class=\"fill\" opacity=\"0.8\"/>\n  <path d=\"M12 13L20 9V17L12 21V13Z\" class=\"fill\" opacity=\"0.6\"/>\n  <path d=\"M4 9V17L12 21L20 17V9\" class=\"stroke\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n  <path d=\"M12 21V13\" class=\"stroke\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n  <path d=\"M4 9L12 13L10 16L2 12L4 9Z\" class=\"fill\" opacity=\"0.5\"/>\n  <path d=\"M4 9L12 13L10 16L2 12L4 9\" class=\"stroke\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n  <path d=\"M12 13L20 9L22 12L14 16L12 13Z\" class=\"fill\" opacity=\"0.4\"/>\n  <path d=\"M12 13L20 9L22 12L14 16L12 13\" class=\"stroke\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>`;
}

function getPrimaryColor(): string {
  const cs = getComputedStyle(document.documentElement);
  // --color-primary is rgb(var(--primary)) -> resolved to rgb(r g b)
  const rgb = cs.getPropertyValue('--color-primary').trim();
  // Ensure rgb(...) format; if space-separated, wrap properly
  return rgb.startsWith('rgb') ? rgb : `rgb(${rgb})`;
}

function setFavicon(svgData: string) {
  const link = (document.querySelector('link[rel="icon"]') as HTMLLinkElement) || document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  link.href = url;
  if (!link.parentNode) document.head.appendChild(link);
}

export function initDynamicFavicon() {
  const update = () => setFavicon(buildSvg(getPrimaryColor()));
  update();
  const observer = new MutationObserver(() => update());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
}
