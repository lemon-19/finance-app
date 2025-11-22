import { useEffect, useState } from "react";
import { getBills, addBill, deleteBill } from "../../api/bills";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Trash } from "lucide-react";

export default function Bills() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  // Fetch bills
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await getBills(user.uid);
      setBills(data);
    };
    fetchData();
  }, [user]);

  const handleAdd = async () => {
    if (!name || !amount || !dueDate) return;
    await addBill(user.uid, name, Number(amount), dueDate, category);
    const updated = await getBills(user.uid);
    setBills(updated);
    setName("");
    setAmount("");
    setDueDate("");
    setCategory("");
  };

  const handleDelete = async (id) => {
    await deleteBill(id);
    setBills(bills.filter((b) => b.id !== id));
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold mb-5">Bills</h2>

      {/* Add bill form */}
      <div className="bg-white p-5 shadow rounded mb-5 grid gap-3 md:grid-cols-5">
        <Input label="Bill Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Button className="mt-5 md:mt-0" onClick={handleAdd}>Add Bill</Button>
      </div>

      {/* Bills table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Bill Name</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Due Date</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{bill.name}</td>
                <td className="py-2 px-4">₱{bill.amount}</td>
                <td className="py-2 px-4">{bill.dueDate}</td>
                <td className="py-2 px-4">{bill.category}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(bill.id)} className="text-red-500 hover:text-red-700">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
