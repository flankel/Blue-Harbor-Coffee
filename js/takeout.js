/* =========================
   TAKEOUT 商品ページ
   Blue Harbor Coffee
========================= */

const MAX_PER_ITEM = 3;

let products = {};
let cart = {};


/* =========================
   初期化
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  await loadProducts();
  loadCart(); // ★追加（復元）
  renderProducts();
  setupEvents();
  updateSummary(); // ★追加

});


/* =========================
   商品データ読み込み
========================= */

async function loadProducts(){

  const res = await fetch("data/takeout-products.json");
  products = await res.json();

}


/* =========================
   カート復元（★追加）
========================= */

function loadCart(){

  const saved = localStorage.getItem("cart");

  if(saved){
    cart = JSON.parse(saved);
  }

}


/* =========================
   商品表示
========================= */

function renderProducts(){

  const area = document.getElementById("productArea");

  let html = "";


/* Coffee Beans */

if(products.beans){

html += `
<div>

<h2 class="text-3xl font-light tracking-wider mb-10">
Coffee Beans
</h2>

<div class="grid md:grid-cols-2 gap-14">
`;

products.beans.forEach(bean => {

html += `
<div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">

<div class="aspect-[4/3] overflow-hidden">

<img src="${bean.image}"
class="w-full h-full object-cover hover:scale-110 transition duration-700">

</div>

<div class="p-6 space-y-4">

<h3 class="text-xl font-light">
${bean.name}
</h3>
`;

Object.keys(bean.sizes).forEach(size => {

const price = bean.sizes[size];

html += `

<div class="flex justify-between items-center py-2 border-b last:border-none">

<div>

<span>${size}g</span>

<span class="text-blue-600 font-semibold ml-2">
¥${price.toLocaleString()}
</span>

</div>

<div class="flex items-center gap-2">

<button
class="qtyMinus px-3 py-1 bg-slate-100 rounded"
data-type="bean"
data-id="${bean.id}"
data-name="${bean.name}"
data-size="${size}"
>

−

</button>

<span
class="w-6 text-center"
id="qty-${bean.id}-${size}"
>

${cart[`${bean.id}-${size}`] || 0}

</span>

<button
class="qtyPlus px-3 py-1 bg-slate-100 rounded"
data-type="bean"
data-id="${bean.id}"
data-name="${bean.name}"
data-size="${size}"
>

＋

</button>

</div>

</div>
`;

});

html += `
</div>
</div>
`;

});

html += `</div></div>`;

}



/* Sweets */

if(products.sweets){

html += `
<div>

<h2 class="text-3xl font-light tracking-wider mb-10">
Sweets
</h2>

<div class="grid md:grid-cols-2 gap-14">
`;

products.sweets.forEach(item => {

html += `
<div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">

<div class="aspect-[4/3] overflow-hidden">

<img src="${item.image}"
class="w-full h-full object-cover hover:scale-110 transition duration-700">

</div>

<div class="p-6 flex justify-between items-center">

<div>

<div class="text-lg">
${item.name}
</div>

<div class="text-blue-600 text-sm font-semibold">
¥${item.price.toLocaleString()}
</div>

</div>

<div class="flex items-center gap-2">

<button
class="qtyMinus px-3 py-1 bg-slate-100 rounded"
data-type="sweet"
data-id="${item.id}"
data-name="${item.name}"
>

−

</button>

<span
class="w-6 text-center"
id="qty-${item.id}"
>

${cart[`${item.id}-`] || 0}

</span>

<button
class="qtyPlus px-3 py-1 bg-slate-100 rounded"
data-type="sweet"
data-id="${item.id}"
data-name="${item.name}"
>

＋

</button>

</div>

</div>

</div>
`;

});

html += `</div></div>`;

}


area.innerHTML = html;

}


/* =========================
   イベント設定
========================= */

function setupEvents(){

document.addEventListener("click", e => {

if(e.target.classList.contains("qtyPlus")){
  increaseQty(e.target);
}

if(e.target.classList.contains("qtyMinus")){
  decreaseQty(e.target);
}

});

}


/* =========================
   数量増加
========================= */

function increaseQty(btn){

const id = btn.dataset.id;
const size = btn.dataset.size || "";

const key = `${id}-${size}`;

if(!cart[key]) cart[key] = 0;

if(cart[key] >= MAX_PER_ITEM) return;

cart[key]++;

saveCart(); // ★追加

updateQtyDisplay(id,size);
updateSummary();

}


/* =========================
   数量減少
========================= */

function decreaseQty(btn){

const id = btn.dataset.id;
const size = btn.dataset.size || "";

const key = `${id}-${size}`;

if(!cart[key]) return;

cart[key]--;

if(cart[key] <= 0){
  delete cart[key];
}

saveCart(); // ★追加

updateQtyDisplay(id,size);
updateSummary();

}


/* =========================
   カート保存（★追加）
========================= */

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}


/* =========================
   数量表示更新
========================= */

function updateQtyDisplay(id, size){

const key = `${id}-${size}`;
const qty = cart[key] || 0;

const elementId = size ? `qty-${id}-${size}` : `qty-${id}`;

const el = document.getElementById(elementId);

if(el){
  el.textContent = qty;
}

}


/* =========================
   注文サマリー更新
========================= */

function updateSummary(){

const summary = document.getElementById("orderSummary");
const totalEl = document.getElementById("totalPrice");
const mobileTotal = document.getElementById("mobileTotal");

let html = "";
let total = 0;

Object.keys(cart).forEach(key => {

const qty = cart[key];

let label = "";
let price = 0;


/* Beans */

products.beans.forEach(bean => {

Object.keys(bean.sizes).forEach(size => {

if(key === `${bean.id}-${size}`){

label = `${bean.name} ${size}g`;
price = bean.sizes[size];

}

});

});


/* Sweets */

products.sweets.forEach(sweet => {

if(key === `${sweet.id}-`){

label = sweet.name;
price = sweet.price;

}

});


const subtotal = price * qty;
total += subtotal;

html += `
<div class="flex justify-between">

<span>
${label} ×${qty}
</span>

<span class="text-blue-600 font-semibold">
¥${subtotal.toLocaleString()}
</span>
</div>
`;

});

summary.innerHTML = html;

totalEl.textContent = "¥" + total.toLocaleString();

if(mobileTotal){
  mobileTotal.textContent = "¥" + total.toLocaleString();
}

}


/* =========================
   注文データ作成
========================= */

function collectOrder(){

let items = [];

Object.keys(cart).forEach(key => {

const qty = cart[key];


/* Beans */

products.beans.forEach(bean => {

Object.keys(bean.sizes).forEach(size => {

if(key === `${bean.id}-${size}`){

const price = bean.sizes[size];

items.push({
  type: "bean",
  id: bean.id,
  name: bean.name,
  size: size,
  qty: qty,
  price: price,
  subtotal: price * qty,
  image: bean.image
});

}

});

});


/* Sweets */

products.sweets.forEach(sweet => {

if(key === `${sweet.id}-`){

items.push({
  type: "sweet",
  id: sweet.id,
  name: sweet.name,
  size: "",
  qty: qty,
  price: sweet.price,
  subtotal: sweet.price * qty,
  image: sweet.image
});

}

});

});

return items;

}


/* =========================
   次ページへ
========================= */

function goCustomer(){

const items = collectOrder();

if(items.length === 0){
  alert("商品を選択してください");
  return;
}

let total = 0;

items.forEach(i => {
  total += i.subtotal;
});

const orderData = {
  items: items,
  total: total
};

localStorage.setItem("orderData", JSON.stringify(orderData)); // ★変更

location.href = "customer.html";

}

window.goCustomer = goCustomer;
