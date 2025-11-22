// src/api/userCategories/incomeTypes.js
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Get all income types
export const getIncomeTypes = async (uid) => {
  const ref = collection(db, `users/${uid}/incomeTypes`);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Add income type
export const addIncomeType = async (uid, name) => {
  const ref = collection(db, `users/${uid}/incomeTypes`);
  const docRef = await addDoc(ref, { name });
  return docRef.id;
};

// Update income type
export const updateIncomeType = async (uid, id, name) => {
  const ref = doc(db, `users/${uid}/incomeTypes/${id}`);
  await updateDoc(ref, { name });
};

// Delete income type
export const deleteIncomeType = async (uid, id) => {
  const ref = doc(db, `users/${uid}/incomeTypes/${id}`);
  await deleteDoc(ref);
};
