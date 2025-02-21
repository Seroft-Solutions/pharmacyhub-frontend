import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Timer, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExamTimerProps {
    totalTime: number; // in seconds
    remainingTime: number;
    isPaused: boolean;
    onPause?: () => void;
    onResume?: () => void;
    onTimeUp: () => void;
}

export const ExamTimer = ({
    totalTime,
    remainingTime,
    isPaused,
    onPause,
    onResume,
    onTimeUp,
}: ExamTimerProps) => {
    const [showWarning, setShowWarning] = useState(false);
    const progress = (remainingTime / totalTime) * 100;

    useEffect(() => {
        if (remainingTime <= 300 && !showWarning) { // 5 minutes warning
            setShowWarning(true);
        }
    }, [remainingTime, showWarning]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours > 0 ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (remainingTime <= 300) return 'text-red-500'; // 5 minutes
        if (remainingTime <= 600) return 'text-yellow-500'; // 10 minutes
        return 'text-green-500';
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Timer className={`h-5 w-5 ${getTimerColor()}`} />
                    <span className={`font-mono text-lg ${getTimerColor()}`}>
                        {formatTime(remainingTime)}
                    </span>
                </div>
                {(onPause || onResume) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={isPaused ? onResume : onPause}
                    >
                        {isPaused ? (
                            <Play className="h-4 w-4" />
                        ) : (
                            <Pause className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>

            <Progress value={progress} className="h-2" />

            {showWarning && remainingTime <= 300 && (
                <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                        Less than {Math.ceil(remainingTime / 60)} minutes remaining!
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};