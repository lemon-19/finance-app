// src/api/userCategories/debtTypes.js
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Get all debt types
export const getDebtTypes = async (uid) => {
  const ref = collection(db, `users/${uid}/debtTypes`);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Add debt type
export const addDebtType = async (uid, name) => {
  const ref = collection(db, `users/${uid}/debtTypes`);
  const docRef = await addDoc(ref, { name });
  return docRef.id;
};

// Update debt type
export const updateDebtType = async (uid, id, name) => {
  const ref = doc(db, `users/${uid}/debtTypes/${id}`);
  await updateDoc(ref, { name });
};

// Delete debt type
export const deleteDebtType = async (uid, id) => {
  const ref = doc(db, `users/${uid}/debtTypes/${id}`);
  await deleteDoc(ref);
};
