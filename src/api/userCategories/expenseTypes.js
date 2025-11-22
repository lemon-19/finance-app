// src/api/userCategories/expenseTypes.js
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Get all expense types
export const getExpenseTypes = async (uid) => {
  const ref = collection(db, `users/${uid}/expenseTypes`);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Add expense type
export const addExpenseType = async (uid, name) => {
  const ref = collection(db, `users/${uid}/expenseTypes`);
  const docRef = await addDoc(ref, { name });
  return docRef.id;
};

// Update expense type
export const updateExpenseType = async (uid, id, name) => {
  const ref = doc(db, `users/${uid}/expenseTypes/${id}`);
  await updateDoc(ref, { name });
};

// Delete expense type
export const deleteExpenseType = async (uid, id) => {
  const ref = doc(db, `users/${uid}/expenseTypes/${id}`);
  await deleteDoc(ref);
};
