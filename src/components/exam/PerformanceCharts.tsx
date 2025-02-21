import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProgress } from '@/types/exam';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PerformanceChartsProps {
  progress: UserProgress;
}

export const PerformanceCharts = ({ progress }: PerformanceChartsProps) => {
  // Prepare data for score trend chart
  const scoreData = progress.attempts.map((attempt, index) => ({
    attempt: index + 1,
    score: attempt.score,
    timeSpent: attempt.timeSpent
  }));

  // Prepare data for topic performance
  const topicData = Object.entries(
    progress.analytics.byTopic
  ).map(([topic, data]) => ({
    topic,
    percentage: data.percentage
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Score Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempt" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  name="Score (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="timeSpent" 
                  stroke="#82ca9d" 
                  name="Time (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topic Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#8884d8">
                    {topicData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mastery Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Mastery Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Strong Topics', value: progress.analytics.strongTopics.length },
                      { name: 'Weak Topics', value: progress.analytics.weakTopics.length },
                      { name: 'Average Topics', value: 
                        Object.keys(progress.analytics.byTopic).length - 
                        (progress.analytics.strongTopics.length + progress.analytics.weakTopics.length)
                      }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {topicData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};