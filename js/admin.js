import { db } from "./firebase.js";

import {
collection,
onSnapshot,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const orderArea = document.getElementById("orders");
const sound = document.getElementById("orderSound");

let allOrders = [];
let firstLoad = true;


/* ======================
リアルタイム取得
====================== */

onSnapshot(collection(db,"orders"),(snapshot)=>{

allOrders = [];

snapshot.forEach(docSnap => {

const order = docSnap.data();
order.id = docSnap.id;

allOrders.push(order);

});

renderOrders();

if(!firstLoad){
sound.play();
}

firstLoad = false;

});


/* ======================
描画
====================== */

function renderOrders(){

const search = document.getElementById("searchInput").value.toLowerCase();
const dateFilter = document.getElementById("filterDate").value;

orderArea.innerHTML = "";

let todaySales = 0;
let preparing = 0;
let ready = 0;

const today = new Date().toISOString().split("T")[0];

allOrders.forEach(order=>{

if(dateFilter && order.date !== dateFilter) return;

if(search){

const text = (order.name + order.phone).toLowerCase();

if(!text.includes(search)) return;

}

/* 売上（受渡済のみ） */
if(order.date === today && order.status === "completed"){
  todaySales += Number(order.total);
}

  
if(order.status === "preparing") preparing++;
if(order.status === "ready") ready++;

renderOrder(order);

});

document.getElementById("orderCount").innerText = allOrders.length;

document.getElementById("todaySales").innerText =
"¥" + todaySales.toLocaleString();

document.getElementById("preparingCount").innerText = preparing;

document.getElementById("readyCount").innerText = ready;

}


/* ======================
注文カード
====================== */

function renderOrder(order){

let itemsHTML = "";

/* 商品表示（ここが重要） */

if(order.items && order.items.length > 0){

order.items.forEach(item=>{

itemsHTML += `
<div class="flex justify-between text-sm border-b py-1">

<span>
${item.name} ${item.size ? item.size+"g":""}
</span>

<span>
${item.qty} × ¥${item.price}
</span>

</div>
`;

});

}else{

itemsHTML = `<p class="text-sm text-gray-400">商品データなし</p>`;

}


/* カード */

const card = document.createElement("div");

card.className =
"bg-white p-6 rounded-xl shadow space-y-3";

card.innerHTML = `

<div class="flex justify-between items-center">

<h2 class="font-semibold text-lg">
${order.name}
</h2>

<span class="text-xs px-2 py-1 rounded ${statusColor(order.status)}">
${order.status}
</span>

</div>

<div class="text-sm text-slate-500 space-y-1">

<p>📞 ${order.phone}</p>
<p>📧 ${order.email}</p>
<p>📅 ${order.date}</p>
<p>⏰ ${order.time}</p>

</div>

<div class="pt-3 space-y-1">

${itemsHTML}

</div>

<div class="text-right font-semibold pt-3 border-t">
合計 ¥${order.total}
</div>

<div class="flex gap-2 pt-4 flex-wrap">

<button
onclick="updateStatus('${order.id}','preparing')"
class="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">

準備中

</button>

<button
onclick="updateStatus('${order.id}','ready')"
class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">

準備完了

</button>

<button
onclick="updateStatus('${order.id}','completed')"
class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">

受渡済

</button>

<button
onclick="deleteOrder('${order.id}')"
class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">

削除

</button>

</div>

`;

orderArea.appendChild(card);

}


/* ======================
ステータス色
====================== */

function statusColor(status){

if(status==="new") return "bg-red-200 text-red-700";
if(status==="preparing") return "bg-yellow-200 text-yellow-700";
if(status==="ready") return "bg-green-200 text-green-700";
if(status==="completed") return "bg-blue-200 text-blue-700";

return "bg-gray-200";

}


/* ======================
ステータス更新
====================== */

window.updateStatus = async function(id,status){

await updateDoc(doc(db,"orders",id),{
status:status
});

}


/* ======================
削除
====================== */

window.deleteOrder = async function(id){

if(!confirm("削除しますか？")) return;

await deleteDoc(doc(db,"orders",id));

}


/* ======================
フィルター
====================== */

document.getElementById("searchInput")
.addEventListener("input",renderOrders);

document.getElementById("filterDate")
.addEventListener("change",renderOrders);

window.clearFilter = function(){

document.getElementById("searchInput").value="";
document.getElementById("filterDate").value="";

renderOrders();

}
