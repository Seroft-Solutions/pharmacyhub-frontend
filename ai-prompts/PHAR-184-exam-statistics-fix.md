# PHAR-184: Fix Exam Statistics Calculation and Display

## Problem Summary
The exam system was incorrectly categorizing questions, resulting in mathematical impossibilities in the statistics display:
- Questions were being double-counted - a single question could appear as both "incorrect" AND "unanswered"
- This caused statistics to show impossible totals (e.g., 7 questions showing as: 1 correct + 6 incorrect + 6 unanswered = 13)
- Negative marking calculation (-0.25 per wrong answer) was incorrectly being applied to some questions

## Root Cause
- Missing validation to ensure each question was counted in exactly one category
- No clear distinction between "answered incorrectly" (user selected wrong option) vs "unanswered" (user made no selection) 
- Statistics calculation lacked proper accounting of question states

## Implementation Details
1. **Created QuestionStatus enum**
   - Implemented `QuestionStatus` enum with UNANSWERED, ANSWERED_CORRECT, ANSWERED_INCORRECT, and ANSWERED_PENDING states
   - This ensures each question can only be in one state at a time

2. **Created a dedicated statistics calculator**
   - Implemented `examStatisticsCalculator.ts` utility that properly categorizes each question
   - Added validation to ensure question counts always add up to the total
   - Fixed negative marking calculation to only apply to actively answered incorrect questions

3. **Enhanced UI Components**
   - Decomposed the ExamResults component into smaller components (ScoreOverview, StatisticsDisplay, ScoreBreakdown)
   - Added clear visual distinction between different question categories
   - Implemented a new QuestionFilter component for filtering questions by their status
   - Added detailed scoring breakdown showing the exact calculation

4. **Improved store and data flow**
   - Enhanced the mcqExamStore to properly track question states
   - Added validation in multiple places to ensure data consistency
   - Improved error handling and logging throughout the codebase
   - Maintained backward compatibility with existing API exports

## Testing Performed
- Verified statistics add up correctly for various combinations of correct/incorrect/unanswered questions
- Confirmed negative marking only applies to actively answered incorrect questions
- Tested the filtering functionality for different question categories
- Verified the scoring breakdown displays the correct calculation

## Impact
- Users now see mathematically accurate statistics
- The scoring system is transparent and easy to understand
- The review experience is enhanced with filtering options
- The code is more maintainable with proper validation and error handling

## Additional Changes
- Fixed inconsistency in examStatisticsCalculator.ts where it had a different implementation of calculateExamScore than the main utility
- Removed the duplicate function and imported the standardized implementation from calculateExamScore.ts
- This ensures consistency across the codebase and prevents potential bugs
