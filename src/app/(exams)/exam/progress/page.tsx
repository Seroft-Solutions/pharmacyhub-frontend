'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  TrendingUp,
  Clock,
  BarChart,
  PieChart,
  CheckSquare,
  Award,
  Calendar as CalendarIcon,
  BookOpen
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProgressStatsPage() {
  const [timeRange, setTimeRange] = useState('month');
  
  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Progress Statistics</h1>
          <p className="text-gray-600">Track your performance and improvement over time</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Average Score" 
            value="76%" 
            trend="+3% from last month"
            icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            color="blue"
          />
          
          <StatCard 
            title="Study Time" 
            value="32 hours" 
            trend="12 sessions this month"
            icon={<Clock className="h-5 w-5 text-purple-500" />}
            color="purple"
          />
          
          <StatCard 
            title="Completion Rate" 
            value="85%" 
            trend="28 exams completed"
            icon={<CheckSquare className="h-5 w-5 text-green-500" />}
            color="green"
          />
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="w-full grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scores">Scores</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="time">Study Time</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Performance Metrics</h2>
            <div className="flex gap-2">
              <Button 
                variant={timeRange === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                Week
              </Button>
              <Button 
                variant={timeRange === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                Month
              </Button>
              <Button 
                variant={timeRange === 'year' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('year')}
              >
                Year
              </Button>
              <Button 
                variant={timeRange === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('all')}
              >
                All Time
              </Button>
            </div>
          </div>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Score Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80">
                    <ScoreProgressChart />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Topic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80 flex justify-center items-center">
                    <TopicPerformanceChart />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Monthly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-80">
                    <MonthlyActivityChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="scores">
            <ScoresTab />
          </TabsContent>
          
          <TabsContent value="topics">
            <TopicsTab />
          </TabsContent>
          
          <TabsContent value="time">
            <TimeTab />
          </TabsContent>
          
          <TabsContent value="achievements">
            <AchievementsTab />
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Study Recommendations
            </CardTitle>
            <CardDescription>
              Based on your performance, here are some recommended areas to focus on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-lg font-medium text-amber-800 mb-2">Medicinal Chemistry</h3>
                <p className="text-amber-700 mb-3">
                  This appears to be a challenging area for you. Consider spending more time on this topic.
                </p>
                <Button variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200">
                  Practice Medicinal Chemistry
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Pharmaceutical Calculations</h3>
                <p className="text-blue-700 mb-3">
                  Your scores have been improving, but more practice could help you excel.
                </p>
                <Button variant="outline" className="bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
                  Take Calculation Practice Test
                </Button>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Pharmacology</h3>
                <p className="text-green-700 mb-3">
                  You're doing well here! Continue to maintain your knowledge with periodic review.
                </p>
                <Button variant="outline" className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200">
                  Review Advanced Pharmacology
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

/**
 * Stat Card Component
 */
function StatCard({ 
  title, 
  value, 
  trend, 
  icon,
  color = 'blue'
}: { 
  title: string; 
  value: string; 
  trend: string; 
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}) {
  const bgColor = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50'
  };
  
  const borderColor = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    purple: 'border-purple-200',
    yellow: 'border-yellow-200',
    red: 'border-red-200'
  };
  
  return (
    <Card className={`${bgColor[color]} ${borderColor[color]}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-600 font-medium">{title}</h3>
          {icon}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-gray-600">{trend}</div>
      </CardContent>
    </Card>
  );
}

/**
 * Score Progress Chart
 */
function ScoreProgressChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Your Score',
        data: [65, 68, 72, 70, 75, 73, 78, 80, 76],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Average Score',
        data: [63, 64, 66, 67, 68, 70, 71, 72, 73],
        borderColor: 'rgb(156, 163, 175)',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.4
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 50,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => `Score: ${context.parsed.y}%`
        }
      }
    }
  };
  
  return <Line data={data} options={options} />;
}

/**
 * Topic Performance Chart
 */
function TopicPerformanceChart() {
  const data = {
    labels: [
      'Pharmacology', 
      'Clinical Pharmacy', 
      'Medicinal Chemistry', 
      'Pharmaceutics', 
      'Pharmacognosy', 
      'Pharmacy Practice'
    ],
    datasets: [
      {
        data: [85, 78, 65, 75, 70, 82],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(14, 165, 233, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Score: ${context.parsed}%`
        }
      }
    }
  };
  
  return <Pie data={data} options={options} />;
}

/**
 * Monthly Activity Chart
 */
function MonthlyActivityChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Exams Taken',
        data: [5, 7, 4, 8, 6, 5, 10, 12, 8],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 4
      },
      {
        label: 'Study Hours',
        data: [10, 15, 8, 20, 15, 12, 25, 30, 20],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderRadius: 4
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };
  
  return <Bar data={data} options={options} />;
}

/**
 * Scores Tab Content
 */
function ScoresTab() {
  const examScores = [
    { id: 1, title: 'Pharmacology Basics 2024', date: '2023-09-10', score: 85, percentile: 92 },
    { id: 2, title: 'Clinical Pharmacy Practice', date: '2023-09-05', score: 76, percentile: 68 },
    { id: 3, title: 'Pharmaceutical Calculations', date: '2023-08-28', score: 80, percentile: 75 },
    { id: 4, title: 'Pharmacy Law & Ethics', date: '2023-08-20', score: 72, percentile: 60 },
    { id: 5, title: '2023 Board Exam Paper 1', date: '2023-08-15', score: 78, percentile: 70 }
  ];
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Exam Score History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-y">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Exam</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Score</th>
                  <th className="text-left p-4 font-medium text-gray-600">Percentile</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {examScores.map((exam) => (
                  <tr key={exam.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-medium">{exam.title}</td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(exam.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        exam.score >= 80 
                          ? "bg-green-100 text-green-800" 
                          : exam.score >= 70 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                      }>
                        {exam.score}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Progress value={exam.percentile} className="w-24 h-2" />
                        <span>{exam.percentile}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-slate-50 flex justify-between py-3">
          <Button variant="outline" size="sm">Previous</Button>
          <div className="text-sm text-gray-500">
            Showing 5 of 28 results
          </div>
          <Button variant="outline" size="sm">Next</Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">90-100%</span>
                  <span className="text-sm text-gray-500">3 exams</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">80-89%</span>
                  <span className="text-sm text-gray-500">8 exams</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">70-79%</span>
                  <span className="text-sm text-gray-500">12 exams</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">60-69%</span>
                  <span className="text-sm text-gray-500">4 exams</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Below 60%</span>
                  <span className="text-sm text-gray-500">1 exam</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Bests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex">
                <Award className="h-12 w-12 text-yellow-600 mr-4" />
                <div>
                  <h3 className="font-medium">Highest Overall Score</h3>
                  <p className="text-sm text-gray-600 mb-1">Pharmacology Basics 2024</p>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    92%
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex">
                <TrendingUp className="h-12 w-12 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-medium">Most Improved</h3>
                  <p className="text-sm text-gray-600 mb-1">Pharmaceutical Calculations</p>
                  <Badge className="bg-blue-100 text-blue-800">
                    +15% improvement
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex">
                <Clock className="h-12 w-12 text-green-600 mr-4" />
                <div>
                  <h3 className="font-medium">Fastest Completion</h3>
                  <p className="text-sm text-gray-600 mb-1">OTC Medications</p>
                  <Badge className="bg-green-100 text-green-800">
                    22 minutes
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Topics Tab Content
 */
function TopicsTab() {
  const topicPerformance = [
    { name: 'Pharmacology', score: 85, exams: 10, strengths: ['Drug interactions', 'Mechanism of action'], weaknesses: ['Adverse effects'] },
    { name: 'Clinical Pharmacy', score: 78, exams: 8, strengths: ['Dosing', 'Therapeutic monitoring'], weaknesses: ['Drug-disease interactions'] },
    { name: 'Medicinal Chemistry', score: 65, exams: 6, strengths: ['Structure-activity relationships'], weaknesses: ['Synthesis pathways', 'Stereoselective effects'] },
    { name: 'Pharmaceutics', score: 75, exams: 5, strengths: ['Dosage forms', 'Compounding'], weaknesses: ['Pharmaceutical calculations'] },
    { name: 'Pharmacognosy', score: 70, exams: 4, strengths: ['Natural product sources'], weaknesses: ['Extraction methods', 'Standardization'] },
    { name: 'Pharmacy Practice', score: 82, exams: 12, strengths: ['Patient counseling', 'OTC recommendations'], weaknesses: ['Pharmacy law'] }
  ];
  
  return (
    <div className="space-y-6">
      {topicPerformance.map((topic) => (
        <Card key={topic.name}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>{topic.name}</CardTitle>
              <Badge className={
                topic.score >= 80 
                  ? "bg-green-100 text-green-800" 
                  : topic.score >= 70 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-red-100 text-red-800"
              }>
                {topic.score}%
              </Badge>
            </div>
            <CardDescription>{topic.exams} exams taken</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Performance</span>
                <span className="text-sm text-gray-500">{topic.score}/100</span>
              </div>
              <Progress value={topic.score} className="h-2.5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-md border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                <ul className="ml-5 list-disc text-sm space-y-1 text-green-700">
                  {topic.strengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">Areas for Improvement</h4>
                <ul className="ml-5 list-disc text-sm space-y-1 text-red-700">
                  {topic.weaknesses.map((weakness, i) => (
                    <li key={i}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" size="sm" className="w-full">
              Practice {topic.name}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

/**
 * Time Tab Content
 */
function TimeTab() {
  const studyHourData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: [1.5, 2, 0.5, 3, 1, 4, 2.5],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderRadius: 4
      }
    ]
  };
  
  const studyHourOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      }
    }
  };
  
  const timeDistribution = [
    { activity: 'Practice Exams', hours: 15, percentage: 45 },
    { activity: 'Topic Reviews', hours: 10, percentage: 30 },
    { activity: 'Mock Tests', hours: 5, percentage: 15 },
    { activity: 'Result Analysis', hours: 3, percentage: 10 }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Study Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={studyHourData} options={studyHourOptions} />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeDistribution.map((item) => (
                <div key={item.activity}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.activity}</span>
                    <span className="text-sm text-gray-500">{item.hours} hours ({item.percentage}%)</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productivity Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Best Productivity Time</h4>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Morning: 8AM - 11AM</p>
                  <p className="text-sm text-blue-700">You score 22% better in morning sessions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Longest Study Streak</h4>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">14 Days</p>
                  <p className="text-sm text-green-700">August 12 - August 25, 2023</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Time Management Tip</h4>
              <p className="text-sm text-purple-700">
                Try the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. 
                This can increase your focus and retention.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Achievements Tab Content
 */
function AchievementsTab() {
  const achievements = [
    { id: 1, name: 'Perfect Score', description: 'Score 100% on any exam', completed: true, progress: 100, icon: <Award className="h-10 w-10 text-yellow-500" /> },
    { id: 2, name: 'Study Marathon', description: 'Complete 10 exams in a single week', completed: true, progress: 100, icon: <TrendingUp className="h-10 w-10 text-green-500" /> },
    { id: 3, name: 'Topic Master', description: 'Score over 90% in 5 different topics', completed: false, progress: 60, icon: <BookOpen className="h-10 w-10 text-blue-500" /> },
    { id: 4, name: 'Consistency King', description: 'Study for 30 days in a row', completed: false, progress: 47, icon: <Calendar className="h-10 w-10 text-purple-500" /> },
    { id: 5, name: 'Speed Demon', description: 'Complete an exam in half the allotted time with a passing score', completed: true, progress: 100, icon: <Clock className="h-10 w-10 text-red-500" /> },
    { id: 6, name: 'Comeback Kid', description: 'Improve your score by 20% on a retake exam', completed: false, progress: 75, icon: <BarChart className="h-10 w-10 text-indigo-500" /> },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6 text-center">
            <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">12</h3>
            <p className="text-yellow-700">Achievements Earned</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-blue-800 mb-2">55%</h3>
            <p className="text-blue-700">Achievements Complete</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-800 mb-2">5,250</h3>
            <p className="text-purple-700">Total XP Earned</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id}
            className={`${achievement.completed 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
              : 'bg-white'}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="font-medium">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-500">{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
              
              {achievement.completed && (
                <Badge className="mt-4 bg-green-100 text-green-800">
                  Completed
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}