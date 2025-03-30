# Molecules

This directory contains components that are composed of multiple atoms or other primitive elements that work together as a unit.

## What to place here

- Components that combine multiple atoms to form more complex UI elements
- Components with more specific functionality
- Components that have a clear, focused purpose but are not entire sections of a page

## Examples

- Metadata displays (ExamMetadata)
- Timer components (ExamTimer)
- Cards with content (ExamPaperCard)
- Tab navigation components (ExamsTabs)
- Search inputs with functionality (ExamsSearch)
- Headers with additional information (HeaderTimeRemaining)
- Card components (SubjectCard)
- Question display cards (QuestionCard, McqQuestionCard)
- Form field groups (PaperMetadataFields)
- Editor components for specific data (PaperPriceEditor)
- Action bars (ExamActionBar)
- Header bars (ExamHeaderBar)

## Guidelines

- Molecules should combine multiple atoms into a meaningful unit
- Keep molecules focused on a specific piece of UI functionality
- Molecules can have their own state for UI purposes
- Molecules can use core components and atoms, but should not depend on organisms or templates
- Keep molecules under 150 lines of code where possible
