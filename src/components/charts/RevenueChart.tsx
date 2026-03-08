'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: unknown[];
    height?: number;
}

export const RevenueChart = ({ data, height = 300 }: RevenueChartProps) => {
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1C2333" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748B"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748B"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0D1117',
                            borderColor: 'rgba(0, 245, 255, 0.2)',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#00F5FF' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#00F5FF"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={3}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
