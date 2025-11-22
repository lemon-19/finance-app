// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  getIncomeTypes,
  addIncomeType,
  updateIncomeType,
  deleteIncomeType,
} from "../../api/userCategories/incomeTypes";
import {
  getExpenseTypes,
  addExpenseType,
  updateExpenseType,
  deleteExpenseType,
} from "../../api/userCategories/expenseTypes";
import {
  getBillCategories,
  addBillCategory,
  updateBillCategory,
  deleteBillCategory,
} from "../../api/userCategories/billCategories";
import {
  getDebtTypes,
  addDebtType,
  updateDebtType,
  deleteDebtType,
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
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold mb-5">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.keys(typeMap).map((type) => (
          <div
            key={type}
            onClick={() => openModal(type)}
            className="p-5 bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
          >
            <h3 className="text-lg font-bold">{typeMap[type].title}</h3>
            <p className="text-gray-500">Click to manage {typeMap[type].title}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <h3 className="text-xl font-bold mb-4">{typeMap[activeType].title}</h3>

            {/* Input */}
            <div className="flex mb-4 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-300 rounded p-2 flex-1"
              />
              {editingItem ? (
                <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 rounded">
                  Update
                </button>
              ) : (
                <button onClick={handleAdd} className="bg-green-500 text-white px-4 rounded">
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
                    <button onClick={() => startEdit(item)} className="text-blue-500">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500">
                      <Trash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
