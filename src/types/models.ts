/**
 * @fileoverview Defines the core data models for the INTEMASS application.
 * These interfaces are used for type-safety with Firestore and throughout the application.
 */

/**
 * Represents a question created by a teacher.
 */
export interface Question {
  /** The unique identifier for the question. */
  id: string;
  /** The text or prompt for the question. */
  title: string;
  /** The subject area of the question (e.g., "Business Studies", "Chemistry"). */
  subject: string;
  /** The curriculum the question belongs to (e.g., "CBSE", "Cambridge O-Level", "IB"). */
  curriculum: string;
  /** The total possible score for the question. */
  maxPoints: number;
  /** The timestamp when the question was created. */
  createdAt: Date;
  /** The timestamp when the question was last updated. */
  updatedAt: Date;
}

/**
 * A sub-model of StandardAnswer, representing a single gradable point.
 */
export interface SentencePoint {
  /** A unique identifier for the point (e.g., "P1", "P2a"). */
  pointNumber: string;
  /** The actual text of the sentence or point. */
  text: string;
  /** Keywords extracted from the sentence, often using TF-IDF, for matching. */
  keywords: string[];
  /** The importance of this point, as a value from 0 to 1. */
  weight: number;
  /** Terms that must be present in a student's answer to match this point. */
  requiredTerms: string[];
}

/**
 * Represents the ideal or standard answer for a question, broken down into points.
 */
export interface StandardAnswer {
  /** The unique identifier for the standard answer. */
  id: string;
  /** A foreign key linking to the Question. */
  questionId: string;
  /** The complete, full text of the standard answer. */
  fullText: string;
  /** An array of SentencePoint objects that make up the answer. */
  sentenceList: SentencePoint[];
  /** A list of globally important keywords for the entire answer. */
  keywords: string[];
  /** A map of key concepts and their relative importance. */
  conceptMap: { concept: string; weight: number }[];
}

/**
 * A sub-model of MarkingScheme, defining a single rule for awarding marks.
 */
export interface MarkingRule {
  /** A unique identifier for the rule. */
  ruleId: string;
  /** The condition for this rule to apply (e.g., "all", "any", "P1 and P2"). */
  condition: string;
  /** The point numbers that this rule applies to. */
  points: string[];
  /** The number of marks to award if the condition is met. */
  marksAwarded: number;
  /** A human-readable explanation of the rule. */
  description: string;
}

/**
 * Defines the marking scheme and rules for grading a question.
 */
export interface MarkingScheme {
  /** The unique identifier for the marking scheme. */
  id: string;
  /** A foreign key linking to the Question. */
  questionId: string;
  /** An array of rules for awarding marks. */
  rules: MarkingRule[];
  /** The total number of marks available for the question. */
  totalMarks: number;
  /** The percentage or absolute score required to pass. */
  passingThreshold: number;
}

/**
 * Represents a student's submitted answer to a question.
 */
export interface StudentAnswer {
  /** The unique identifier for the student's answer. */
  id: string;
  /** A foreign key linking to the Question. */
  questionId: string;
  /** The name of the student (for prototype purposes). */
  studentName: string;
  /** The text of the student's submitted essay. */
  answerText: string;
  /** The timestamp when the answer was submitted. */
  submittedAt: Date;
  /** The current status of the grading process. */
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
}

/**
 * A sub-model of GradingResult, detailing a single matched point.
 */
export interface MatchedPoint {
  /** The point number from the standard answer that was matched (e.g., "P1"). */
  pointNumber: string;
  /** The text of the point from the standard answer. */
  standardText: string;
  /** The portion of the student's answer that matched this point. */
  studentText: string;
  /** The similarity score (0-1) between the student's text and the standard text. */
  similarityScore: number;
  /** The type of match determined by the similarity score. */
  matchType: 'exact' | 'high' | 'partial' | 'weak';
  /** The marks awarded for this specific matched point. */
  marksAwarded: number;
  /** AI-generated feedback specific to this point. */
  feedback: string;
}

/**
 * Stores the complete result of a grading operation.
 */
export interface GradingResult {
  /** The unique identifier for the grading result. */
  id: string;
  /** A foreign key linking to the StudentAnswer. */
  studentAnswerId: string;
  /** The total score awarded to the student. */
  totalScore: number;
  /** The maximum possible score for the question. */
  maxScore: number;
  /** The student's score as a percentage. */
  percentage: number;
  /** An array of points that were successfully matched. */
  matchedPoints: MatchedPoint[];
  /** An array of point numbers that were not matched. */
  missedPoints: string[];
  /** A comprehensive, AI-generated summary of the student's performance. */
  overallFeedback: string;
  /** The time it took to grade the answer, in milliseconds. */
  processingTime: number;
  /** The timestamp when the grading was completed. */
  gradedAt: Date;
}
