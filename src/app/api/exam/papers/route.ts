import { NextResponse } from 'next/server';
import { MCQPaper } from '@/features/exams/model/types';
const mockModelPapers: MCQPaper[] = [
    {
        id: "model-1",
        metadata: {
            format_version: "2.0",
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            topics_covered: [
                "pharmacology",
                "clinical_pharmacy",
                "pharmaceutical_chemistry"
            ],
            tags: ["pharmacy", "mcq", "practice"],
            difficulty: "medium",
            source: "Pharmacy MCQ Bank",
            author: "PharmacyHub"
        },
        content: {
            title: "Pharmacy Practice Model Paper 1",
            description: "Basic concepts and commonly tested topics",
            time_limit: 60,
            total_questions: 50,
            passing_criteria: {
                minimum_questions: 30,
                passing_score: 60
            },
            sections: [
                {
                    id: "sec-1",
                    title: "Drug Laws and Regulations",
                    questions: [
                        {
                            id: "MCQ_001",
                            metadata: {
                                created_at: new Date().toISOString(),
                                last_updated: new Date().toISOString(),
                                difficulty: "medium",
                                estimated_time: 3,
                                topics: {
                                    primary: "pharmacology",
                                    secondary: "clinical_pharmacy"
                                }
                            },
                            content: {
                                question_text: "\"Spurious drug\" means a drug that:",
                                question_type: "single_choice",
                                options: {
                                    "A": "Purports to be a drug but does not contain the active ingredient",
                                    "B": "Purports to be the product of a manufacturer, place, or country of which it is not truly a product",
                                    "C": "Is imported or exported for sale under a particular name while actually being another drug",
                                    "D": "All of the above"
                                },
                                correct_answer: "D",
                                explanation: {
                                    detailed: "A spurious drug includes those that lack the claimed active ingredient, falsely claim a different origin, or are misrepresented for sale. Each statement (A, B, and C) contributes to the legal definition of a spurious drug.",
                                    key_points: [],
                                    references: []
                                }
                            },
                            statistics: {
                                attempts: 0,
                                success_rate: 0,
                                average_time: 0,
                                difficulty_rating: 0,
                                discrimination_index: 0
                            }
                        }
                    ]
                }
            ]
        }
    }
];

const mockPastPapers: MCQPaper[] = [
    {
        id: "past-2023",
        metadata: {
            format_version: "2.0",
            created_at: "2023-12-01T00:00:00Z",
            last_updated: "2023-12-01T00:00:00Z",
            topics_covered: [
                "pharmacology",
                "clinical_pharmacy",
                "pharmaceutical_chemistry"
            ],
            tags: ["exam", "board", "2023"],
            difficulty: "hard",
            source: "Board Examination 2023",
            author: "Pharmacy Board"
        },
        content: {
            title: "2023 Board Exam Paper",
            description: "Official examination paper from 2023",
            time_limit: 60,
            total_questions: 50,
            passing_criteria: {
                minimum_questions: 35,
                passing_score: 70
            },
            sections: [
                {
                    id: "sec-1",
                    title: "Clinical Pharmacy",
                    questions: [
                        {
                            id: "MCQ_001",
                            metadata: {
                                created_at: "2023-12-01T00:00:00Z",
                                last_updated: "2023-12-01T00:00:00Z",
                                difficulty: "medium",
                                estimated_time: 3,
                                topics: {
                                    primary: "clinical_pharmacy",
                                    secondary: "pharmacology"
                                }
                            },
                            content: {
                                question_text: "Which beta-blocker is most selective for β1 receptors?",
                                question_type: "single_choice",
                                options: {
                                    "A": "Propranolol",
                                    "B": "Metoprolol",
                                    "C": "Bisoprolol",
                                    "D": "Carvedilol"
                                },
                                correct_answer: "C",
                                explanation: {
                                    detailed: "Bisoprolol is the most β1-selective beta-blocker, making it ideal for patients with asthma or peripheral vascular disease where β2 blockade is undesirable.",
                                    key_points: [],
                                    references: []
                                }
                            },
                            statistics: {
                                attempts: 0,
                                success_rate: 0,
                                average_time: 0,
                                difficulty_rating: 0,
                                discrimination_index: 0
                            }
                        }
                    ]
                }
            ]
        }
    }
];

function getMCQsFromFile(): Promise<MCQPaper[]> {
    return Promise.resolve(mockModelPapers);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || (type !== 'model' && type !== 'past')) {
        return NextResponse.json(
            { error: 'Invalid paper type' },
            { status: 400 }
        );
    }

    try {
        const papers = type === 'model' 
            ? await getMCQsFromFile() 
            : mockPastPapers;
    
        return NextResponse.json(papers);
    } catch (error) {
        console.error('Error handling papers request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
