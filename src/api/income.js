import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, where, orderBy } from "firebase/firestore";

// Add income
export const addIncome = async (uid, type, amount, description) => {
  try {
    const docRef = await addDoc(collection(db, "income"), {
      uid,
      type,
      amount,
      description,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding income:", error);
  }
};

// Get incomes
export const getIncome = async (uid) => {
  try {
    const q = query(collection(db, "income"), where("uid", "==", uid), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching income:", error);
  }
};

// Update income
export const updateIncome = async (id, data) => {
  try {
    const incomeRef = doc(db, "income", id);
    await updateDoc(incomeRef, data);
  } catch (error) {
    console.error("Error updating income:", error);
  }
};

// Delete income
export const deleteIncome = async (id) => {
  try {
    await deleteDoc(doc(db, "income", id));
  } catch (error) {
    console.error("Error deleting income:", error);
  }
};
