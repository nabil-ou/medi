import {
  eveningQuestionPool,
  morningQuestionPool,
} from "@/constants/JournalEntries";
import { EntryType } from "@/types";

/**
 * Get a new question from the pool, ensuring it hasn't been used recently
 * @param questionPool - The pool of questions to choose from
 * @param recentQuestions - The list of questions that have been used recently
 * @returns A new question from the pool
 */
function getNewQuestion(
  questionPool: string[],
  recentQuestions: string[],
): string {
  if (questionPool.length === 0) {
    throw new Error("No questions available in pool");
  }

  const availableQuestions = questionPool.filter(
    (q) => !recentQuestions.includes(q),
  );

  const questionsToUse =
    availableQuestions.length === 0 ? questionPool : availableQuestions;

  const randomIndex = Math.floor(Math.random() * questionsToUse.length);
  return questionsToUse[randomIndex];
}

let morningQuestionHistory: string[] = [];
let eveningQuestionHistory: string[] = [];

/**
 * Get a new question from the morning question pool
 * @returns A new question from the morning question pool
 */
export function getMorningQuestion(): string {
  const question = getNewQuestion(morningQuestionPool, morningQuestionHistory);
  morningQuestionHistory = [question, ...morningQuestionHistory].slice(
    0,
    morningQuestionPool.length,
  );
  return question;
}

/**
 * Get a new question from the evening question pool
 * @returns A new question from the evening question pool
 */
export function getEveningQuestion(): string {
  const question = getNewQuestion(eveningQuestionPool, eveningQuestionHistory);
  eveningQuestionHistory = [question, ...eveningQuestionHistory].slice(
    0,
    eveningQuestionPool.length,
  );
  return question;
}

/**
 * Get a new question from the question pool based on the entry type
 * @param type - The type of entry
 * @returns A new question from the question pool
 */
export function getRandomQuestion(type: EntryType): string {
  switch (type) {
    case EntryType.MorningReflection:
      return getMorningQuestion();
    case EntryType.EveningReflection:
      return getEveningQuestion();
    default:
      throw new Error(`Unsupported entry type: ${type}`);
  }
}
