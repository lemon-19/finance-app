// src/api/userCategories/billCategories.js
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Get all bill categories
export const getBillCategories = async (uid) => {
  const ref = collection(db, `users/${uid}/billCategories`);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Add bill category
export const addBillCategory = async (uid, name) => {
  const ref = collection(db, `users/${uid}/billCategories`);
  const docRef = await addDoc(ref, { name });
  return docRef.id;
};

// Update bill category
export const updateBillCategory = async (uid, id, name) => {
  const ref = doc(db, `users/${uid}/billCategories/${id}`);
  await updateDoc(ref, { name });
};

// Delete bill category
export const deleteBillCategory = async (uid, id) => {
  const ref = doc(db, `users/${uid}/billCategories/${id}`);
  await deleteDoc(ref);
};
