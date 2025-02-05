import { format } from "date-fns";
import React, { useState } from "react";
import { useAsync, useInterval, useMedia } from "react-use";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { classnames } from "tailwindcss-classnames";
import { TimeseriesData } from "../generated/timeseries";
import { useStore } from "../store";
import {formatNumber} from "../utils";

const StatsView: React.FC<{}> = () => {
  const { coins, pizzas } = useStore((state) => state.gameState.resources);
  const stats = useStore((state) => state.gameStats);

  const [now, setNow] = useState(Date.now());
  useInterval(() => {
    setNow(Date.now());
  }, 10000);

  const rows =
    (stats && [
      { label: "Employed chefs", value: stats.employedChefs },
      { label: "Employed salesmice", value: stats.employedSalesmice },
      {
        label: "Pizzas produces",
        value: `${formatNumber(stats.pizzasProducedPerSecond)}/s`,
      },
      {
        label: "Max sells",
        value: `${formatNumber(stats.maxSellsByMicePerSecond)}/s`,
      },
      {
        label: "Pizza demand (offpeak)",
        value: `${formatNumber(stats.demandOffpeak)}/s`,
      },
      {
        label: "Pizza demand (rush hour)",
        value: `${formatNumber(stats.demandRushHour)}/s`,
      },
    ]) ??
    [];

  const tsData = useAsync(async () => {
    const response = await fetch("/api/timeseries/data");
    if (
      !response.ok ||
      response.headers.get("Content-Type") !== "application/json"
    ) {
      throw new Error("Failed to get timeseries data");
    }
    const data = TimeseriesData.fromJson(await response.json());
    return data;
  });

  const isMinLg = useMedia("(min-width: 1024px)", false);
  const chartSize = isMinLg
    ? {
        width: 600,
        height: 300,
      }
    : {
        width: 300,
        height: 150,
      };

  const dpNow = { timestamp: now, pizzas, coins };
  const chartData = tsData.value
    ? [...tsData.value?.dataPoints, dpNow]
    : [dpNow];

  return (
    <div
      className={classnames(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "mt-2",
        "px-2"
      )}
    >
      <h2>Stats</h2>
      <table
        className={classnames(
          "w-full",
          "max-w-md",
          "my-4",
          "border-collapse",
          "border-green-400",
          "border-2"
        )}
      >
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr
              key={label}
              className={classnames({
                "bg-green-200": i % 2 === 0,
              })}
            >
              <td className={classnames("p-1")}>{label}</td>
              <td className={classnames("p-1")}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Resource History</h3>
      {chartData && (
        <LineChart
          width={chartSize.width}
          height={chartSize.height}
          data={chartData}
        >
          <Line type="monotone" dataKey="coins" stroke="#F59E0B" />
          <Line type="monotone" dataKey="pizzas" stroke="#991B1B" />
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="timestamp"
            domain={["dataMin", "dataMax"]}
            padding={{ left: 10, right: 10 }}
            name="Time"
            tickFormatter={(t) => format(new Date(Number(t)), "dd/MM HH:mm")}
            type="number"
          />
          <YAxis />
          <Tooltip
            labelFormatter={(l) => format(new Date(Number(l)), "dd/MM HH:mm")}
            formatter={(value: number) => formatNumber(Math.floor(value))}
          />
          <Legend verticalAlign="top" />
        </LineChart>
      )}
    </div>
  );
};

export default StatsView;
