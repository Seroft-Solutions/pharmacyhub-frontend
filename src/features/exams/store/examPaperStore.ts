import { create } from 'zustand';
import { examPaperService } from '../api/examPaperService';
import { ExamPaper, ExamStats } from '../model/types';
import { logger } from '@/shared/lib/logger';

interface ExamPaperState {
  // State
  modelPapers: ExamPaper[];
  pastPapers: ExamPaper[];
  stats: ExamStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchModelPapers: () => Promise<void>;
  fetchPastPapers: () => Promise<void>;
  fetchAllPapers: () => Promise<void>;
  fetchExamStats: () => Promise<void>;
  fetchPaperById: (id: string) => Promise<ExamPaper | null>;
}

export const useExamPaperStore = create<ExamPaperState>((set, get) => ({
  modelPapers: [],
  pastPapers: [],
  stats: null,
  isLoading: false,
  error: null,
  
  fetchModelPapers: async () => {
    try {
      set({ isLoading: true, error: null });
      const papers = await examPaperService.getModelPapers();
      set({ modelPapers: papers, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch model papers', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch model papers' 
      });
    }
  },
  
  fetchPastPapers: async () => {
    try {
      set({ isLoading: true, error: null });
      const papers = await examPaperService.getPastPapers();
      set({ pastPapers: papers, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch past papers', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch past papers' 
      });
    }
  },
  
  fetchAllPapers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Run both requests in parallel
      const [modelPapers, pastPapers] = await Promise.all([
        examPaperService.getModelPapers(),
        examPaperService.getPastPapers()
      ]);
      
      set({ 
        modelPapers, 
        pastPapers, 
        isLoading: false 
      });
    } catch (error) {
      logger.error('Failed to fetch all papers', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch exam papers' 
      });
    }
  },
  
  fetchExamStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const stats = await examPaperService.getExamStats();
      set({ stats, isLoading: false });
    } catch (error) {
      logger.error('Failed to fetch exam stats', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch exam stats' 
      });
    }
  },
  
  fetchPaperById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      // First check if we already have this paper in our state
      const { modelPapers, pastPapers } = get();
      let paper = [...modelPapers, ...pastPapers].find(p => p.id === id);
      
      if (!paper) {
        // If not found in state, fetch from API
        paper = await examPaperService.getPaperById(id);
      }
      
      set({ isLoading: false });
      return paper;
    } catch (error) {
      logger.error(`Failed to fetch paper with ID ${id}`, { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : `Failed to fetch paper ${id}` 
      });
      return null;
    }
  }
}));
