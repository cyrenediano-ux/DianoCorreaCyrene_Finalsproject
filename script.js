const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='siram-cafe-v1',IMG='siram-cafe-img-v1';
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
/* persistence */
const eds=$$('[data-e]'),lnks=$$('[data-link]'),imgs=$$('img[data-img]');
function save(){try{localStorage.setItem(KEY,JSON.stringify({t:eds.map(e=>e.textContent),l:lnks.map(a=>a.getAttribute('href'))}))}catch(e){}}
function saveImgs(){try{const o={};imgs.forEach(i=>o[i.dataset.img]=i.src);localStorage.setItem(IMG,JSON.stringify(o))}catch(e){toast('Image too large to remember after reload')}}
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s){eds.forEach((e,i)=>{if(s.t[i]!=null)e.textContent=s.t[i]});lnks.forEach((a,i)=>{if(s.l[i])a.setAttribute('href',s.l[i])})}
const m=JSON.parse(localStorage.getItem(IMG)||'null');if(m)imgs.forEach(i=>{if(m[i.dataset.img])i.src=m[i.dataset.img]})}catch(e){}
/* navigation */
$$('nav a,[data-nav]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(editing)return;const t=$(a.getAttribute('href'));t&&t.scrollIntoView({behavior:'smooth'})}));
const open=id=>$(id).classList.add('on'),close=()=>$$('.ov').forEach(o=>o.classList.remove('on'));
$$('[data-close]').forEach(b=>b.onclick=close);$$('.ov').forEach(o=>o.addEventListener('mousedown',e=>{if(e.target===o)close()}));
addEventListener('keydown',e=>{if(e.key==='Escape')close()});
$('#learn').onclick=()=>{if(!editing)open('#learnOv')};
$('#toPicks').onclick=()=>{close();$('#services').scrollIntoView({behavior:'smooth'})};
/* cart */
let cart={};
const price=c=>parseFloat(c.querySelector('.price [data-e]').textContent.replace(/[^\d.]/g,''))||0;
const nameOf=c=>c.querySelector('.n>[data-e]').textContent.trim();
const cards=$$('.card');
cards.forEach((c,i)=>c.addEventListener('click',()=>{if(editing)return;cart[i]=(cart[i]||0)+1;render();toast(nameOf(c)+' added to your order')}));
function render(){let n=0,t=0,h='';cards.forEach((c,i)=>{const q=cart[i];if(!q)return;n+=q;t+=q*price(c);h+=`<div class="row"><span class="nm">${nameOf(c).replace(/</g,'&lt;')}</span><button data-d="${i}" aria-label="Remove one">−</button><b>${q}</b><button data-u="${i}" aria-label="Add one">+</button><span>₱${q*price(c)}</span></div>`});
$('#cnt').textContent=n;$('#total').textContent='₱'+t;$('#items').innerHTML=h||'<p class="empty">Your order is empty. Tap a drink to add it.</p>';$('#foot').hidden=!n}
$('#items').onclick=e=>{const b=e.target.closest('button');if(!b)return;const i=b.dataset.u??b.dataset.d;cart[i]=(cart[i]||0)+(b.dataset.u!=null?1:-1);if(cart[i]<=0)delete cart[i];render()};
$('#shop').onclick=()=>{if(!editing){render();open('#cartOv')}};$('#cartBtn').onclick=()=>{render();open('#cartOv')};
$('#clear').onclick=()=>{cart={};render()};
$('#place').onclick=()=>{const n=$('#nm').value.trim(),p=$('#ph').value.trim();if(!n||!p){toast('Add your name and phone number');return}
 const lines=cards.map((c,i)=>cart[i]?cart[i]+' x '+nameOf(c):'').filter(Boolean).join(', ');
 $('#items').innerHTML=`<p>Thanks, ${n.replace(/</g,'&lt;')}! We received your order (${lines}). We’ll text you at ${p.replace(/</g,'&lt;')} when it’s ready.</p>`;$('#foot').hidden=true;cart={};$('#cnt').textContent=0;$('#nm').value=$('#ph').value=''};
/* edit mode */
let editing=false;
function setEdit(on){editing=on;document.body.classList.toggle('edit',on);eds.forEach(e=>on?e.setAttribute('contenteditable','true'):e.removeAttribute('contenteditable'));
$('#editBtn').textContent=on?'Done editing':'Edit page';$('#resetBtn').hidden=!on;if(on){close();toast('Click any text to edit. Click an image to replace it. Double-click a link to change its address.')}else{save();toast('Changes saved')}}
$('#editBtn').onclick=()=>setEdit(!editing);
$('#resetBtn').onclick=()=>{if(confirm('Reset the page to the original design?')){try{localStorage.removeItem(KEY);localStorage.removeItem(IMG)}catch(e){}location.reload()}};
eds.forEach(e=>{e.addEventListener('input',save);e.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&e.tagName!=='P'){ev.preventDefault();e.blur()}if(ev.key===' '&&e.closest('button')){ev.stopPropagation()}});
 e.addEventListener('keyup',ev=>{if(ev.key===' '&&e.closest('button'))ev.preventDefault()});
 e.addEventListener('paste',ev=>{ev.preventDefault();document.execCommand('insertText',false,(ev.clipboardData||window.clipboardData).getData('text/plain'))});
 e.addEventListener('click',ev=>{if(editing){ev.preventDefault();ev.stopPropagation()}})});
lnks.forEach(a=>{a.addEventListener('click',e=>{if(editing)e.preventDefault()});a.addEventListener('dblclick',e=>{if(!editing)return;const v=prompt('Link address (URL, tel:, sms:, mailto:)',a.getAttribute('href'));if(v){a.setAttribute('href',v);save();toast('Link updated')}})});
let target=null;
imgs.forEach(i=>i.addEventListener('click',()=>{if(editing){target=i;$('#file').click()}}));
$('#file').onchange=e=>{const f=e.target.files[0];if(!f||!target)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);target.src=c.toDataURL('image/jpeg',.85);saveImgs()};im.src=r.result};r.readAsDataURL(f);e.target.value=''};
render();
