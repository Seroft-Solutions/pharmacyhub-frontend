import { ExamLanding } from '@/features/exams/ui/ExamLanding';
import { examService } from '@/features/exams/api/examService';

export default async function ExamPage() {
    // Fetch papers
    const [modelPapers, pastPapers] = await Promise.all([
        examService.listPapers('model'),
        examService.listPapers('past')
    ]);

    return (
        <ExamLanding
            modelPapers={modelPapers}
            pastPapers={pastPapers}
            userProgress={{
                completedPapers: [], // This should come from user context/API
                premiumAccess: false // This should come from user context/API
            }}
        />
    );
}