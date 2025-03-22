// Main exports for the payments feature

// Export components
export { PaymentModal } from './components/PaymentModal';
export { PaymentHistory } from './components/PaymentHistory';
export { PremiumExamCard } from './components/PremiumExamCard';
export { PaperPricingManager } from './components/PaperPricingManager';
export { ExamPurchaseFlow } from './components/ExamPurchaseFlow';

// Export hooks
export { usePremiumExam } from './hooks/usePremiumExam';

// Export premium features ("pay once, access all")
export { 
  usePremiumStatus,
  useUniversalAccessCheck,
  useExamAccessCheck,
  premiumAccessHooks
} from './premium';

// Export types
export * from './types';
