/* =========================
   Blue Harbor Coffee
   customer.js
========================= */


/* =========================
   設定
========================= */

let CONFIG = null;


/* =========================
   初期化（★一本化）
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  checkOrderData();

  await loadConfig();

  setupDate();

  renderCart();

  setupAgreementUI();

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

  const order = localStorage.getItem("orderData"); // ★変更

  if(!order){

    alert("商品を選択してください");

    location.href = "takeout.html";

  }

}


/* =========================
   カート取得（複数対応）
========================= */

function getCartItems(){

  const raw = localStorage.getItem("orderData"); // ★変更
  if(!raw) return [];

  const data = JSON.parse(raw);

  if(Array.isArray(data)){
    return data;
  }

  return [data];

}


/* =========================
   カート表示
========================= */

function renderCart(){

  const raw = localStorage.getItem("orderData"); // ★変更
  if(!raw) return;

  const data = JSON.parse(raw);

  const items = data.items || [];

  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("totalPrice");

  if(!container || !totalEl) return;

  container.innerHTML = "";

  items.forEach(item => {

    const div = document.createElement("div");
    div.className = "flex items-center gap-4 border-b py-3";

    div.innerHTML = `
      <img src="${item.image}" 
           class="w-16 h-16 object-cover rounded-xl shadow-sm">

      <div class="flex-1">
        <p class="font-semibold">
          ${item.name}
        </p>
        <p class="text-sm text-gray-500">
          ${item.size ? item.size + "g × " : "× "}${item.qty}
        </p>
      </div>

      <p class="font-bold">
        ¥${item.subtotal.toLocaleString()}
      </p>
    `;

    container.appendChild(div);

  });

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


  /* =========================
     ★ 追加：当日受付終了チェック
  ========================= */
  if(isToday && now.getHours() >= closeHour - 1){

    select.innerHTML = `<option>本日の受付は終了しました</option>`;

    return;

  }


  for(let h = CONFIG.openHour; h < closeHour; h++){

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
   同意UI制御
========================= */

function setupAgreementUI(){

  const agree = document.getElementById("agree");
  const btn = document.getElementById("confirmBtn");

  if(!agree || !btn) return;

  btn.disabled = true;
  btn.classList.add("bg-gray-300","cursor-not-allowed");
  btn.classList.remove("bg-blue-600","hover:bg-blue-700");

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

}


/* =========================
   確認ページへ
========================= */

function goConfirm(){

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

  localStorage.setItem( // ★変更
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


window.goConfirm = goConfirm;
window.backToMenu = backToMenu;
