import { useEffect, useState } from "react";
import { getIncome, addIncome, deleteIncome } from "../../api/income";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Trash } from "lucide-react";

export default function Income() {
  const { user } = useAuth();
  const [income, setIncome] = useState([]);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Fetch income data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await getIncome(user.uid);
      setIncome(data);
    };
    fetchData();
  }, [user]);

  const handleAdd = async () => {
    if (!type || !amount) return;
    await addIncome(user.uid, type, Number(amount), description);
    const updated = await getIncome(user.uid);
    setIncome(updated);
    setType("");
    setAmount("");
    setDescription("");
  };

  const handleDelete = async (id) => {
    await deleteIncome(id);
    setIncome(income.filter((i) => i.id !== id));
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold mb-5">Income</h2>

      {/* Add income form */}
      <div className="bg-white p-5 shadow rounded mb-5 grid gap-3 md:grid-cols-4">
        <Input label="Income Type" value={type} onChange={(e) => setType(e.target.value)} />
        <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button className="mt-5 md:mt-0" onClick={handleAdd}>Add Income</Button>
      </div>

      {/* Income table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {income.map((inc) => (
              <tr key={inc.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{inc.type}</td>
                <td className="py-2 px-4">₱{inc.amount}</td>
                <td className="py-2 px-4">{inc.description}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(inc.id)} className="text-red-500 hover:text-red-700">
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
