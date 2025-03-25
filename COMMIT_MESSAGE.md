fix(exams): Fix exam statistics calculation and display

- Fixed the issue where questions were being double-counted in the exam statistics display
- Used the examStatisticsCalculator utility to ensure accurate statistics calculation
- Updated ExamResults component to use the calculated statistics instead of raw API data
- Enhanced useExamScoreCalculation to use the accurate statistics for score calculation
- Maintained backward compatibility by gracefully handling cases where questions or userAnswers are not available

This fix resolves the mathematical impossibility in the statistics display where total counts
could exceed the actual number of questions (e.g., 7 questions showing as: 1 correct + 6 incorrect + 6 unanswered = 13). 
Now each question is properly categorized into exactly one state (correct, incorrect, OR unanswered).

Related to: PHAR-184