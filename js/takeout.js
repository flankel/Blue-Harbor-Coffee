import { db, collection, addDoc } from "./firebase.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const MAX_PER_ITEM = 3;
let products = {};

document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  renderProducts();
  setupDate();
});

async function loadProducts(){
  const res = await fetch("data/takeout-products.json");
  products = await res.json();
}

/* =========================
   商品描画
========================= */

function renderProducts(){

  const area = document.getElementById("productArea");

  if(!products.beans) return;

  let html = `
    <div>
      <h2 class="text-2xl mb-8 font-semibold">Coffee Beans</h2>
      <div class="grid md:grid-cols-2 gap-10">
  `;

  products.beans.forEach(bean => {

    html += `
      <div class="bg-white p-6 rounded-2xl shadow-sm space-y-5">

        <div class="w-full h-48 overflow-hidden rounded-xl bg-slate-100">
          <img src="${bean.image}" 
               class="w-full h-full object-cover hover:scale-110 transition duration-500">
        </div>

        <h3 class="font-medium text-lg">${bean.name}</h3>
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


  /* SWEETS */

  html += `
    <div>
      <h2 class="text-2xl mb-8 font-semibold">Sweets</h2>
      <div class="grid md:grid-cols-2 gap-10">
  `;

  products.sweets.forEach(item => {
  
    html += `
      <div class="bg-white p-6 rounded-2xl shadow-sm space-y-5">
  
        <div class="w-full h-48 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
          Coming Soon
        </div>
  
        <div class="flex justify-between items-center py-2 border-b last:border-none">
  
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
            class="border rounded-lg px-3 py-1 qtySelect">
            ${createOptions()}
          </select>
  
        </div>
  
      </div>
    `;
  });

  html += `</div></div>`;

  area.innerHTML = html;
}

function createOptions(){
  let opt = `<option value="0">0</option>`;
  for(let i=1;i<=MAX_PER_ITEM;i++){
    opt += `<option value="${i}">${i}</option>`;
  }
  return opt;
}

/* =========================
   日付・時間
========================= */

function setupDate(){

  const picker = document.getElementById("datePicker");

  const today = new Date();
  const max = new Date();

  max.setDate(today.getDate()+7);

  picker.min = today.toISOString().split("T")[0];
  picker.max = max.toISOString().split("T")[0];

  picker.addEventListener("change", generateTimeSlots);

}

function generateTimeSlots(){

  const date = document.getElementById("datePicker").value;
  const select = document.getElementById("timePicker");

  select.innerHTML="";

  if(!date) return;

  const d = new Date(date);
  const day = d.getDay();

  if(day===3){

    select.innerHTML="<option>定休日</option>";
    return;

  }

  let close = 21;

  if(day===5||day===6) close=23;

  for(let h=8; h<close; h++){

    select.innerHTML += `<option>${h}:00-${h+1}:00</option>`;

  }

}


/* =========================
   注文収集
========================= */

function collectOrder(){

  const selects = document.querySelectorAll(".qtySelect");

  let items = [];

  selects.forEach(sel=>{

    if(sel.value > 0){

      const type = sel.dataset.type;
      const id = sel.dataset.id;
      const name = sel.dataset.name;
      const size = sel.dataset.size || "";
      const qty = Number(sel.value);

      let price = 0;

      if(type === "bean"){

        const bean = products.beans.find(b => b.id === id);
        price = bean.sizes[size];

      }

      if(type === "sweet"){

        const sweet = products.sweets.find(s => s.id === id);
        price = sweet.price;

      }

      items.push({
        type,
        id,
        name,
        size,
        qty,
        price,
        subtotal: price * qty
      });

    }

  });

  return items;

}


/* =========================
   確認モーダル
========================= */

function openConfirm(){

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;
  const message = document.getElementById("message").value.trim();

  if(!name || !phone || !email || !date || !time){

    alert("必須項目を全て入力してください");
    return;

  }

  const items = collectOrder();

  if(items.length === 0){

    alert("商品を選択してください");
    return;

  }

  let html = "";
  let total = 0;

  items.forEach(i=>{

    const subtotal = i.price * i.qty;
    total += subtotal;

    html += `<p>${i.name} ${i.size ? i.size + "g" : ""} × ${i.qty} = ¥${subtotal.toLocaleString()}</p>`;

  });

  html += `<hr class="my-4"><p class="text-lg font-semibold">合計 ¥${total.toLocaleString()}</p>`;

  document.getElementById("confirmContent").innerHTML = html;

  const modal = document.getElementById("modal");

  modal.classList.remove("hidden");
  modal.classList.add("flex");

}

function closeModal(){

  const modal = document.getElementById("modal");

  modal.classList.add("hidden");
  modal.classList.remove("flex");

}


/* =========================
   注文送信
========================= */

let sending = false;

async function submitOrder(){

  if(sending) return;

  sending = true;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;
  const message = document.getElementById("message").value.trim();

  const items = collectOrder();

  let total = 0;

  items.forEach(i=>{
    total += i.price * i.qty;
  });

  try{

    await addDoc(collection(db,"orders"),{

      name: name,
      phone: phone,
      email: email,
      message: message,
      date: date,
      time: time,
      items: items,
      total: total,
      status: "new",
      createdAt: serverTimestamp()

    });

  }catch(e){

    console.error(e);
    alert("注文保存エラー");

    sending = false;

    return;

  }
  
  const orderText = items.map(i => {

    const size = i.size ? ` ${i.size}g` : "";

    return `${i.name}${size} ×${i.qty}　¥${i.subtotal.toLocaleString()}`;

  }).join("\n");

  const templateParams = {

    name: name,
    phone: phone,
    email: email,
    date: date,
    time: time,
    order: orderText,
    message: message || "なし",
    total: total.toLocaleString()

  };

  console.log("orderText =", orderText);
  console.log("templateParams =", templateParams);

  emailjs.send("service_l7e4fi8","template_8fm7t8b",templateParams)

  .then(()=>{

    alert("予約が完了しました");
    location.reload();

  })

  .catch(()=>{

    alert("メール送信エラー");

  });

}

window.openConfirm = openConfirm;
window.closeModal = closeModal;
window.submitOrder = submitOrder;
