// src/pages/Settings.jsx
import React, { useState } from "react";
import {
  getIncomeTypes, addIncomeType, updateIncomeType, deleteIncomeType,
} from "../../api/userCategories/incomeTypes";
import {
  getExpenseTypes, addExpenseType, updateExpenseType, deleteExpenseType,
} from "../../api/userCategories/expenseTypes";
import {
  getBillCategories, addBillCategory, updateBillCategory, deleteBillCategory,
} from "../../api/userCategories/billCategories";
import {
  getDebtTypes, addDebtType, updateDebtType, deleteDebtType,
} from "../../api/userCategories/debtTypes";
import { Pencil, Trash } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeType, setActiveType] = useState("");
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const typeMap = {
    income: { get: getIncomeTypes, add: addIncomeType, update: updateIncomeType, delete: deleteIncomeType, title: "Income Types" },
    expense: { get: getExpenseTypes, add: addExpenseType, update: updateExpenseType, delete: deleteExpenseType, title: "Expense Types" },
    bill: { get: getBillCategories, add: addBillCategory, update: updateBillCategory, delete: deleteBillCategory, title: "Bill Categories" },
    debt: { get: getDebtTypes, add: addDebtType, update: updateDebtType, delete: deleteDebtType, title: "Debt Types" },
  };

  const openModal = async (type) => {
    setActiveType(type);
    setModalOpen(true);
    const data = await typeMap[type].get(uid);
    setItems(data);
    setEditingItem(null);
    setNewName("");
  };

  const handleAdd = async () => {
    if (!newName) return;
    await typeMap[activeType].add(uid, newName);
    const data = await typeMap[activeType].get(uid);
    setItems(data);
    setNewName("");
  };

  const handleUpdate = async () => {
    if (!newName || !editingItem) return;
    await typeMap[activeType].update(uid, editingItem.id, newName);
    const data = await typeMap[activeType].get(uid);
    setItems(data);
    setEditingItem(null);
    setNewName("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await typeMap[activeType].delete(uid, id);
    const data = await typeMap[activeType].get(uid);
    setItems(data);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setNewName(item.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-sm text-gray-600">
              Manage your income, expense, bill, and debt categories
            </p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(typeMap).map((type) => (
          <div
            key={type}
            onClick={() => openModal(type)}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">{typeMap[type].title}</h3>
            <p className="text-gray-500 text-sm">Click to manage {typeMap[type].title}</p>
          </div>
        ))}
      </div>

{/* Modal */}
{modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="bg-linear-to-r from-gray-50 to-gray-100 p-6 rounded-t-2xl flex justify-between items-center">
        <h3 className="text-xl font-bold">{typeMap[activeType].title}</h3>
        <button
          onClick={() => setModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        {/* Input */}
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {editingItem ? (
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 transition">
              Update
            </button>
          ) : (
            <button onClick={handleAdd} className="bg-green-500 text-white px-4 rounded-xl hover:bg-green-600 transition">
              Add
            </button>
          )}
        </div>

        {/* List */}
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b border-gray-200 py-2">
              <span>{item.name}</span>
              <div className="flex gap-2">
                <button onClick={() => startEdit(item)} className="text-blue-500 hover:text-blue-600 transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 transition">
                  <Trash size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
