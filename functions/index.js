const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createOrder = functions.https.onCall(async (data, context) => {

  // ==============================
  // バリデーション
  // ==============================

  if (!data) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "データがありません"
    );
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "商品データが不正です"
    );
  }

  if (!data.customer || !data.customer.name || !data.customer.phone) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "顧客情報が不正です"
    );
  }

  // ==============================
  // 注文番号生成
  // ==============================

  const orderNumber = "BH-" + Date.now().toString().slice(-6);

  const today = new Date();

  const dayKey =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

  // ==============================
  // 金額（最低限チェック）
  // ==============================

  const subtotal = Number(data.subtotal) || 0;
  const tax = Number(data.tax) || 0;
  const total = Number(data.total) || 0;

  if (total <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "金額が不正です"
    );
  }

  // ==============================
  // Firestore保存
  // ==============================

  const docRef = await admin.firestore().collection("orders").add({

    store: "blueharbor",
    orderNumber: orderNumber,
    status: "new",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    dayKey: dayKey,

    items: data.items,

    subtotal: subtotal,
    tax: tax,
    total: total,

    customer: {
      name: data.customer.name,
      phone: data.customer.phone,
      email: data.customer.email || ""
    },

    pickup: {
      date: data.pickup?.date || "",
      time: data.pickup?.time || ""
    },

    message: data.message || ""

  });

  // ==============================
  // レスポンス
  // ==============================

  return {
    success: true,
    id: docRef.id,
    orderNumber: orderNumber
  };

});
