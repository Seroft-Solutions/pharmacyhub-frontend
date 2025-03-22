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
  
  // Add premium tag if the paper is premium
  if (metadata.premium === true || metadata.isPremium === true) {
    tags.push('premium:true');
    // Add fixed price tag of 2000 PKR for premium exams
    tags.push('price:2000');
  }
  
  // Add type-specific tags
  switch (paperType) {
    case PaperType.SUBJECT:
      if (metadata.subject) tags.push(`subject:${metadata.subject}`);
      if (metadata.topic) tags.push(`topic:${metadata.topic}`);
      if (metadata.subtopic) tags.push(`subtopic:${metadata.subtopic}`);
      if (metadata.courseCode) tags.push(`courseCode:${metadata.courseCode}`);
      if (metadata.curriculum) tags.push(`curriculum:${metadata.curriculum}`);
      if (metadata.academicLevel) tags.push(`academicLevel:${metadata.academicLevel}`);
      break;
    case PaperType.PAST:
      if (metadata.year) tags.push(`year:${metadata.year}`);
      if (metadata.institution) tags.push(`institution:${metadata.institution}`);
      if (metadata.examBody) tags.push(`examBody:${metadata.examBody}`);
      if (metadata.paperNumber) tags.push(`paperNumber:${metadata.paperNumber}`);
      if (metadata.season) tags.push(`season:${metadata.season}`);
      if (metadata.countryOrRegion) tags.push(`countryOrRegion:${metadata.countryOrRegion}`);
      if (metadata.month) tags.push(`month:${metadata.month}`);
      break;
    case PaperType.MODEL:
      if (metadata.creator) tags.push(`creator:${metadata.creator}`);
      if (metadata.targetAudience) tags.push(`targetAudience:${metadata.targetAudience}`);
      if (metadata.version) tags.push(`version:${metadata.version}`);
      if (metadata.seriesName) tags.push(`seriesName:${metadata.seriesName}`);
      if (metadata.recommendedPreparation) tags.push(`recommendedPreparation:${metadata.recommendedPreparation}`);
      break;
    case PaperType.PRACTICE:
      if (metadata.focusArea) tags.push(`focusArea:${metadata.focusArea}`);
      if (metadata.skillLevel) tags.push(`skillLevel:${metadata.skillLevel}`);
      if (metadata.learningObjectives) tags.push(`learningObjectives:${metadata.learningObjectives}`);
      if (metadata.prerequisites) tags.push(`prerequisites:${metadata.prerequisites}`);
      if (metadata.estimatedCompletionTime) tags.push(`estimatedCompletionTime:${metadata.estimatedCompletionTime}`);
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
      // Split only on the first colon, as some values might contain colons
      const colonIndex = tag.indexOf(':');
      const key = tag.substring(0, colonIndex);
      const value = tag.substring(colonIndex + 1);
      
      // Handle special case for premium tag
      if (key === 'premium' && value === 'true') {
        metadata.premium = true;
      } 
      // Handle special case for price tag (convert to number)
      else if (key === 'price') {
        metadata.price = parseFloat(value);
      }
      // Handle all other tags normally
      else {
        metadata[key] = value;
      }
    }
  });
  
  return metadata;
}

/**
 * Extract metadata from tags
 * @param tags Array of tags
 * @param paperType Paper type
 * @returns Extracted metadata object
 */
export const extractMetadataFromTags = (tags: string[], paperType: string): Record<string, any> => {
  const metadata: Record<string, any> = {};
  
  // Extract values from tags (using existing tagsToMetadata logic)
  tags.forEach(tag => {
    if (tag.includes(':')) {
      // Split only on the first colon, as some values might contain colons
      const colonIndex = tag.indexOf(':');
      const key = tag.substring(0, colonIndex);
      const value = tag.substring(colonIndex + 1);
      
      // Add to metadata
      metadata[key] = value;
      
      // Handle special case for premium tag
      if (key === 'premium' && value === 'true') {
        metadata.premium = true;
      } 
      // Handle special case for price tag (convert to number)
      else if (key === 'price') {
        metadata.price = parseFloat(value);
      }
    }
  });
  
  // Handle paper type specific fields
  switch (paperType) {
    case PaperType.SUBJECT:
      // Default values if not present
      if (!metadata.academicLevel) {
        metadata.academicLevel = 'Undergraduate';
      }
      break;
    case PaperType.PAST:
      // Default values if not present
      if (!metadata.year) {
        const currentYear = new Date().getFullYear();
        metadata.year = (currentYear - 1).toString();
      }
      break;
    case PaperType.MODEL:
      // Default values if not present
      if (!metadata.creator) {
        metadata.creator = 'PharmacyHub';
      }
      break;
    case PaperType.PRACTICE:
      // Default values if not present
      if (!metadata.skillLevel) {
        metadata.skillLevel = 'Intermediate';
      }
      break;
  }
  
  return metadata;
};