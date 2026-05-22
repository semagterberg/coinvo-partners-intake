import fs from 'node:fs';

const src = fs.readFileSync('index.html', 'utf8');

const svgData = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const polymarket = svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#315cff"/><path d="M42 30v68l52-17V47L42 30Z" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/><path d="M45 48 91 63 45 78" fill="none" stroke="#fff" stroke-width="8" stroke-linejoin="round"/></svg>`);
const kalshi = svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#14d99a"/><text x="64" y="72" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="31" font-weight="800" fill="#050505">Kalshi</text></svg>`);
const weex = svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#f4d329"/><path d="M27 62 49 40h22L55 56h-8l-8 8 8 8h8l16 16H49L27 66Zm74 0L79 40H57l16 16h8l8 8-8 8h-8L57 88h22l22-22ZM64 46l18 18-18 18-18-18Z" fill="#050505"/></svg>`);

const avatarCss = `.avatar{width:25px;height:25px;border-radius:50%;border:2px solid rgba(8,10,16,.92);margin-left:-7px;display:grid;place-items:center;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.28);background:#fff}.avatar:first-child{margin-left:0}.avatar img{width:100%;height:100%;display:block;object-fit:cover}`;

let html = src.replace(/\.avatar\{[^}]*\}\.avatar:first-child\{[^}]*\}\.avatar (?:svg|img)\{[^}]*\}/, avatarCss);

const avatarHtml = `<div class="avatars"><span class="avatar" title="Polymarket"><img src="${polymarket}" alt="Polymarket logo"></span><span class="avatar" title="Kalshi"><img src="${kalshi}" alt="Kalshi logo"></span><span class="avatar" title="WEEX"><img src="${weex}" alt="WEEX logo"></span></div><span>Trusted`;

html = html.replace(/<div class="avatars">[\s\S]*?<\/div><span>Trusted/, avatarHtml);

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/index.html', html);
