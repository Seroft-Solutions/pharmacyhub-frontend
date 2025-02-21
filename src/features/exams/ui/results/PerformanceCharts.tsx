import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { QuestionAnalysis } from '../../lib/analysis';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

interface PerformanceChartsProps {
    analysis: QuestionAnalysis;
}

export const PerformanceCharts = ({ analysis }: PerformanceChartsProps) => {
    // Prepare data for topic-wise performance chart
    const topicData = Object.entries(analysis.topicWiseAnalysis).map(([topic, stats]) => ({
        name: topic,
        Accuracy: Math.round(stats.accuracy),
        Attempted: Math.round((stats.attempted / stats.total) * 100),
    }));

    // Prepare data for difficulty distribution pie chart
    const difficultyData = Object.entries(analysis.difficultyAnalysis).map(([difficulty, stats]) => ({
        name: difficulty,
        value: stats.total,
        correct: stats.correct,
    }));

    const DIFFICULTY_COLORS = {
        easy: '#4ade80',
        medium: '#fbbf24',
        hard: '#f87171',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topic-wise Performance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Topic-wise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topicData}>
                                <XAxis 
                                    dataKey="name" 
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis 
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="Accuracy"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="Attempted"
                                    fill="#93c5fd"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Difficulty Distribution Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Question Difficulty Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={difficultyData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {difficultyData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={DIFFICULTY_COLORS[entry.name as keyof typeof DIFFICULTY_COLORS]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    formatter={(value) => {
                                        const data = difficultyData.find(d => d.name === value);
                                        return `${value} (${data?.correct}/${data?.value})`;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Time Distribution Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Average Time per Topic</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={Object.entries(analysis.topicWiseAnalysis).map(([topic, stats]) => ({
                                    name: topic,
                                    time: Math.round(stats.averageTime),
                                }))}
                            >
                                <XAxis 
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                    unit="s"
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="time"
                                    fill="#a855f7"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle>Improvement Areas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(analysis.topicWiseAnalysis)
                            .filter(([_, stats]) => stats.accuracy < 70)
                            .map(([topic, stats]) => (
                                <div key={topic} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{topic}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {Math.round(stats.accuracy)}% accuracy
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {stats.accuracy < 50
                                            ? 'Needs significant improvement'
                                            : 'Room for improvement'}
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};