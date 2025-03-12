import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookMarked } from "lucide-react";

export default function PracticeExamsPage() {
  const practiceCategories = [
    {
      id: 1,
      title: 'Timed Exams',
      description: 'Challenge yourself with time-limited tests that simulate real exam conditions.',
      icon: Clock,
      href: '/exam/practice/timed'
    },
    {
      id: 2,
      title: 'Topic-Based Practice',
      description: 'Focus on specific areas with targeted questions to strengthen key knowledge.',
      icon: BookMarked,
      href: '/exam/practice/topics'
    }
  ];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Practice Exams
      </h1>
      
      <p className="text-gray-600 mb-6">
        Boost your exam readiness with our practice exam system. Choose the format that works best for your study style.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceCategories.map((category) => (
          <Link 
            key={category.id} 
            href={category.href}
            className="hover:scale-[1.02] transition-transform"
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <category.icon className="h-8 w-8 text-blue-600" />
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}