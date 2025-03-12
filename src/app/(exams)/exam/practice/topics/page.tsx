import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopicExamsPage() {
  const topicExams = [
    { id: 1, title: 'Pharmacokinetics', questions: 25, level: 'Advanced' },
    { id: 2, title: 'Drug Classifications', questions: 35, level: 'Intermediate' },
    { id: 3, title: 'Medicinal Chemistry', questions: 20, level: 'Beginner' },
    { id: 4, title: 'Clinical Pharmacy', questions: 30, level: 'Advanced' },
  ];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Topic-Based Practice
      </h1>
      
      <p className="text-gray-600 mb-6">
        Focus your study efforts on specific topics to strengthen key knowledge areas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topicExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <BookMarked className="h-8 w-8 text-blue-600" />
              <CardTitle>{exam.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Questions:</span>
                  <span className="text-sm font-semibold">{exam.questions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Level:</span>
                  <span 
                    className={`text-sm font-semibold ${
                      exam.level === 'Advanced' 
                        ? 'text-red-600' 
                        : exam.level === 'Intermediate' 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`}
                  >
                    {exam.level}
                  </span>
                </div>
              </div>
              
              <Button className="w-full">Start Practice</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}