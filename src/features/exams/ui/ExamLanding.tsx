import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    FileText,
    CheckCircle2,
    Lock,
    AlertCircle,
    Star,
} from 'lucide-react';
import { MCQPaper } from '../model/types';
import { useRouter } from 'next/navigation';

interface ExamLandingProps {
    modelPapers: MCQPaper[];
    pastPapers: MCQPaper[];
    userProgress?: {
        completedPapers: string[];
        premiumAccess: boolean;
    };
}

export const ExamLanding = ({
    modelPapers,
    pastPapers,
    userProgress,
}: ExamLandingProps) => {
    const router = useRouter();

    const canAccessPaper = (paper: MCQPaper) => {
        if (paper.type === 'model') {
            // First two model papers are free
            const paperIndex = modelPapers.findIndex(p => p.id === paper.id);
            return paperIndex < 2 || userProgress?.premiumAccess;
        } else {
            // Only 2018 paper is free for past papers
            return paper.year === 2018 || userProgress?.premiumAccess;
        }
    };

    const isPaperCompleted = (paperId: string) => {
        return userProgress?.completedPapers.includes(paperId);
    };

    const handleStartPaper = (paper: MCQPaper) => {
        if (!canAccessPaper(paper)) {
            router.push('/pricing');
            return;
        }
        router.push(`/exam/${paper.id}`);
    };

    const renderPaperCard = (paper: MCQPaper) => (
        <Card key={paper.id} className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{paper.title}</CardTitle>
                        <CardDescription>{paper.description}</CardDescription>
                    </div>
                    {!canAccessPaper(paper) && (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-muted-foreground">
                                <FileText className="h-4 w-4 mr-1" />
                                <span>{paper.totalQuestions} Questions</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{paper.timeLimit} mins</span>
                            </div>
                        </div>
                        <Badge
                            variant={paper.metadata.difficulty === 'easy' ? 'default' : 
                                   paper.metadata.difficulty === 'medium' ? 'secondary' : 
                                   'destructive'}
                        >
                            {paper.metadata.difficulty}
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                        {paper.metadata.tags.map(tag => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                {isPaperCompleted(paper.id) && (
                    <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span>Completed</span>
                    </div>
                )}
                <Button
                    onClick={() => handleStartPaper(paper)}
                    disabled={!canAccessPaper(paper)}
                >
                    {canAccessPaper(paper) ? 'Start Paper' : 'Premium Access'}
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <div className="container py-8 space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Model Papers</h1>
                <p className="text-muted-foreground">
                    Practice with our curated model papers to prepare for your exam.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modelPapers.map(renderPaperCard)}
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Past Papers</h1>
                <p className="text-muted-foreground">
                    Review actual exam papers from previous years.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastPapers.map(renderPaperCard)}
                </div>
            </div>

            {!userProgress?.premiumAccess && (
                <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Star className="h-6 w-6 text-yellow-500" />
                            <span>Unlock Premium Access</span>
                        </CardTitle>
                        <CardDescription>
                            Get access to all model papers and past papers with detailed explanations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                <span>Access to all model papers</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                <span>Full past paper archive</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                <span>Detailed answer explanations</span>
                            </li>
                            <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                <span>Progress tracking & analytics</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            size="lg" 
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                            onClick={() => router.push('/pricing')}
                        >
                            Upgrade Now
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};