# Task 03: Restructure Components Following Atomic Design

## Description
Reorganize the components in the Exams feature to follow atomic design principles, ensuring components are properly categorized as atoms, molecules, organisms, or templates, and that they follow the single responsibility principle and size limitations.

## Current State Analysis
The components in the Exams feature are currently organized by function (admin, layout, sidebar, etc.) rather than by atomic design principles. Some components may be too large or have multiple responsibilities.

## Implementation Steps

1. **Catalog and categorize all components**
   - Create a complete list of all components in the feature
   - Assign each component to an atomic design category (atom, molecule, organism, template)
   - Identify components that don't fit cleanly into a category

2. **Create atomic design directory structure**
   ```
   /exams/components/
   ├── atoms/         # Basic building blocks (buttons, inputs, etc.)
   ├── molecules/     # Simple component combinations
   ├── organisms/     # Complex, functional component sections
   ├── templates/     # Page layouts specific to exams feature
   └── deprecated/    # Old components pending removal
   ```

3. **Refactor oversized components**
   - Identify components larger than 200 lines
   - Break them down into smaller, focused components
   - Ensure each component has a single responsibility

4. **Organize by atomic design**
   - Move components to their appropriate atomic design directories
   - Update imports as needed
   - Maintain backward compatibility during transition

5. **Implement prop interface standardization**
   - Ensure all components have explicit prop interfaces
   - Limit prop counts to maximum 7-8 per component
   - Use destructuring for related props
   - Add proper TypeScript types and documentation

6. **Review component composition patterns**
   - Identify opportunities to use component composition
   - Replace prop-heavy components with composition patterns
   - Implement context where appropriate for deeply nested components

7. **Document component organization**
   - Create or update component README files
   - Document component hierarchy and relationships
   - Provide usage examples

## Component Classification Guide

### Atoms
- Basic UI elements with no dependencies on other components
- Examples: Button, Input, Checkbox, Label, Icon
- Should be highly reusable and have minimal logic

### Molecules
- Combinations of atoms that form simple UI patterns
- Examples: Form Field (Label + Input), Question Option (Radio + Text)
- May contain simple logic but should remain focused

### Organisms
- Functional sections composed of molecules and atoms
- Examples: QuestionDisplay, ExamControls, ResultsSummary
- May contain business logic and manage local state

### Templates
- Page layouts specific to the exams feature
- Examples: ExamLayout, ResultsLayout, AdminExamLayout
- Define structure but delegate content to organisms

## Example Component Refactoring

### Before
```tsx
// Large component with multiple responsibilities
export const ExamQuestion = ({ question, options, onAnswer, isAnswered, ...props }) => {
  // 100+ lines of code handling display, state, and logic
};
```

### After
```tsx
// Atom
export const QuestionText = ({ text, difficulty }) => (
  <div className={`question-text difficulty-${difficulty}`}>{text}</div>
);

// Molecule
export const QuestionOption = ({ text, id, isSelected, onSelect }) => (
  <div className={`option ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(id)}>
    <RadioButton selected={isSelected} />
    <OptionText>{text}</OptionText>
  </div>
);

// Organism
export const QuestionDisplay = ({ question, onAnswer, isAnswered }) => {
  // Focused logic for displaying and answering a question
  return (
    <div className="question-display">
      <QuestionText text={question.text} difficulty={question.difficulty} />
      <OptionsList>
        {question.options.map(option => (
          <QuestionOption
            key={option.id}
            text={option.text}
            id={option.id}
            isSelected={/* logic */}
            onSelect={onAnswer}
          />
        ))}
      </OptionsList>
    </div>
  );
};
```

## Verification Criteria
- All components categorized according to atomic design principles
- No component exceeds 200 lines of code
- Each component has a single, clear responsibility
- Components have proper prop interfaces with reasonable prop counts
- Updated imports and maintained functionality
- Documentation for component organization

## Time Estimate
Approximately 16-20 hours (this is the largest task)

## Dependencies
- Task 01: Document Current Directory Structure and Identify Gaps

## Risks
- Refactoring could introduce bugs if not done carefully
- Import updates may cause ripple effects across the codebase
- Some components may be difficult to categorize cleanly
- May require updates to tests or documentation
