import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {
getFirestore,
collection,
onSnapshot,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


const firebaseConfig = {

  apiKey: "AIzaSyBlBC7PgW3aCvulWTJu3YMs9HPRydRdjY0",
  authDomain: "blue-harbor-takeout.firebaseapp.com",
  projectId: "blue-harbor-takeout",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const ordersRef = collection(db,"orders")

const ordersDiv = document.getElementById("orders")

const orderCount = document.getElementById("orderCount")
const todaySales = document.getElementById("todaySales")
const preparingCount = document.getElementById("preparingCount")
const readyCount = document.getElementById("readyCount")

onSnapshot(ordersRef,(snapshot)=>{

ordersDiv.innerHTML=""

let total=0
let preparing=0
let ready=0
let sales=0

snapshot.forEach(docSnap=>{

const order = docSnap.data()
const id = docSnap.id

total++

if(order.status==="preparing") preparing++
if(order.status==="ready") ready++
if(order.status==="done") sales+=order.total

const card=document.createElement("div")

card.className="bg-white p-6 rounded-xl shadow"

card.innerHTML=`

<p class="font-semibold mb-2">${order.name}</p>
<p class="text-sm mb-2">${order.phone}</p>
<p class="text-sm mb-4">¥${order.total}</p>

<select onchange="updateStatus('${id}',this.value)" class="border p-1">

<option value="preparing" ${order.status==="preparing"?"selected":""}>準備中</option>
<option value="ready" ${order.status==="ready"?"selected":""}>受渡し待ち</option>
<option value="done" ${order.status==="done"?"selected":""}>受渡し済み</option>

</select>
`

ordersDiv.appendChild(card)

})

orderCount.textContent=total
preparingCount.textContent=preparing
readyCount.textContent=ready
todaySales.textContent="¥"+sales

})

window.updateStatus = async (id,status)=>{

await updateDoc(doc(db,"orders",id),{

status:status

})

}
