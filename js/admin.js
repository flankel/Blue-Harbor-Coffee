import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {
getFirestore,
collection,
getDocs,
doc,
updateDoc,
orderBy,
query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


const firebaseConfig = {

  apiKey: "AIzaSyBlBC7PgW3aCvulWTJu3YMs9HPRydRdjY0",
  authDomain: "blue-harbor-takeout.firebaseapp.com",
  projectId: "blue-harbor-takeout"

}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)


let orders = []

document.addEventListener("DOMContentLoaded", async () => {

  await loadOrders()

})



/* =========================
   注文取得
========================= */

async function loadOrders(){

  try{

    const q = query(
      collection(db,"orders"),
      orderBy("createdAt","desc")
    )

    const snapshot = await getDocs(q)

    orders = []

    snapshot.forEach(docSnap=>{

      orders.push({
        id:docSnap.id,
        ...docSnap.data()
      })

    })

    renderOrders()
    updateDashboard()

  }catch(e){

    console.error("Firestore取得エラー",e)

  }

}



/* =========================
   注文表示
========================= */

function renderOrders(){

  const container = document.getElementById("orders")

  container.innerHTML=""

  orders.forEach(order=>{

    let itemsHTML=""

    if(order.items){

      order.items.forEach(i=>{

        itemsHTML += `
        <div class="text-sm">
        ${i.name} ${i.size ? i.size+"g":""} × ${i.qty}
        </div>
        `

      })

    }

    const card = document.createElement("div")

    card.className="bg-white p-6 rounded-xl shadow space-y-4"

    card.innerHTML=`

    <div class="flex justify-between">

      <div>

        <p class="font-semibold">${order.name}</p>
        <p class="text-sm text-slate-500">${order.phone}</p>
        <p class="text-sm text-slate-500">${order.email}</p>

      </div>

      <div class="text-right">

        <p class="text-sm">${order.date}</p>
        <p class="text-sm">${order.time}</p>

      </div>

    </div>

    <div class="border-t pt-3 space-y-1">

      ${itemsHTML}

    </div>

    <div class="border-t pt-3 flex justify-between items-center">

      <p class="font-semibold">
      ¥${Number(order.total).toLocaleString()}
      </p>

      <select
      onchange="updateStatus('${order.id}',this.value)"
      class="border rounded px-2 py-1">

        <option value="new" ${order.status==="new"?"selected":""}>
        新規
        </option>

        <option value="preparing" ${order.status==="preparing"?"selected":""}>
        準備中
        </option>

        <option value="ready" ${order.status==="ready"?"selected":""}>
        受渡し待ち
        </option>

        <option value="done" ${order.status==="done"?"selected":""}>
        完了
        </option>

      </select>

    </div>

    `

    container.appendChild(card)

  })

}



/* =========================
   ステータス更新
========================= */

window.updateStatus = async (id,status)=>{

  try{

    await updateDoc(
      doc(db,"orders",id),
      {status:status}
    )

  }catch(e){

    console.error("status update error",e)

  }

}



/* =========================
   ダッシュボード更新
========================= */

function updateDashboard(){

  const orderCount = orders.length

  document.getElementById("orderCount").innerText = orderCount


  let todaySales=0
  let preparing=0
  let ready=0

  const today = new Date().toISOString().split("T")[0]

  orders.forEach(o=>{

    if(o.date===today){

      todaySales += Number(o.total)

    }

    if(o.status==="preparing") preparing++
    if(o.status==="ready") ready++

  })


  document.getElementById("todaySales").innerText =
  "¥"+todaySales.toLocaleString()

  document.getElementById("preparingCount").innerText = preparing
  document.getElementById("readyCount").innerText = ready

}
