import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp, query, where, orderBy } from "firebase/firestore";

// Add bill
export const addBill = async (uid, name, amount, dueDate, category) => {
  try {
    const docRef = await addDoc(collection(db, "bills"), {
      uid,
      name,
      amount,
      dueDate,
      category,
      status: "unpaid",   // ← NEW
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding bill:", error);
  }
};

//Mark a bill as paid
export const markBillAsPaid = async (id) => {
  try {
    const billRef = doc(db, "bills", id);
    await updateDoc(billRef, { status: "paid" });
  } catch (error) {
    console.error("Error marking bill as paid:", error);
  }
};


// Get bills
export const getBills = async (uid) => {
  try {
    const q = query(collection(db, "bills"), where("uid", "==", uid), orderBy("dueDate"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching bills:", error);
  }
};

// Update bill
export const updateBill = async (id, data) => {
  try {
    const billRef = doc(db, "bills", id);
    await updateDoc(billRef, data);
  } catch (error) {
    console.error("Error updating bill:", error);
  }
};

// Delete bill
export const deleteBill = async (id) => {
  try {
    await deleteDoc(doc(db, "bills", id));
  } catch (error) {
    console.error("Error deleting bill:", error);
  }
};
