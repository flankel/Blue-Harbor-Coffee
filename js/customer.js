/* =========================
   Blue Harbor Coffee
   customer.js
========================= */


/* =========================
   設定
========================= */

let CONFIG = null;


/* =========================
   初期化
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  checkOrderData();

  await loadConfig();

  setupDate();

  renderCart();

});


/* =========================
   config読み込み
========================= */

async function loadConfig(){

  const res = await fetch("data/store-config.json");

  CONFIG = await res.json();

}


/* =========================
   注文データ確認
========================= */

function checkOrderData(){

  const order = sessionStorage.getItem("orderData");

  if(!order){

    alert("商品を選択してください");

    location.href = "takeout.html";

  }

}


/* =========================
   カート取得（複数対応）
========================= */

function getCartItems(){

  const raw = sessionStorage.getItem("orderData");
  if(!raw) return [];

  const data = JSON.parse(raw);

  // ★すでに配列
  if(Array.isArray(data)){
    return data;
  }

  // ★単一オブジェクト → 配列化（互換対応）
  return [data];

}


/* =========================
   カート表示
========================= */

function renderCart(){

  const raw = sessionStorage.getItem("orderData");
  if(!raw) return;

  const data = JSON.parse(raw);

  const items = data.items || []; // ★ここが最重要

  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalPrice");

  if(!container || !totalEl) return;

  container.innerHTML = "";

  items.forEach(item => {

    const div = document.createElement("div");
    div.className = "flex justify-between";

    div.innerHTML = `
      <span>${item.name}${item.size ? " " + item.size + "g" : ""} × ${item.qty}</span>
      <span>¥${item.subtotal.toLocaleString()}</span>
    `;

    container.appendChild(div);

  });

  // ★合計は保存済みを使う（ズレ防止）
  totalEl.textContent = `¥${data.total.toLocaleString()}`;

}

/* =========================
   日付設定
========================= */

function setupDate(){

  const picker = document.getElementById("datePicker");

  const today = new Date();

  const max = new Date();

  max.setDate(today.getDate() + CONFIG.reserveLimitDays);

  picker.min = today.toISOString().split("T")[0];

  picker.max = max.toISOString().split("T")[0];

  picker.addEventListener("change", generateTimeSlots);

}


/* =========================
   時間生成
========================= */

function generateTimeSlots(){

  const date = document.getElementById("datePicker").value;

  const select = document.getElementById("timePicker");

  select.innerHTML = "";

  if(!date) return;

  const selectedDate = new Date(date);

  const day = selectedDate.getDay();


  /* 定休日 */

  if(day === CONFIG.closedDay){

    select.innerHTML = `<option>定休日</option>`;

    return;

  }


  let closeHour = CONFIG.weekdayClose;

  if(day === 5 || day === 6){

    closeHour = CONFIG.weekendClose;

  }


  const now = new Date();

  const isToday =
    now.toISOString().split("T")[0] === date;


  for(let h = CONFIG.openHour; h < closeHour; h++){

    /* 今日の場合は過去時間を除外 */

    if(isToday){

      if(h <= now.getHours()) continue;

    }

    select.innerHTML += `<option>${h}:00-${h+1}:00</option>`;

  }

}


/* =========================
   入力チェック
========================= */

function validateInput(data){

  if(!data.name){
    alert("お名前を入力してください");
    return false;
  }

  if(!data.phone){
    alert("電話番号を入力してください");
    return false;
  }

  if(!/^[0-9\-]+$/.test(data.phone)){
    alert("電話番号の形式が正しくありません");
    return false;
  }

  if(!data.email){
    alert("メールアドレスを入力してください");
    return false;
  }

  if(!/^\S+@\S+\.\S+$/.test(data.email)){
    alert("メールアドレス形式が正しくありません");
    return false;
  }

  if(!data.date){
    alert("来店日を選択してください");
    return false;
  }

  if(!data.time){
    alert("来店時間を選択してください");
    return false;
  }

  if(data.time === "定休日"){
    alert("この日は定休日です");
    return false;
  }

  return true;

}


/* =========================
   同意チェック
========================= */

function checkAgreement(){

  const agree = document.getElementById("agree");

  if(!agree || !agree.checked){
    alert("個人情報の取り扱いに同意してください");
    return false;
  }

  return true;

}


/* =========================
   サニタイズ
========================= */

function sanitize(text){

  if(!text) return "";

  return text.replace(/[<>]/g,"");

}


/* =========================
   確認ページへ
========================= */

function goConfirm(){

  // ★同意チェック
  if(!checkAgreement()) return;

  const name = sanitize(document.getElementById("name").value.trim());
  const phone = sanitize(document.getElementById("phone").value.trim());
  const email = sanitize(document.getElementById("email").value.trim());
  const date = document.getElementById("datePicker").value;
  const time = document.getElementById("timePicker").value;
  const message = sanitize(document.getElementById("message").value.trim());

  const customerData = {
    name,
    phone,
    email,
    date,
    time,
    message
  };

  if(!validateInput(customerData)) return;

  sessionStorage.setItem(
    "customerData",
    JSON.stringify(customerData)
  );

  location.href = "confirm.html";

}


/* =========================
   商品ページへ戻る
========================= */

function backToMenu(){

  location.href = "takeout.html";

}

/* =========================
   同意チェックUI制御
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const agree = document.getElementById("agree");
  const btn = document.getElementById("confirmBtn");

  if(!agree || !btn) return;

  agree.addEventListener("change", () => {

    if(agree.checked){

      btn.disabled = false;
      btn.classList.remove("bg-gray-300","cursor-not-allowed");
      btn.classList.add("bg-blue-600","hover:bg-blue-700");

    }else{

      btn.disabled = true;
      btn.classList.add("bg-gray-300","cursor-not-allowed");
      btn.classList.remove("bg-blue-600","hover:bg-blue-700");

    }

  });

});


window.goConfirm = goConfirm;
window.backToMenu = backToMenu;
