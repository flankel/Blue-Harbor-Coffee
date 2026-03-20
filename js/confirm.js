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
// storage読み込み（★変更）
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
// 注文表示（★画像対応）
// ==============================

function renderOrder(){

const container = document.getElementById("orderItems");

container.innerHTML = "";

orderData.items.forEach(item => {

const name = item.size
? `${item.name} ${item.size}g`
: item.name;

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

// ==============================
// 金額計算
// ==============================

const taxRate = 0.08;

const subtotal = orderData.total;

const tax = Math.round(subtotal * taxRate);

const total = subtotal + tax;


// ==============================
// 注文番号生成
// ==============================

const orderNumber =
"BH-" + Date.now().toString().slice(-6);


// ==============================
// 日付キー
// ==============================

const today = new Date();

const dayKey =
today.getFullYear() + "-" +
String(today.getMonth()+1).padStart(2,"0") + "-" +
String(today.getDate()).padStart(2,"0");


// ==============================
// Firestore保存
// ==============================

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
// メール送信
// ==============================

await sendEmails(orderRef.id,total);


// ==============================
// storage削除（★変更）
// ==============================

localStorage.removeItem("orderData");
localStorage.removeItem("customerData");
localStorage.removeItem("cart");


// ==============================
// 完了画面
// ==============================

location.href = "complete.html";


}catch(err){

console.error(err);

alert("注文送信に失敗しました。");

btn.disabled = false;

btn.textContent = "注文確定";

isSubmitting = false;

}

};


// ==============================
// Email送信
// ==============================

async function sendEmails(orderId,total){

const itemsText = formatOrderItems(orderData.items,total);

await emailjs.send(

"service_l7e4fi8",

"template_8fm7t8b",

{
order_id: orderId,
name: customerData.name,
phone: customerData.phone,
email: customerData.email,
date: customerData.date,
time: customerData.time,
items: itemsText,
total: total,
message: customerData.message || ""
}

);

}


// ==============================
// 注文内容フォーマット
// ==============================

function formatOrderItems(items,total){

const header =
"商品".padEnd(22) +
"数量".padEnd(6) +
"小計";

const divider = "-".repeat(40);

const lines = items.map(item => {

const name = item.size
? `${item.name} ${item.size}g`
: item.name;

const subtotal = item.price * item.qty;

const nameCol = name.padEnd(22," ");

const qtyCol = (`×${item.qty}`).padEnd(6," ");

const priceCol = `¥${subtotal.toLocaleString()}`;

return nameCol + qtyCol + priceCol;

});


const taxRate = 0.08;

const subtotal = total / 1.08;

const tax = total - subtotal;

const totalLine =
"\n" +
divider +
"\n" +
"小計(税抜)".padEnd(28) + `¥${Math.round(subtotal).toLocaleString()}` + "\n" +
"消費税(8%)".padEnd(28) + `¥${Math.round(tax).toLocaleString()}` + "\n" +
divider +
"\n" +
"合計(税込)".padEnd(28) + `¥${total.toLocaleString()}`;


return [
header,
divider,
...lines,
totalLine
].join("\n");

}
