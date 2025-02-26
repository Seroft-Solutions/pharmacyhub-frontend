import { ExamPaper, ExamStats } from '../model/types';
import { logger } from '@/shared/lib/logger';
import { adaptBackendExamPaper, BackendExamPaper } from './adapter';

const API_URL = '/api/exams/papers';

export const examPaperService = {
  // Get all model papers
  async getModelPapers(): Promise<ExamPaper[]> {
    try {
      logger.info('Fetching model papers');
      
      const response = await fetch(`${API_URL}/model`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const backendPapers: BackendExamPaper[] = await response.json();
      const papers = backendPapers.map(adaptBackendExamPaper);
      
      return papers;
    } catch (error) {
      logger.error('Failed to fetch model papers', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get all past papers
  async getPastPapers(): Promise<ExamPaper[]> {
    try {
      logger.info('Fetching past papers');
      
      const response = await fetch(`${API_URL}/past`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const backendPapers: BackendExamPaper[] = await response.json();
      const papers = backendPapers.map(adaptBackendExamPaper);
      
      return papers;
    } catch (error) {
      logger.error('Failed to fetch past papers', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get paper by ID
  async getPaperById(id: string): Promise<ExamPaper> {
    try {
      logger.info('Fetching paper by ID', { paperId: id });
      
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const backendPaper: BackendExamPaper = await response.json();
      const paper = adaptBackendExamPaper(backendPaper);
      
      return paper;
    } catch (error) {
      logger.error(`Failed to fetch paper with ID ${id}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get all exam stats
  async getExamStats(): Promise<ExamStats> {
    try {
      logger.info('Fetching exam stats');
      
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      logger.error('Failed to fetch exam stats', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};
