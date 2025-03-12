/**
 * Sample Exam Data
 * 
 * This module provides sample exam data for testing and development purposes.
 * Use this data to simulate API responses when working in development mode.
 */

import { Exam, Question, ExamAttempt, ExamStatus, AttemptStatus } from '../model/mcqTypes';

/**
 * Sample Questions
 */
export const sampleQuestions: Question[] = [
  {
    id: 1,
    questionNumber: 1,
    text: "Which of the following hormones is primarily responsible for controlling blood glucose levels?",
    options: [
      { id: "a", text: "Estrogen" },
      { id: "b", text: "Insulin" },
      { id: "c", text: "Melatonin" },
      { id: "d", text: "Adrenaline" }
    ],
    explanation: "Insulin is a hormone produced by the pancreas that regulates blood glucose levels by promoting the uptake of glucose into cells, reducing blood glucose levels.",
    marks: 1
  },
  {
    id: 2,
    questionNumber: 2,
    text: "Which of the following medications is a beta-blocker commonly used to treat hypertension?",
    options: [
      { id: "a", text: "Lisinopril" },
      { id: "b", text: "Metformin" },
      { id: "c", text: "Metoprolol" },
      { id: "d", text: "Atorvastatin" }
    ],
    explanation: "Metoprolol is a beta-blocker that works by blocking the action of certain natural chemicals in your body, such as epinephrine, on the heart and blood vessels. This effect lowers heart rate, blood pressure, and strain on the heart.",
    marks: 1
  },
  {
    id: 3,
    questionNumber: 3,
    text: "What is the main active ingredient in most hand sanitizers that kills bacteria?",
    options: [
      { id: "a", text: "Benzalkonium chloride" },
      { id: "b", text: "Alcohol (ethanol or isopropanol)" },
      { id: "c", text: "Hydrogen peroxide" },
      { id: "d", text: "Chlorhexidine" }
    ],
    explanation: "Most hand sanitizers contain alcohol (either ethanol or isopropanol) as the main active ingredient, typically at concentrations of 60-95%. Alcohol effectively kills bacteria by denaturing their proteins and dissolving their lipid membranes.",
    marks: 1
  },
  {
    id: 4,
    questionNumber: 4,
    text: "Which medication class would be most appropriate for a patient with both hypertension and diabetes?",
    options: [
      { id: "a", text: "Non-selective beta-blockers" },
      { id: "b", text: "Thiazide diuretics at high doses" },
      { id: "c", text: "ACE inhibitors" },
      { id: "d", text: "Calcium channel blockers" }
    ],
    explanation: "ACE inhibitors are often preferred for patients with both hypertension and diabetes because they not only lower blood pressure but also provide kidney protection, which is especially important for diabetic patients who are at risk for diabetic nephropathy.",
    marks: 1
  },
  {
    id: 5,
    questionNumber: 5,
    text: "Which of the following is NOT a common side effect of opioid analgesics?",
    options: [
      { id: "a", text: "Constipation" },
      { id: "b", text: "Respiratory depression" },
      { id: "c", text: "Nausea" },
      { id: "d", text: "Hypertension" }
    ],
    explanation: "Hypertension (high blood pressure) is not a common side effect of opioid analgesics. In fact, opioids are more likely to cause hypotension (low blood pressure) than hypertension. Common side effects of opioids include constipation, respiratory depression, nausea, sedation, and physical dependence.",
    marks: 1
  },
  {
    id: 6,
    questionNumber: 6,
    text: "Which of the following antibiotics is associated with tendon rupture as a side effect?",
    options: [
      { id: "a", text: "Amoxicillin" },
      { id: "b", text: "Ciprofloxacin" },
      { id: "c", text: "Erythromycin" },
      { id: "d", text: "Azithromycin" }
    ],
    explanation: "Ciprofloxacin, which belongs to the fluoroquinolone class of antibiotics, has been associated with an increased risk of tendon rupture, particularly the Achilles tendon. The FDA has issued a black box warning about this serious side effect for all fluoroquinolone antibiotics.",
    marks: 1
  },
  {
    id: 7,
    questionNumber: 7,
    text: "What is the mechanism of action of statins in treating hypercholesterolemia?",
    options: [
      { id: "a", text: "Inhibit the reabsorption of bile acids in the intestine" },
      { id: "b", text: "Block the absorption of dietary cholesterol" },
      { id: "c", text: "Inhibit HMG-CoA reductase enzyme" },
      { id: "d", text: "Increase the excretion of LDL cholesterol" }
    ],
    explanation: "Statins work by inhibiting the enzyme HMG-CoA reductase, which plays a central role in the production of cholesterol in the liver. By reducing the liver's production of cholesterol, statins help lower blood levels of LDL ('bad') cholesterol and total cholesterol.",
    marks: 1
  },
  {
    id: 8,
    questionNumber: 8,
    text: "A patient taking warfarin should be cautioned about consuming large amounts of foods rich in vitamin K because:",
    options: [
      { id: "a", text: "Vitamin K can enhance the anticoagulant effect of warfarin" },
      { id: "b", text: "Vitamin K can antagonize the anticoagulant effect of warfarin" },
      { id: "c", text: "Vitamin K can increase the risk of bleeding when combined with warfarin" },
      { id: "d", text: "Vitamin K can cause warfarin to be excreted more quickly" }
    ],
    explanation: "Vitamin K is an essential cofactor for the production of clotting factors, and warfarin works by antagonizing vitamin K. Therefore, consuming large amounts of vitamin K can counteract the anticoagulant effect of warfarin, potentially reducing its efficacy and increasing the risk of clot formation.",
    marks: 1
  },
  {
    id: 9,
    questionNumber: 9,
    text: "Which of the following is the most common cause of medication non-adherence in elderly patients?",
    options: [
      { id: "a", text: "Cost of medications" },
      { id: "b", text: "Complexity of medication regimens" },
      { id: "c", text: "Lack of transportation to pharmacy" },
      { id: "d", text: "Mistrust of healthcare providers" }
    ],
    explanation: "The complexity of medication regimens is often cited as the most common cause of medication non-adherence in elderly patients. Elderly patients frequently take multiple medications for various conditions, and keeping track of different dosing schedules and instructions can be challenging, leading to unintentional non-adherence.",
    marks: 1
  },
  {
    id: 10,
    questionNumber: 10,
    text: "Which of the following medications should be dispensed with auxiliary labels warning about photosensitivity?",
    options: [
      { id: "a", text: "Metformin" },
      { id: "b", text: "Doxycycline" },
      { id: "c", text: "Lisinopril" },
      { id: "d", text: "Metoprolol" }
    ],
    explanation: "Doxycycline, a tetracycline antibiotic, can cause photosensitivity reactions. Patients taking doxycycline should be advised to avoid excessive sun exposure, wear protective clothing, and use sunscreen to prevent potentially severe sunburn reactions.",
    marks: 1
  }
];

/**
 * Sample Exams
 */
export const sampleExams: Exam[] = [
  {
    id: 1,
    title: "Basic Pharmacology Exam",
    description: "Test your knowledge of basic pharmacology concepts and medications.",
    duration: 30, // 30 minutes
    totalMarks: 10,
    passingMarks: 6,
    status: ExamStatus.PUBLISHED,
    questions: sampleQuestions
  },
  {
    id: 2,
    title: "Advanced Clinical Pharmacy",
    description: "An advanced examination covering clinical pharmacy practices and therapeutic management.",
    duration: 60, // 60 minutes
    totalMarks: 20,
    passingMarks: 14,
    status: ExamStatus.PUBLISHED
  },
  {
    id: 3,
    title: "Pharmaceutical Calculations",
    description: "Practice exam for pharmaceutical calculations and dosing formulas.",
    duration: 45, // 45 minutes
    totalMarks: 15,
    passingMarks: 10,
    status: ExamStatus.PUBLISHED
  },
  {
    id: 4,
    title: "Drug Interactions and Side Effects",
    description: "Test your knowledge of common drug interactions and side effects.",
    duration: 40, // 40 minutes
    totalMarks: 20,
    passingMarks: 14,
    status: ExamStatus.DRAFT
  }
];

/**
 * Sample Exam Attempts
 */
export const sampleAttempts: ExamAttempt[] = [
  {
    id: 1,
    examId: 1,
    userId: "user123",
    startTime: new Date(new Date().getTime() - 120 * 60000).toISOString(), // 2 hours ago
    endTime: new Date(new Date().getTime() - 90 * 60000).toISOString(), // 1.5 hours ago
    status: AttemptStatus.COMPLETED,
    answers: [
      { questionId: 1, selectedOption: 1 },
      { questionId: 2, selectedOption: 2 },
      { questionId: 3, selectedOption: 1 },
      { questionId: 4, selectedOption: 2 },
      { questionId: 5, selectedOption: 3 }
    ]
  },
  {
    id: 2,
    examId: 2,
    userId: "user123",
    startTime: new Date(new Date().getTime() - 60 * 60000).toISOString(), // 1 hour ago
    status: AttemptStatus.IN_PROGRESS
  }
];

/**
 * Get a sample exam by ID
 */
export function getSampleExam(id: number): Exam | undefined {
  return sampleExams.find(exam => exam.id === id);
}

/**
 * Get exam questions by exam ID
 */
export function getSampleExamQuestions(examId: number): Question[] {
  const exam = getSampleExam(examId);
  if (exam?.questions) {
    return exam.questions;
  }
  // Return sample questions if the exam doesn't have specific questions
  return sampleQuestions;
}

/**
 * Get a sample attempt by ID
 */
export function getSampleAttempt(id: number): ExamAttempt | undefined {
  return sampleAttempts.find(attempt => attempt.id === id);
}

/**
 * Get sample attempts by user ID
 */
export function getSampleUserAttempts(userId: string): ExamAttempt[] {
  return sampleAttempts.filter(attempt => attempt.userId === userId);
}
