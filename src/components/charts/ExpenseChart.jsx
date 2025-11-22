import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ExpenseChart({ expenses }) {
  const data = {
    labels: expenses.map(e => e.category),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map(e => e.amount),
        backgroundColor: "rgba(37, 99, 235, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Monthly Expenses" } },
  };

  return <Bar data={data} options={options} />;
}
