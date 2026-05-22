import fs from 'node:fs';

let html = fs.readFileSync('index.html', 'utf8');

const w = 'https://' + 'upload.wikimedia.org/wikipedia/commons/thumb/';
const poly = w + '7/75/Company_Logo_Polymarket.png/250px-Company_Logo_Polymarket.png';
const kalshi = w + 'e/ee/Kalshi_logo.svg/250px-Kalshi_logo.svg.png';
const weex = 'https://' + 'www.weex.com/favicon.ico';

const avatarCss = `.avatar{width:25px;height:25px;border-radius:50%;border:2px solid rgba(8,10,16,.92);margin-left:-7px;display:grid;place-items:center;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.28);background:#fff}.avatar:first-child{margin-left:0}.avatar img{width:100%;height:100%;display:block;object-fit:cover}`;

html = html.replace(/\.avatar\{[^}]*\}\.avatar:first-child\{[^}]*\}\.avatar (?:svg|img)\{[^}]*\}/, avatarCss);

const avatarHtml = `<div class="avatars"><span class="avatar" title="Polymarket"><img src="${poly}" alt="Polymarket logo"></span><span class="avatar" title="Kalshi"><img src="${kalshi}" alt="Kalshi logo"></span><span class="avatar" title="WEEX"><img src="${weex}" alt="WEEX logo"></span></div><span>Trusted`;

html = html.replace(/<div class="avatars">[\s\S]*?<\/div><span>Trusted/, avatarHtml);

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/index.html', html);
