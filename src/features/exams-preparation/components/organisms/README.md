# Organisms

This directory contains larger, more complex components that are composed of multiple molecules and/or atoms working together to form a distinct section of the UI.

## What to place here

- Components that form entire sections of the interface
- Complex components that manage significant portions of functionality
- Components that coordinate multiple molecules and atoms

## Examples

- Navigation components (ExamNavigationBar, QuestionNavigation)
- Complex data displays (ExamsTable)
- Dialog components (ExamAlertDialog)
- Progress tracking displays (ExamProgress)
- Interactive question components (ExamQuestion)
- Summary components (ExamSummary)
- Chart/visualization components (PerformanceCharts)
- Score display components (ScoreBreakdown, ScoreOverview)
- Statistics displays (StatisticsDisplay)
- Sidebar components (ExamSidebar, ExamSidebarMenu)
- Feature-specific editors (JsonExamUploader, McqEditor)
- Type management components (PaperTypeManager)
- Multi-step flows (PaymentFlow)
- Forms (ManualPaymentForm)
- Dialog components (PromotionalOfferDialog)
- Filter components (QuestionFilter)
- Modal dialogs (QuestionDialog)

## Guidelines

- Organisms can contain multiple molecules and atoms
- Organisms may manage more complex state
- Organisms can handle more significant business logic
- Organisms can be context-specific rather than generic
- Organisms should not include page-level layout concerns
- Keep organisms under 200 lines of code when possible
- Consider splitting larger organisms into multiple components
