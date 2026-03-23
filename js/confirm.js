// confirm.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ==============================
// Firebase設定
// ==============================

const firebaseConfig = {
apiKey: "AIzaSyBlBC7PgW3aCvulWTJu3YMs9HPRydRdjY0",
authDomain: "blue-harbor-takeout.firebaseapp.com",
projectId: "blue-harbor-takeout",
storageBucket: "blue-harbor-takeout.firebasestorage.app",
messagingSenderId: "687997239074",
appId: "1:687997239074:web:d29a92a47c69e2f67aaf7b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==============================
// 変数
// ==============================

let orderData = null;
let customerData = null;
let isSubmitting = false;


// ==============================
// 初期化
// ==============================

document.addEventListener("DOMContentLoaded", init);

function init(){
loadStorage();
renderOrder();
renderCustomer();
}


// ==============================
// storage読み込み
// ==============================

function loadStorage(){

const order = localStorage.getItem("orderData");
const customer = localStorage.getItem("customerData");

if(!order || !customer){
alert("注文情報が見つかりません");
location.href = "takeout.html";
return;
}

orderData = JSON.parse(order);
customerData = JSON.parse(customer);

}


// ==============================
// 注文表示
// ==============================

function renderOrder(){

const container = document.getElementById("orderItems");

container.innerHTML = "";

orderData.items.forEach(item => {

const name = item.name;

const subtotal = item.price * item.qty;

const row = document.createElement("div");

row.className = "flex items-center gap-4 border-b py-3";

row.innerHTML = `
<img src="${item.image}"
     class="w-16 h-16 object-cover rounded-xl shadow-sm">

<div class="flex-1">
  <div class="font-medium">${name}</div>
  <div class="text-sm text-gray-500">× ${item.qty}</div>
</div>

<div class="font-medium">
¥${subtotal.toLocaleString()}
</div>
`;

container.appendChild(row);

});


// ==============================
// 金額計算
// ==============================

const taxRate = 0.08;

const subtotal = orderData.total;

const tax = Math.round(subtotal * taxRate);

const totalWithTax = subtotal + tax;


// ==============================
// 表示
// ==============================

document.getElementById("orderSubtotal").textContent =
"¥" + subtotal.toLocaleString();

document.getElementById("orderTax").textContent =
"¥" + tax.toLocaleString();

document.getElementById("orderTotal").textContent =
"¥" + totalWithTax.toLocaleString();

}


// ==============================
// 顧客表示
// ==============================

function renderCustomer(){

document.getElementById("c_name").textContent = customerData.name;
document.getElementById("c_phone").textContent = customerData.phone;
document.getElementById("c_email").textContent = customerData.email;
document.getElementById("c_date").textContent = customerData.date;
document.getElementById("c_time").textContent = customerData.time;
document.getElementById("c_message").textContent =
customerData.message || "";

}


// ==============================
// 戻る
// ==============================

window.backToCustomer = function(){
location.href = "customer.html";
}


// ==============================
// 注文送信
// ==============================

window.submitOrder = async function(){

if(isSubmitting) return;

isSubmitting = true;

const btn = document.getElementById("submitBtn");

btn.disabled = true;
btn.textContent = "送信中...";

try{

const taxRate = 0.08;
const subtotal = orderData.total;
const tax = Math.round(subtotal * taxRate);
const total = subtotal + tax;

const orderNumber =
"BH-" + Date.now().toString().slice(-6);

const today = new Date();

const dayKey =
today.getFullYear() + "-" +
String(today.getMonth()+1).padStart(2,"0") + "-" +
String(today.getDate()).padStart(2,"0");

const orderRef = await addDoc(collection(db,"orders"),{

store: "blueharbor",
orderNumber: orderNumber,
status: "new",
createdAt: serverTimestamp(),
dayKey: dayKey,

items: orderData.items,

subtotal: subtotal,
tax: tax,
total: total,

customer: {
name: customerData.name,
phone: customerData.phone,
email: customerData.email
},

pickup:{
date: customerData.date,
time: customerData.time
},

message: customerData.message || ""

});


// ==============================
// HTMLメール生成
// ==============================

const itemsRows = orderData.items.map(item => {

const subtotal = item.price * item.qty;

return `
<tr>
  <td>${item.name}</td>
  <td align="center">${item.qty}</td>
  <td align="right">¥${subtotal.toLocaleString()}</td>
</tr>
`;

}).join("");

const htmlContent = `
<table width="100%" style="font-family:sans-serif;background:#f8f6f3;padding:20px;">
<tr><td align="center">
<table width="600" style="background:#fff;padding:30px;border-radius:10px;">

<tr><td align="center">
<img src="https://your-domain.com/logo.png" width="120">
</td></tr>

<tr><td style="padding:20px 0;">
ご予約ありがとうございます ☕
</td></tr>

<tr><td>
<strong>注文番号：</strong>${orderRef.id}<br>
<strong>お名前：</strong>${customerData.name}<br>
<strong>来店：</strong>${customerData.date} ${customerData.time}
</td></tr>

<tr><td style="padding-top:20px;">
<table width="100%" border="1" style="border-collapse:collapse;font-size:13px;">
<tr>
<th>商品</th><th>数量</th><th>小計</th>
</tr>
${itemsRows}
<tr>
<td colspan="2" align="right">小計</td>
<td align="right">¥${subtotal.toLocaleString()}</td>
</tr>
<tr>
<td colspan="2" align="right">税</td>
<td align="right">¥${tax.toLocaleString()}</td>
</tr>
<tr>
<td colspan="2" align="right"><strong>合計</strong></td>
<td align="right"><strong>¥${total.toLocaleString()}</strong></td>
</tr>
</table>
</td></tr>

</table>
</td></tr>
</table>
`;


// ==============================
// メール送信
// ==============================

await emailjs.send(

"service_l7e4fi8",
"template_8fm7t8b",

{
order_id: orderRef.id,
name: customerData.name,
phone: customerData.phone,
email: customerData.email,
date: customerData.date,
time: customerData.time,
items: "※HTMLメールを表示してください",
html: htmlContent,
total: total,
message: customerData.message || ""
}

);


// ==============================
// storage削除
// ==============================

localStorage.removeItem("orderData");
localStorage.removeItem("customerData");
localStorage.removeItem("cart");

location.href = "complete.html";

}catch(err){

console.error(err);

alert("注文送信に失敗しました。");

btn.disabled = false;
btn.textContent = "注文確定";
isSubmitting = false;

}

};
