export default function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow p-5 rounded flex items-center justify-between">
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-blue-600">{icon}</div>
    </div>
  );
}
