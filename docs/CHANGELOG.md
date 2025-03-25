# Changelog

All notable changes to the PharmacyHub Frontend project will be documented in this file.

## [Unreleased]

### Fixed
- **Exam Statistics Calculation**: Fixed issue where questions were being double-counted in exam statistics, leading to mathematically impossible totals. Questions are now properly categorized into exactly one state (correct, incorrect, or unanswered). Related to PHAR-184.
- **Negative Marking Calculation**: Fixed negative marking calculation to only apply to actively answered incorrect questions. Unanswered questions now correctly receive 0 marks with no penalty.
- **Statistics Display**: Improved the display of exam statistics with clear visual distinction between different question categories.
- **Implementation Consistency**: Removed duplicate `calculateExamScore` function in examStatisticsCalculator.ts to ensure consistent score calculation across the codebase.
- **Question State Tracking**: Enhanced question state tracking with proper QuestionStatus enum.

### Added
- **QuestionFilter Component**: Added new component to filter questions by their status (correct, incorrect, unanswered).
- **Score Breakdown Component**: Added detailed breakdown of score calculation with negative marking.
- **UI Validation**: Added validation to ensure question counts always add up to the total.
- **Test Coverage**: Added unit tests for examStatisticsCalculator.ts to verify correct statistics calculation.

## [1.0.0] - 2023-01-01

### Added
- Initial release of the PharmacyHub Frontend application.
