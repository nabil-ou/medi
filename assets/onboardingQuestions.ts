import { OnboardingStep } from "@/library/Onboarding";

const variantB: OnboardingStep[] = [
  {
    id: "welcome",
    type: "MediaContent",
    name: "Bienvenue sur SiteNote",
    displayProgressHeader: false,
    payload: {
      imageType: "image",
      imageUrl: "https://onboarding-asset.rocapine.io/grace/hugging%20face.png",
      backgroundImageUrl:
        "https://onboarding-asset.rocapine.io/grace/carousel-bg3.png",
      title: "Bienvenue sur SiteNote",
      description: "Votre application de rapports quotidiens",
      socialProof: { numberOfStar: 5, content: "", authorName: "" },
    },
  },
  {
    id: "features",
    type: "MediaContent",
    name: "Rapports quotidiens simplifiés",
    displayProgressHeader: false,
    payload: {
      imageType: "image",
      imageUrl: "https://onboarding-asset.rocapine.io/grace/open%20book.png",
      backgroundImageUrl:
        "https://onboarding-asset.rocapine.io/grace/carousel-bg1.png",
      title: "Rapports quotidiens simplifiés",
      description:
        "Créez et partagez facilement vos rapports quotidiens pour une meilleure communication",
      socialProof: { numberOfStar: 0, content: "", authorName: "" },
    },
  },
  {
    id: "benefits",
    type: "MediaContent",
    name: "Restez informé",
    displayProgressHeader: false,
    payload: {
      imageType: "image",
      imageUrl: "https://onboarding-asset.rocapine.io/grace/sparkles.png",
      backgroundImageUrl:
        "https://onboarding-asset.rocapine.io/grace/carousel-bg2.png",
      title: "Restez informé",
      description:
        "Suivez l'activité quotidienne et gardez une trace de vos progrès",
      socialProof: { numberOfStar: 0, content: "", authorName: "" },
    },
  },
  {
    id: "usage-goals",
    type: "Question",
    name: "Comment souhaitez-vous utiliser les rapports quotidiens ?",
    displayProgressHeader: false,
    payload: {
      answers: [
        { label: "Suivi personnel", value: "personal-tracking" },
        { label: "Communication d'équipe", value: "team-communication" },
        { label: "Suivi de projet", value: "project-tracking" },
        { label: "Autre", value: "other" },
      ],
      title: "Comment souhaitez-vous utiliser les rapports quotidiens ?",
      multipleAnswer: true,
      infoBox: { content: "", title: "" },
    },
  },
  {
    id: "experience",
    type: "Question",
    name: "Quelle est votre expérience avec les rapports quotidiens ?",
    displayProgressHeader: false,
    payload: {
      answers: [
        { label: "Je suis débutant", value: "beginner" },
        {
          label: "J'ai déjà utilisé des outils similaires",
          value: "experienced",
        },
        { label: "Je suis un utilisateur avancé", value: "advanced" },
      ],
      title: "Quelle est votre expérience avec les rapports quotidiens ?",
      multipleAnswer: false,
      infoBox: { content: "", title: "" },
    },
  },
  {
    id: "ready",
    type: "MediaContent",
    name: "Vous êtes prêt !",
    displayProgressHeader: false,
    payload: {
      imageType: "image",
      imageUrl: "https://onboarding-asset.rocapine.io/grace/OK%20hand.png",
      title: "Vous êtes prêt !",
      description: "Commencez à créer vos rapports quotidiens dès maintenant",
      socialProof: { numberOfStar: 0, content: "", authorName: "" },
    },
  },
];

export function getQuestions(): OnboardingStep[] {
  return variantB;
}
