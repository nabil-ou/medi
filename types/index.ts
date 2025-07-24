export enum EntryType {
  MorningReflection = "MORNING_REFLECTION",
  EveningReflection = "EVENING_REFLECTION",
  FreeEntry = "FREE_ENTRY",
}

export type AIInsights = {
  title: string;
  summary: string;
  themes: string[];
};

export type JournalEntry = {
  id: string;
  type: EntryType;
  prompts?: {
    question: string;
    answer: string;
  }[];
  photos?: string[];
} & Partial<AIInsights>;

export type EntryRecord = Record<string, JournalEntry>; // ISO string

export type JournalEntries = {
  date: string; // yyyy-mm-dd
  entries: JournalEntry[];
}[];

export type WeeklyInsight = {
  id: string;
  questions?: string[];
  title: string;
  recap: string;
  insights: {
    paragraph: string;
  }[];
  winsOfTheWeek: {
    win: string;
  }[];
  tips: string;
  themes: string[];
};

export type WeeklyInsightRecord = Record<string, WeeklyInsight>; // ISO string

export type WeeklyInsights = {
  date: string;
  entries: WeeklyInsight[];
}[];

export type InitialQuestion = {
  title: string;
  hint: string;
};

export type GeneratedQuestion = {
  title: string;
};

export type ReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
};

export interface ProjectMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyReport {
  id: string;
  projectId: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
