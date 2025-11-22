import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLegend,
  VictoryTheme,
  VictoryGroup,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

export default function CombinedChart({ income = [], expenses = [], bills = [] }) {
  // Combine all dates
  const allDates = Array.from(
    new Set(
      [...income, ...expenses, ...bills]
        .map((i) => i.date)
        .filter(Boolean) // filter out undefined/null
    )
  ).sort();

  if (allDates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  // Helper to map data to Victory format
  const mapData = (data) =>
    allDates.map((date) => {
      const entries = data.filter((d) => d.date === date && !isNaN(d.amount));
      const sum = entries.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
      return { x: date, y: sum };
    });

  const incomeData = mapData(income);
  const expenseData = mapData(expenses);
  const billsData = mapData(bills);

  return (
    <div className="w-full" style={{ height: "400px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 20, y: 20 }}
        padding={{ top: 40, bottom: 60, left: 60, right: 20 }}
        height={400}
        width={800}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => `₱${datum.y.toLocaleString()}`}
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: 10 }}
                flyoutStyle={{ fill: "white", stroke: "#ccc" }}
              />
            }
          />
        }
      >
        <VictoryLegend
          x={250}
          y={10}
          orientation="horizontal"
          gutter={20}
          style={{ labels: { fontSize: 11 } }}
          data={[
            { name: "Income", symbol: { fill: "#10b981" } },
            { name: "Expenses", symbol: { fill: "#ef4444" } },
            bills.length > 0 ? { name: "Bills", symbol: { fill: "#3b82f6" } } : null,
          ].filter(Boolean)}
        />

        <VictoryAxis
          tickFormat={(t) => {
            const date = new Date(t);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
          style={{
            tickLabels: { angle: -45, fontSize: 9, padding: 5, textAnchor: "end" },
            axis: { stroke: "#ccc" },
            grid: { stroke: "transparent" },
          }}
        />

        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `₱${t >= 1000 ? `${(t / 1000).toFixed(0)}k` : t}`}
          style={{
            tickLabels: { fontSize: 9 },
            axis: { stroke: "#ccc" },
            grid: { stroke: "#f0f0f0", strokeDasharray: "3,3" },
          }}
        />

        <VictoryGroup>
          <VictoryLine
            data={incomeData}
            style={{ data: { stroke: "#10b981", strokeWidth: 2.5 } }}
            interpolation="monotoneX"
          />
          <VictoryLine
            data={expenseData}
            style={{ data: { stroke: "#ef4444", strokeWidth: 2.5 } }}
            interpolation="monotoneX"
          />
          {bills.length > 0 && (
            <VictoryLine
              data={billsData}
              style={{ data: { stroke: "#3b82f6", strokeWidth: 2.5, strokeDasharray: "5,5" } }}
              interpolation="monotoneX"
            />
          )}
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
}
