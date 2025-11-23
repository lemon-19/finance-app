import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, Timestamp, query, where, orderBy, limit, startAfter } from "firebase/firestore";

// Add expense
export const addExpense = async (uid, category, amount, description) => {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      uid,
      category,
      amount,
      description,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};

// Get expenses for user
export const getExpenses = async (uid) => {
  try {
    const q = query(collection(db, "expenses"), where("uid", "==", uid), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
};

// Get expenses for user (Paginated fetch)
export const getExpensesPaginated = async (uid, limitNum = 10, lastDoc = null) => {
  try {
    let q;
    if (lastDoc) {
      q = query(
        collection(db, "expenses"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(limitNum)
      );
    } else {
      q = query(
        collection(db, "expenses"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(limitNum)
      );
    }

    const snapshot = await getDocs(q);
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    return { expenses, lastVisible };
  } catch (error) {
    console.error("Error fetching paginated expenses:", error);
  }
};

// Update expense
export const updateExpense = async (id, data) => {
  try {
    const expenseRef = doc(db, "expenses", id);
    await updateDoc(expenseRef, data);
  } catch (error) {
    console.error("Error updating expense:", error);
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    await deleteDoc(doc(db, "expenses", id));
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};
