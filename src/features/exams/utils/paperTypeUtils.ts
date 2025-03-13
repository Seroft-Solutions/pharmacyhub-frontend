import { ExamPaper, PaperType } from '../types/StandardTypes';

/**
 * Utility functions for paper type management
 */

/**
 * Get the appropriate label for a paper type
 */
export function getPaperTypeLabel(type: string): string {
  switch (type) {
    case PaperType.SUBJECT:
      return 'Subject Paper';
    case PaperType.PAST:
      return 'Past Paper';
    case PaperType.MODEL:
      return 'Model Paper';
    case PaperType.PRACTICE:
      return 'Practice Paper';
    default:
      return 'Unknown Type';
  }
}

/**
 * Get paper-type specific description
 */
export function getPaperTypeDescription(type: string): string {
  switch (type) {
    case PaperType.SUBJECT:
      return 'Subject-specific papers organized by topic and curriculum';
    case PaperType.PAST:
      return 'Previous examination papers from various institutions and years';
    case PaperType.MODEL:
      return 'Example papers created by instructors as learning resources';
    case PaperType.PRACTICE:
      return 'Practice papers designed for skill development and self-assessment';
    default:
      return 'Paper with unspecified type';
  }
}

/**
 * Get recommended fields for a paper type
 */
export function getPaperTypeFields(type: string): string[] {
  switch (type) {
    case PaperType.SUBJECT:
      return ['subject', 'topic', 'subtopic', 'courseCode', 'curriculum', 'academicLevel'];
    case PaperType.PAST:
      return ['year', 'month', 'institution', 'examBody', 'paperNumber', 'season', 'countryOrRegion'];
    case PaperType.MODEL:
      return ['creator', 'targetAudience', 'difficulty', 'version', 'seriesName', 'recommendedPreparation'];
    case PaperType.PRACTICE:
      return ['focusArea', 'skillLevel', 'learningObjectives', 'prerequisites', 'estimatedCompletionTime'];
    default:
      return [];
  }
}

/**
 * Get required fields for a paper type
 */
export function getRequiredFields(type: string): string[] {
  switch (type) {
    case PaperType.SUBJECT:
      return ['subject'];
    case PaperType.PAST:
      return ['year'];
    case PaperType.MODEL:
      return ['creator'];
    case PaperType.PRACTICE:
      return ['focusArea'];
    default:
      return [];
  }
}

/**
 * Filter papers by type
 */
export function filterPapersByType(papers: ExamPaper[], type: string): ExamPaper[] {
  return papers.filter(paper => paper.type === type);
}

/**
 * Get paper type from tags
 */
export function getPaperTypeFromTags(tags: string[]): string {
  const paperTypeValues = Object.values(PaperType);
  const matchedType = tags.find(tag => paperTypeValues.includes(tag as PaperType));
  return matchedType || PaperType.PRACTICE;
}

/**
 * Convert object metadata to tags
 */
export function metadataToTags(metadata: Record<string, any>, paperType: string): string[] {
  const tags = [paperType];
  
  // Add difficulty if present
  if (metadata.difficulty) {
    tags.push(metadata.difficulty);
  }
  
  // Add type-specific tags
  switch (paperType) {
    case PaperType.SUBJECT:
      if (metadata.subject) tags.push(`subject:${metadata.subject}`);
      if (metadata.topic) tags.push(`topic:${metadata.topic}`);
      break;
    case PaperType.PAST:
      if (metadata.year) tags.push(`year:${metadata.year}`);
      if (metadata.institution) tags.push(`institution:${metadata.institution}`);
      break;
    case PaperType.MODEL:
      if (metadata.creator) tags.push(`creator:${metadata.creator}`);
      break;
    case PaperType.PRACTICE:
      if (metadata.focusArea) tags.push(`focusArea:${metadata.focusArea}`);
      if (metadata.skillLevel) tags.push(`skillLevel:${metadata.skillLevel}`);
      break;
  }
  
  return tags;
}

/**
 * Extract metadata from tags
 */
export function tagsToMetadata(tags: string[], paperType: string): Record<string, any> {
  const metadata: Record<string, any> = {};
  
  // Extract values from tags
  tags.forEach(tag => {
    if (tag.includes(':')) {
      const [key, value] = tag.split(':');
      metadata[key] = value;
    }
  });
  
  return metadata;
}