"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function ValueLineChart({ data }: { data: { date: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#5B6B63" }}
        />
        <YAxis hide domain={["dataMin - 100000", "dataMax + 100000"]} />
        <Tooltip
          formatter={(value: number) => new Intl.NumberFormat("fr-FR").format(value)}
          contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: "#D8DBD4" }}
        />
        <Line type="monotone" dataKey="value" stroke="#1F4D3D" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
