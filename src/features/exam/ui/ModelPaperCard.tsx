import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExamPaper } from '../model/types'

interface ModelPaperCardProps {
  paper: ExamPaper
  onStart: (paperId: string) => void
  className?: string
}

export const ModelPaperCard = ({ paper, onStart, className }: ModelPaperCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={`transition-all hover:shadow-lg ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{paper.title}</CardTitle>
            <CardDescription>{paper.description}</CardDescription>
          </div>
          <Badge 
            variant="secondary" 
            className={getDifficultyColor(paper.difficulty)}
          >
            {paper.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-muted-foreground">Questions</p>
              <p className="font-medium">{paper.questionCount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Time Limit</p>
              <p className="font-medium">{paper.timeLimit} mins</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Success Rate</p>
              <p className="font-medium">{paper.successRate}%</p>
            </div>
          </div>
          <Button 
            className="w-full"
            onClick={() => onStart(paper.id)}
          >
            Start Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
