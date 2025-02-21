'use client';

import { useState } from 'react';
import { Search, Star, Clock, Users, BookOpen, BarChart3, CheckCircle2 } from 'lucide-react';
import { mockModelPapers, mockPastPapers, mockStats, type ExamPaper } from './mock/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StatsCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <Card>
    <CardContent className="flex items-center p-4">
      <div className="p-2 rounded-lg bg-blue-50 mr-4">
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const ExamCard = ({ paper }: { paper: ExamPaper }) => {
  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{paper.title}</CardTitle>
            <CardDescription className="mt-1">{paper.description}</CardDescription>
          </div>
          <Badge className={difficultyColor(paper.difficulty)} variant="secondary">
            {paper.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="font-medium">{paper.totalQuestions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{paper.duration} mins</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="font-medium">{paper.successRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attempts</p>
              <p className="font-medium">{paper.attempts.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Topics</p>
            <div className="flex flex-wrap gap-2">
              {paper.topics.map(topic => (
                <Badge key={topic} variant="outline">{topic}</Badge>
              ))}
            </div>
          </div>

          <Button 
            className="w-full"
            variant={paper.isPremium ? "secondary" : "default"}
          >
            {paper.isPremium ? (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Premium Paper
              </div>
            ) : "Start Practice"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ExamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [activeTab, setActiveTab] = useState('model');

  const papers = activeTab === 'model' ? mockModelPapers : mockPastPapers;

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficulty === 'all' || paper.difficulty === difficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Practice</h1>
          <p className="text-muted-foreground">
            Prepare for your pharmacy exams with our comprehensive question bank
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search papers by title or topics" 
              className="pl-10 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={BookOpen} label="Total Papers" value={mockStats.totalPapers} />
        <StatsCard icon={Clock} label="Avg. Duration" value={`${mockStats.avgDuration} mins`} />
        <StatsCard icon={BarChart3} label="Completion Rate" value={`${mockStats.completionRate}%`} />
        <StatsCard icon={Users} label="Active Users" value={mockStats.activeUsers.toLocaleString()} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="model">Model Papers</TabsTrigger>
          <TabsTrigger value="past">Past Papers</TabsTrigger>
        </TabsList>

        <TabsContent value="model">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.length > 0 ? (
              filteredPapers.map(paper => (
                <ExamCard key={paper.id} paper={paper} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No papers found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter settings
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.length > 0 ? (
              filteredPapers.map(paper => (
                <ExamCard key={paper.id} paper={paper} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No papers found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter settings
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Premium Access Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>Unlock Premium Access</span>
          </CardTitle>
          <CardDescription>
            Get access to all model papers and past papers with detailed explanations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              "Unlimited access to all model papers",
              "Complete past paper archive",
              "Comprehensive answer explanations",
              "Advanced progress tracking & analytics"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center sm:justify-end">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}