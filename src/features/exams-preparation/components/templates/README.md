# Templates

This directory contains layout components that define the structure of pages or major sections of the UI. Templates arrange organisms and provide context for how components should be displayed.

## What to place here

- Page-level layouts
- Screen templates that define the overall structure
- Content arrangements that can be reused across multiple screens

## Examples

- Feature root layouts (ExamFeatureRoot)
- General exam layouts (ExamLayout)
- Specific exam type layouts (McqExamLayout)
- List pages (ExamsList, McqExamList)
- Dashboard layouts (ExamDashboard)
- Landing pages (ExamLanding)
- Start screens (ExamStartScreen)
- Results pages (ExamResults, ExamResultsCompact)
- Review pages (ExamReview, ReviewMode)
- Container layouts (ExamContainer)
- Results views (ResultsView)

## Guidelines

- Templates should focus on layout and structure, not specific content
- Templates arrange organisms and provide context for their display
- Templates can receive content through props or children
- Templates can handle responsive layout concerns
- Templates may include routing or navigation logic
- Keep templates focused on structure rather than detailed functionality
- Consider breaking very large templates into smaller, focused templates
