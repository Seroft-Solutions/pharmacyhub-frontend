# Next.js 15 Routing Structure for Exams Feature

This document outlines the plan for implementing a modern, clean routing structure for the Exams feature using Next.js 15 App Router with route groups and dynamic routes (slugs).

## Current Structure Analysis

Currently, the routing for the Exams feature may be using older Next.js pages router or an initial implementation of App Router without taking full advantage of route groups, layouts, and other modern routing features.

## Target Structure

We'll implement a clean, organized routing structure using Next.js 15 App Router with route groups:

```
/src/app
  /(exams)                    # Route group for exams (doesn't affect URL)
    /layout.tsx               # Shared layout for all exam routes
    /page.tsx                 # Index page (/exams)
    
    /admin                    # Admin section
      /layout.tsx             # Admin-specific layout
      /page.tsx               # Admin dashboard (/exams/admin)
      /create
        /page.tsx             # Create exam page (/exams/admin/create)
      /[examId]
        /page.tsx             # Edit exam page (/exams/admin/[examId])
        /questions
          /page.tsx           # Question management (/exams/admin/[examId]/questions)
          /create
            /page.tsx         # Create question (/exams/admin/[examId]/questions/create)
          /[questionId]
            /page.tsx         # Edit question (/exams/admin/[examId]/questions/[questionId])
      /results
        /page.tsx             # All results (/exams/admin/results)
        /[examId]
          /page.tsx           # Results for specific exam (/exams/admin/results/[examId])
    
    /dashboard
      /page.tsx               # Student dashboard (/exams/dashboard)
    
    /[examId]                 # Dynamic route for specific exam
      /layout.tsx             # Exam-specific layout
      /page.tsx               # Exam details page (/exams/[examId])
      /attempt
        /page.tsx             # Take exam page (/exams/[examId]/attempt)
      /results
        /page.tsx             # Exam results page (/exams/[examId]/results)
        /[attemptId]
          /page.tsx           # Specific attempt results (/exams/[examId]/results/[attemptId])
```

## Implementation Plan

### 1. Create Basic Route Group Structure
- Create the `(exams)` route group folder
- Implement basic layouts and page components
- Set up shared navigation components

### 2. Implement Dynamic Routes
- Create slug-based routes for exam IDs and question IDs
- Set up proper params handling
- Implement data fetching using params

### 3. Design Layout Hierarchy
- Create nested layouts for different sections
- Implement loading and error states
- Set up shared UI elements across routes

### 4. Connect with Feature Components
- Integrate with restructured components from the main plan
- Ensure proper data fetching and state management
- Implement SEO and metadata handling

### 5. Optimize Navigation
- Implement proper linking and navigation
- Use shallow routing where appropriate
- Set up prefetching strategies

### 6. Add Advanced Features
- Implement parallel routes where needed
- Add intercepting routes for modal patterns
- Set up proper page metadata

## Task Breakdown

| Task ID | Task Description | Time Estimate |
|---------|-----------------|--------------|
| R01 | Create basic route group structure | 4-6 hours |
| R02 | Implement student/user exam routes | 6-8 hours |
| R03 | Implement admin exam routes | 8-10 hours |
| R04 | Set up layout hierarchy | 4-6 hours |
| R05 | Implement loading and error states | 3-4 hours |
| R06 | Connect with feature components | 8-10 hours |
| R07 | Optimize data fetching | 6-8 hours |
| R08 | Implement metadata and SEO | 3-4 hours |
| R09 | Set up advanced routing patterns | 6-8 hours |
| R10 | Testing and validation | 6-8 hours |

## Implementation Timeline
- Phase 1 (Tasks R01-R02): Basic Structure - Days 1-3
- Phase 2 (Tasks R03-R05): Admin Routes and Layouts - Days 4-6
- Phase 3 (Tasks R06-R07): Component Integration - Days 7-9
- Phase 4 (Tasks R08-R10): Advanced Features and Testing - Days 10-12
