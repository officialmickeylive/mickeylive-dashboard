'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ActivityChartProps {
    data: unknown[];
    height?: number;
}

export const ActivityChart = ({ data, height = 300 }: ActivityChartProps) => {
    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
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
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        contentStyle={{
                            backgroundColor: '#0D1117',
                            borderColor: 'rgba(191, 0, 255, 0.2)',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#BF00FF' }}
                    />
                    <Bar
                        dataKey="users"
                        radius={[4, 4, 0, 0]}
                        fill="#BF00FF"
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index % 2 === 0 ? '#BF00FF' : '#FFD700'}
                                fillOpacity={0.8}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
