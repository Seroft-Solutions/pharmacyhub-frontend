# Online MCQ Practice Platform Specification

## Overview

The Online MCQ Practice Platform is a comprehensive system for pharmacy students to practice multiple-choice questions through past papers and model papers.

## Key Features

### 1. Landing Page Structure
- Two primary sections:
  - Past Papers
  - Model Papers
- Directory-based navigation for each section
- Authentication-gated access
- Unauthorized users redirected to login/signup

### 2. User Authentication

#### Login System
- Required fields:
  - Email address
  - Password
- Additional features:
  - Password recovery option
  - Sign-up redirect link

#### Registration System
- Required fields:
  - Full Name
  - Email address
  - Password with confirmation
- Registration completion button

### 3. Model Papers Implementation

#### Paper Format
- 100 MCQs per paper
- Each question includes:
  - Question number
  - Question text
  - 4 answer options
- Interactive features:
  - Selected options highlight (light blue)
  - Minimum attempt requirement (25 MCQs)
  - Warning system for insufficient attempts

#### Submission Process
1. Submit button with help icon ('?')
2. Confirmation dialog
3. Results viewing options:
   - Complete paper review
   - Review of attempted questions only

#### Results Display System
- Color-coded answer marking:
  - Correct answers: Green
  - Incorrect answers: Red
- Scoring methodology:
  - Correct answer: +1 point
  - Incorrect answer: -0.25 points
  - Unattempted: 0 points

#### Timer System
- Duration: 70 minutes
- Pre-start instruction page displaying:
  - Time limit information
  - Scoring system rules
  - Start confirmation mechanism

### 4. Past Papers System
- Free access to 2018 paper
- Premium access required for other years
- Features:
  - Immediate results
  - Answer explanations
  - Consistent format with model papers

### 5. Access Control and Pricing Structure

#### Model Papers Access
- Free tier:
  - Two papers accessible without payment
- Premium tier:
  - Additional papers require payment

#### Past Papers Access
- Free content:
  - 2018 paper
- Premium content:
  - Papers from other years
- Access model:
  - Single payment for complete access

#### Payment Integration
- Visual indicators:
  - Lock icons for premium content
- User flow:
  - Payment prompt for locked content
  - Immediate access post-payment

## Technical Considerations

### Performance Optimization
- Implement lazy loading for MCQ content
- Cache user progress and results
- Optimize answer submission process

### Security Measures
- Secure authentication flow
- Protected premium content routes
- Safe payment processing

### User Experience
- Responsive design for all devices
- Clear navigation between papers
- Intuitive MCQ selection interface
- Real-time progress tracking

## Data Structure

The platform uses a structured JSON format for managing MCQ content. This includes comprehensive metadata, versioning, and analytics support. For detailed specifications of the data model, including schema definitions and implementation guidelines, see the [MCQ Data Model Documentation](./mcq-data-model.md).

The data model is designed to support:
- Organized content with sections and topics
- Enhanced features like difficulty levels and tags
- Performance optimization through efficient data structure
- Analytics and statistics tracking


## Implementation Phases

1. Core Platform Development
   - Authentication system
   - Basic MCQ interface
   - Timer functionality

2. Content Integration
   - Past papers upload
   - Model papers creation
   - Answer key integration

3. Premium Features
   - Payment system integration
   - Access control implementation
   - Premium content management

4. Enhancement Phase
   - Performance optimization
   - User feedback integration
   - Analytics implementation