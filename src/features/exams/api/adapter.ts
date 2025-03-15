/**
 * Exam Service Adapter
 * 
 * This module re-exports the examApiService and examStoreAdapter from services
 * to maintain backward compatibility for any code that directly imports from 'adapter.ts'
 */
import { examApiService, examStoreAdapter } from './services';

export { examApiService, examStoreAdapter };
// For backward compatibility with existing code
export { examApiService as examService };
export { examStoreAdapter as examServiceAdapter };
export default examStoreAdapter;
