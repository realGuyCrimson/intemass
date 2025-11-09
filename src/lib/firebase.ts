/**
 * @fileoverview This file contains helper functions for interacting with Firestore.
 * It provides type-safe methods for common CRUD operations on each collection.
 */

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type Firestore,
  type Query,
  type CollectionReference,
} from 'firebase/firestore';

import { initializeFirebase } from '@/firebase';
import type {
  Question,
  StandardAnswer,
  MarkingScheme,
  StudentAnswer,
  GradingResult,
} from '@/types/models';

// Initialize Firebase and get the Firestore instance
const { firestore } = initializeFirebase();

// Type-safe collection references
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const questionsCol = createCollection<Question>('questions');
export const standardAnswersCol = createCollection<StandardAnswer>('standardAnswers');
export const markingSchemesCol = createCollection<MarkingScheme>('markingSchemes');
export const studentAnswersCol = createCollection<StudentAnswer>('studentAnswers');
export const gradingResultsCol = createCollection<GradingResult>('gradingResults');


// --- Generic Helper Functions ---

/**
 * Creates a new document in a collection.
 * @param collectionRef The collection reference.
 * @param data The data for the new document.
 * @returns The ID of the newly created document.
 */
export async function createDocument<T>(collectionRef: CollectionReference<T>, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Reads a single document from a collection by its ID.
 * @param collectionRef The collection reference.
 * @param id The document ID.
 * @returns The document data with its ID, or null if not found.
 */
export async function readDocument<T>(collectionRef: CollectionReference<T>, id: string) {
  const docRef = doc(collectionRef, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
  }
  return null;
}

/**
 * Updates a document in a collection.
 * @param collectionRef The collection reference.
 * @param id The document ID.
 * @param data The data to update.
 */
export async function updateDocument<T>(collectionRef: CollectionReference<T>, id: string, data: Partial<T>) {
  const docRef = doc(collectionRef, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes a document from a collection.
 * @param collectionRef The collection reference.
 * @param id The document ID.
 */
export async function deleteDocument<T>(collectionRef: CollectionReference<T>, id: string) {
  const docRef = doc(collectionRef, id);
  await deleteDoc(docRef);
}

// --- Type-Safe Query Builders ---

/**
 * Queries documents from a collection.
 * @param q The Firestore query object.
 * @returns An array of documents with their IDs.
 */
async function getDocsByQuery<T>(q: Query<T>) {
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (T & { id: string })[];
}

// --- Questions ---
export const getRecentQuestions = (count: number) =>
  getDocsByQuery(query(questionsCol, orderBy('createdAt', 'desc'), limit(count)));

export const getQuestionsBySubject = (subject: string) =>
  getDocsByQuery(query(questionsCol, where('subject', '==', subject)));

// --- Student Answers ---
export const getRecentSubmissions = (count: number) =>
  getDocsByQuery(query(studentAnswersCol, orderBy('submittedAt', 'desc'), limit(count)));

export const getSubmissionsForQuestion = (questionId: string) =>
  getDocsByQuery(query(studentAnswersCol, where('questionId', '==', questionId)));

// --- Grading Results ---
export const getResultForAnswer = (studentAnswerId: string) =>
  getDocsByQuery(query(gradingResultsCol, where('studentAnswerId', '==', studentAnswerId), limit(1)));


export { firestore };

    