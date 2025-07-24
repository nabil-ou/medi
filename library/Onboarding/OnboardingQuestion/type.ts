const MediaContent = "MediaContent" as const;
const Question = "Question" as const;
const Picker = "Picker" as const;
const Carousel = "Carousel" as const;
const TextInput = "TextInput" as const;
const SocialProof = "SocialProof" as const;
const Quote = "Quote" as const;
const NotificationSettings = "NotificationSettings" as const;

type BaseStepProperties = {
  id: string;
  type:
    | typeof MediaContent
    | typeof Question
    | typeof Picker
    | typeof Carousel
    | typeof TextInput
    | typeof SocialProof
    | typeof Quote
    | typeof NotificationSettings;
  name: string;
  displayProgressHeader: boolean;
  payload?: Record<string, any>;
};

export type StepType = BaseStepProperties["type"];

export type MediaContentStepType = BaseStepProperties & {
  type: typeof MediaContent;
  payload: {
    title: string;
    description?: string;
    backgroundImageUrl?: string;
    layout?: "mediaTop" | "mediaBottom";
    socialProof?: SocialProofStepType["payload"];
  } & (
    | {
        imageType: "image";
        imageUrl: string;
      }
    | {
        imageType: "rive";
        resourceName: string;
      }
  );
};

export type Answer = {
  label: string;
  value: string;
  imageUrl?: string;
  icon?: string;
};

export type QuestionStepType = BaseStepProperties & {
  type: typeof Question;
  payload: {
    answers: Answer[];
    title: string;
    multipleAnswer: boolean;
    infoBox?: {
      title: string;
      content: string;
    };
  };
};
export type PickerStepType = BaseStepProperties & {
  type: typeof Picker;
  payload: {
    title: string;
  };
};

export type CarouselPageType = {
  backgroundImageUrl: string;
  title: string;
  description: string;
  buttonText?: string;
} & (
  | {
      imageType: "image";
      imageUrl: string;
    }
  | {
      imageType: "rive";
      resourceName: string;
    }
);

export type CarouselStepType = BaseStepProperties & {
  type: typeof Carousel;
  payload: {
    pages: CarouselPageType[];
  };
};

export type TextInputStepType = BaseStepProperties & {
  type: typeof TextInput;
  payload: {
    title: string;
    placeholder: string;
  };
};

export type SocialProofStepType = BaseStepProperties & {
  type: typeof SocialProof;
  payload: {
    numberOfStar: number;
    content: string;
    authorName: string;
  };
};

export type QuoteStepType = BaseStepProperties & {
  type: typeof Quote;
  payload: {
    quote: {
      content: string;
      source: string;
      url: string;
      logosUrl: string[];
    };
  };
};

export type ReminderType = {
  id: string;
  title: string;
  imageUrl: string;
  defaultTime: {
    hour: number;
    minute: number;
  };
  defaultEnabled: boolean;
};

export type NotificationSettingsStepType = BaseStepProperties & {
  type: typeof NotificationSettings;
  payload: {
    title: string;
    description?: string;
    backgroundImageUrl?: string;
    reminders: ReminderType[];
  };
};

export type OnboardingStep =
  | MediaContentStepType
  | QuestionStepType
  | PickerStepType
  | CarouselStepType
  | TextInputStepType
  | SocialProofStepType
  | QuoteStepType
  | NotificationSettingsStepType;
