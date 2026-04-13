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

  if (typeof emailjs !== "undefined") {
    emailjs.init("wK3E-NyEcLx-5tbSL");
  }

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

    const orderNumber = "BH-" + Date.now().toString().slice(-6);

    // ==============================
    // 🔥 Firestoreに直接保存
    // ==============================

    const docRef = await addDoc(collection(db, "orders"), {
      items: orderData.items,
      subtotal: subtotal,
      tax: tax,
      total: total,
      orderNumber: orderNumber,
      customer: {
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email
      },
      pickup:{
        date: customerData.date,
        time: customerData.time
      },
      message: customerData.message || "",
      createdAt: serverTimestamp()
    });

    const orderId = docRef.id;


    // ==============================
    // メール用HTML
    // ==============================

    const itemsRows = orderData.items.map(item => {
      const sub = item.price * item.qty;
      return `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>¥${sub.toLocaleString()}</td>
      </tr>`;
    }).join("");

    const htmlContent = `
      <h2>ご注文ありがとうございます</h2>
      <p>注文番号：${orderNumber}</p>
      <p>お名前：${customerData.name}</p>
      <p>受取：${customerData.date} ${customerData.time}</p>
      <table>${itemsRows}</table>
      <p>合計：¥${total.toLocaleString()}</p>
    `;

    // ==============================
    // メール送信
    // ==============================

    try{
      await emailjs.send(
        "service_l7e4fi8",
        "template_8fm7t8b",
        {
          html: htmlContent,
          to_email: customerData.email
        }
      );
    }catch(e){
      console.warn("メール失敗:", e);
    }

    // ==============================
    // 後処理
    // ==============================

    localStorage.removeItem("orderData");
    localStorage.removeItem("customerData");
    localStorage.removeItem("cart");

    location.href = "complete.html";

  }catch(err){

    console.error("🔥エラー:", err);

    alert("注文送信に失敗しました");

    btn.disabled = false;
    btn.textContent = "注文確定";
    isSubmitting = false;

  }

};
