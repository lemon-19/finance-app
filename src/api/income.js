import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, where, orderBy } from "firebase/firestore";
import { addBill } from "./bills";

// Add income
export const addIncome = async (uid, type, amount, description, dueDate = null) => {
  try {
    const docRef = await addDoc(collection(db, "income"), {
      uid,
      type,
      amount,
      description,
      dueDate: dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
      createdAt: Timestamp.now(),
    });

    // If the income is a Loan/Debt, create a corresponding bill
    if (type.toLowerCase() === "loan" || type.toLowerCase() === "debt") {
      await addBill(uid, `Loan: ${description || type}`, amount, dueDate, "Loan"); 
      // category here can be "Loan" or whatever your bills categories are
    }

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
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate ? data.dueDate.toDate() : null, // convert Timestamp to JS Date
      };
    });
  } catch (error) {
    console.error("Error fetching income:", error);
  }
};

// Update income
export const updateIncome = async (id, data) => {
  try {
    const incomeRef = doc(db, "income", id);
    const updatedData = {
      ...data,
      dueDate: data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : null,
    };
    await updateDoc(incomeRef, updatedData);
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
