import React, { useEffect, useState } from 'react';
import { useExamStore } from '@/store/examStore';

interface ExamTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

export const ExamTimer = ({ duration, onTimeUp }: ExamTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const examStartTime = useExamStore((state) => state.examStartTime);

  useEffect(() => {
    if (!examStartTime) return;

    // Calculate remaining time based on start time
    const elapsed = Math.floor((Date.now() - examStartTime.getTime()) / 1000);
    const remaining = Math.max(0, duration - elapsed);
    setTimeLeft(remaining);

    // Set up timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStartTime, duration, onTimeUp]);

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Change color based on remaining time
  const getTimeColor = () => {
    if (timeLeft <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeLeft <= 600) return 'text-orange-500'; // Last 10 minutes
    return 'text-gray-700';
  };

  return (
    <div className="text-center">
      <div className="text-sm font-medium text-gray-500">Time Remaining</div>
      <div className={`text-2xl font-bold ${getTimeColor()}`}>
        {formattedTime}
      </div>
    </div>
  );
};