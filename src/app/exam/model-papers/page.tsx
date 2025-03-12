import { SimpleExamsSidebar } from "@/components/dashboard/SimpleExamsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";

export default function ModelPapersPage() {
  const modelPapers = [
    { id: 1, subject: 'Chemistry', difficulty: 'Advanced', status: 'Completed' },
    { id: 2, subject: 'Physics', difficulty: 'Intermediate', status: 'In Progress' },
    { id: 3, subject: 'Biology', difficulty: 'Basic', status: 'Not Started' },
    { id: 4, subject: 'Mathematics', difficulty: 'Advanced', status: 'Completed' },
  ];

  return (
    <div className="flex">
      <SimpleExamsSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Model Papers
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modelPapers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Medal className="h-8 w-8 text-blue-600" />
                <CardTitle>{paper.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <span className={`text-sm font-semibold ${
                    paper.difficulty === 'Advanced' 
                      ? 'text-red-600' 
                      : paper.difficulty === 'Intermediate' 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                  }`}>
                    {paper.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span 
                    className={`text-sm font-semibold ${
                      paper.status === 'Completed' 
                        ? 'text-green-600' 
                        : paper.status === 'In Progress' 
                        ? 'text-yellow-600' 
                        : 'text-gray-500'
                    }`}
                  >
                    {paper.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}