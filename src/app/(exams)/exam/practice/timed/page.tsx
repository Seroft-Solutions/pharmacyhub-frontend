import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TimedExamsPage() {
  const timedExams = [
    { id: 1, title: '60-Minute Full Practice Test', questions: 60, time: 60, difficulty: 'Hard' },
    { id: 2, title: '30-Minute Quick Assessment', questions: 30, time: 30, difficulty: 'Medium' },
    { id: 3, title: '15-Minute Rapid Quiz', questions: 15, time: 15, difficulty: 'Easy' },
    { id: 4, title: '45-Minute Subject Focus', questions: 45, time: 45, difficulty: 'Medium' },
  ];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Timed Exams
      </h1>
      
      <p className="text-gray-600 mb-6">
        Challenge yourself with time-limited exams to simulate real test conditions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {timedExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <CardTitle>{exam.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Questions:</span>
                  <span className="text-sm font-semibold">{exam.questions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Time Limit:</span>
                  <span className="text-sm font-semibold">{exam.time} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span 
                    className={`text-sm font-semibold ${
                      exam.difficulty === 'Hard' 
                        ? 'text-red-600' 
                        : exam.difficulty === 'Medium' 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`}
                  >
                    {exam.difficulty}
                  </span>
                </div>
              </div>
              
              <Button className="w-full">Start Exam</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}