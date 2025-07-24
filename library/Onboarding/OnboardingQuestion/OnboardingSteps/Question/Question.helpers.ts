import { QuestionStepType } from "../../type";

export const infoBoxIsDefined = (
  infoBox: QuestionStepType["payload"]["infoBox"],
): infoBox is NonNullable<QuestionStepType["payload"]["infoBox"]> => {
  if (infoBox == null) return false;
  if (infoBox === undefined) return false;
  if (infoBox.content.trim() === "" && infoBox.title.trim() === "")
    return false;
  return true;
};
