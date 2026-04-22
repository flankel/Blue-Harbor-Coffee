/* =========================
   TAKEOUT 商品ページ
   Blue Harbor Coffee
========================= */

const MAX_PER_ITEM = 3;

let products = {
  beans: [],
  sweets: []
};

let cart = {};


/* =========================
   初期化
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  await loadProducts();
  loadCart();
  renderProducts();
  setupEvents();
  updateSummary();

});


/* =========================
   商品データ読み込み
========================= */

async function loadProducts(){

  const res = await fetch("data/takeout-products.json");
  const data = await res.json();

  products = {
    beans: data.beans || [],
    sweets: data.sweets || []
  };

}


/* =========================
   カート復元
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

if(products.beans && products.beans.length > 0){

html += `
<div>

<h2 class="text-3xl font-light tracking-wider mb-10">
Coffee Beans
</h2>

<div class="grid md:grid-cols-2 gap-14">
`;

products.beans.forEach(bean => {

html += `
<div class="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">

${bean.tag ? `
<div class="badge ${mapTagClass(bean.tag)}" data-label="${bean.tag}"></div>
` : ""}

<div class="aspect-[4/3] overflow-hidden">
<img src="${bean.image}" class="w-full h-full object-cover hover:scale-110 transition duration-700">
</div>

<div class="p-6 flex flex-col">

<div class="space-y-4 min-h-[120px]">

<h3 class="leading-tight">
<div class="text-lg font-light">${bean.name.jp}</div>
<div class="text-xs text-gray-500">${bean.name.en}</div>
</h3>

${bean.desc ? `
<p class="text-sm text-gray-500 leading-snug">
${bean.desc.jp}
</p>
` : ""}

</div>

<div class="pt-4">
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

<button class="qtyMinus px-3 py-1 bg-slate-100 rounded"
data-id="${bean.id}" data-size="${size}">−</button>

<span class="w-6 text-center" id="qty-${bean.id}-${size}">
${cart[`${bean.id}-${size}`] || 0}
</span>

<button class="qtyPlus px-3 py-1 bg-slate-100 rounded"
data-id="${bean.id}" data-size="${size}">＋</button>

</div>

</div>
`;

});

html += `</div></div></div>`;
});

html += `</div></div>`;
}


/* Sweets */

if(products.sweets && products.sweets.length > 0){

html += `
<div>

<h2 class="text-3xl font-light tracking-wider mb-10">
Sweets
</h2>

<div class="grid md:grid-cols-2 gap-14">
`;

products.sweets.forEach(item => {

html += `
<div class="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">

${item.tag ? `
<div class="badge ${mapTagClass(item.tag)}" data-label="${item.tag}"></div>
` : ""}

<div class="aspect-[4/3] overflow-hidden">
<img src="${item.image}" class="w-full h-full object-cover hover:scale-110 transition duration-700">
</div>

<div class="p-6 flex flex-col">

<div class="space-y-3 min-h-[100px]">

<div class="leading-tight">
<div class="text-lg">${item.name.jp}</div>
<div class="text-xs text-gray-500">${item.name.en}</div>
</div>

${item.desc ? `
<p class="text-sm text-gray-500 leading-snug">
${item.desc.jp}
</p>
` : ""}

</div>

<div class="flex justify-between items-center pt-4">

<span class="text-blue-600 font-semibold">
¥${item.price.toLocaleString()}
</span>

<div class="flex items-center gap-2">

<button class="qtyMinus px-3 py-1 bg-slate-100 rounded"
data-id="${item.id}">−</button>

<span class="w-6 text-center" id="qty-${item.id}">
${cart[`${item.id}-`] || 0}
</span>

<button class="qtyPlus px-3 py-1 bg-slate-100 rounded"
data-id="${item.id}">＋</button>

</div>

</div>

</div>
</div>
`;

});

html += `</div></div>`;
}

area.innerHTML = html;

}
