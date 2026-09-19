"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function BenchmarkLineChart({
  data,
}: {
  data: { date: string; portfolio: number; indice: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#5B6B63" }} />
        <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#D8DBD4" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="portfolio" name="Portefeuille" stroke="#1F4D3D" strokeWidth={2} dot={false} />
        <Line
          type="monotone"
          dataKey="indice"
          name="Indice de référence"
          stroke="#5B6B63"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
