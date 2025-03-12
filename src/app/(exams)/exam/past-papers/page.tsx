import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function PastPapersPage() {
  const pastPapers = [
    { id: 1, subject: 'Chemistry', year: 2023, status: 'Completed' },
    { id: 2, subject: 'Physics', year: 2022, status: 'In Progress' },
    { id: 3, subject: 'Biology', year: 2023, status: 'Not Started' },
    { id: 4, subject: 'Mathematics', year: 2022, status: 'Completed' },
  ];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Past Papers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastPapers.map((paper) => (
          <Card key={paper.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <CardTitle>{paper.subject} - {paper.year}</CardTitle>
            </CardHeader>
            <CardContent>
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
  );
}