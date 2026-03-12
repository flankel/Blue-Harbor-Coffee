/* =========================
   TAKEOUT 商品ページ
   Blue Harbor Coffee
========================= */

const MAX_PER_ITEM = 3;

let products = {};


/* =========================
   初期化
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  await loadProducts();
  renderProducts();

});


/* =========================
   商品データ読み込み
========================= */

async function loadProducts(){

  const res = await fetch("data/takeout-products.json");
  products = await res.json();

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
        <h2 class="text-2xl mb-8 font-semibold">Coffee Beans</h2>
        <div class="grid md:grid-cols-2 gap-10">
    `;

    products.beans.forEach(bean => {

      html += `
        <div class="bg-white p-6 rounded-2xl shadow-sm space-y-5">

          <div class="w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-4">
            <img src="${bean.image}" 
            class="max-w-full max-h-full object-contain hover:scale-105 transition duration-500">
          </div>

          <h3 class="font-medium text-lg">
            ${bean.name}
          </h3>
      `;

      Object.keys(bean.sizes).forEach(size => {

        const price = bean.sizes[size];

        html += `
          <div class="flex justify-between items-center py-2 border-b last:border-none">

            <div class="flex items-center gap-4">

              <span class="font-medium text-base">
                ${size}g
              </span>

              <span class="text-slate-500 text-sm">
                ¥${price.toLocaleString()}
              </span>

            </div>

            <select
              data-type="bean"
              data-id="${bean.id}"
              data-name="${bean.name}"
              data-size="${size}"
              class="border rounded-lg px-3 py-1 qtySelect">

              ${createOptions()}

            </select>

          </div>
        `;

      });

      html += `</div>`;

    });

    html += `</div></div>`;

  }


  /* Sweets */

  if(products.sweets){

    html += `
      <div>
        <h2 class="text-2xl mb-8 font-semibold">Sweets</h2>
        <div class="grid md:grid-cols-2 gap-10">
    `;

    products.sweets.forEach(item => {

      html += `
        <div class="bg-white p-6 rounded-2xl shadow-sm space-y-5">

          <div class="w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-4">
            <img src="${item.image}" 
            class="max-w-full max-h-full object-contain hover:scale-105 transition duration-500">
          </div>

          <div class="flex justify-between items-center py-2">

            <div class="flex items-center gap-4">

              <span class="font-medium text-base">
                ${item.name}
              </span>

              <span class="text-slate-500 text-sm">
                ¥${item.price.toLocaleString()}
              </span>

            </div>

            <select
              data-type="sweet"
              data-id="${item.id}"
              data-name="${item.name}"
              data-price="${item.price}"
              class="border rounded-lg px-3 py-1 qtySelect">

              ${createOptions()}

            </select>

          </div>

        </div>
      `;

    });

    html += `</div></div>`;

  }


  area.innerHTML = html;

}


/* =========================
   数量セレクト作成
========================= */

function createOptions(){

  let opt = `<option value="0">0</option>`;

  for(let i=1;i<=MAX_PER_ITEM;i++){

    opt += `<option value="${i}">${i}</option>`;

  }

  return opt;

}


/* =========================
   注文収集
========================= */

function collectOrder(){

  const selects = document.querySelectorAll(".qtySelect");

  let items = [];

  selects.forEach(sel => {

    const qty = Number(sel.value);

    if(qty > 0){

      const type = sel.dataset.type;
      const id = sel.dataset.id;
      const name = sel.dataset.name;
      const size = sel.dataset.size || "";
      const price = Number(sel.dataset.price) || null;

      let itemPrice = price;

      if(type === "bean"){

        const bean = products.beans.find(b => b.id === id);
        itemPrice = bean.sizes[size];

      }

      items.push({

        type: type,
        id: id,
        name: name,
        size: size,
        qty: qty,
        price: itemPrice,
        subtotal: itemPrice * qty

      });

    }

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

  sessionStorage.setItem("orderData", JSON.stringify(orderData));

  location.href = "customer.html";

}

window.goCustomer = goCustomer;
