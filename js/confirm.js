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
  appId: "1:687997239074:web:d29a92a47c69e2f67aaf7b",
  measurementId: "G-3S75RH1N5G"
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

loadSession();

renderOrder();

renderCustomer();

}



// ==============================
// sessionStorage読み込み
// ==============================

function loadSession(){

const order = sessionStorage.getItem("orderData");
const customer = sessionStorage.getItem("customerData");

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

const div = document.createElement("div");

div.className = "flex justify-between";

div.innerHTML = `
<span>${item.name} × ${item.qty}</span>
<span>¥${item.price * item.qty}</span>
`;

container.appendChild(div);

});

document.getElementById("orderTotal").textContent = "¥" + orderData.total;

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
document.getElementById("c_message").textContent = customerData.message || "";

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

// Firestore保存

const orderRef = await addDoc(collection(db,"orders"),{

store: "blueharbor",

createdAt: serverTimestamp(),

items: orderData.items,

total: orderData.total,

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



// Email送信

await sendEmails(orderRef.id);



// session削除

sessionStorage.removeItem("orderData");
sessionStorage.removeItem("customerData");



// 完了ページ

location.href = "complete.html";

}catch(err){

console.error(err);

alert("注文送信に失敗しました。もう一度お試しください。");

btn.disabled = false;
btn.textContent = "注文確定";

isSubmitting = false;

}

};



// ==============================
// Email送信
// ==============================

async function sendEmails(orderId){

const itemsText = formatOrderItems(orderData.items, orderData.total);


// 顧客メール

await emailjs.send(

"default_service",

"template_takeout_customer",

{

order_id: orderId,

name: customerData.name,

phone: customerData.phone,

email: customerData.email,

date: customerData.date,

time: customerData.time,

items: itemsText,

total: orderData.total,

message: customerData.message || ""

}

);


// 店舗メール

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

total: orderData.total,

message: customerData.message || ""

}

);

}

// ==============================
// 注文内容フォーマット（メール用）
// ==============================

function formatOrderItems(items, total){

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

const nameCol = name.padEnd(22, " ");
const qtyCol = (`×${item.qty}`).padEnd(6, " ");
const priceCol = `¥${subtotal.toLocaleString()}`;

return nameCol + qtyCol + priceCol;

});

const taxRate = 0.08;

const subtotal = total;
const tax = Math.round(subtotal * taxRate);
const totalWithTax = subtotal + tax;

const totalLine =
"\n" +
divider +
"\n" +
"小計(税抜)".padEnd(28) + `¥${subtotal.toLocaleString()}` + "\n" +
"消費税(8%)".padEnd(28) + `¥${tax.toLocaleString()}` + "\n" +
divider +
"\n" +
"合計(税込)".padEnd(28) + `¥${totalWithTax.toLocaleString()}`;

}
