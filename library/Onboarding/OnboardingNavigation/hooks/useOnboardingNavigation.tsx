import React from "react";

type ProgressContextType = {
  progressPercentage: number;
  setProgressPercentage: (progress: number) => void;
  hideHeader: boolean;
  setHideHeader: (bool: boolean) => void;
};

const ProgressContext = React.createContext<ProgressContextType | undefined>(
  undefined,
);

export const useOnboardingNavigation = () => {
  const context = React.useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};

export const OnboardingNavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [progress, setProgress] = React.useState<number>(0);
  const setProgressPercentage = (progressPercentage: number) =>
    setProgress(Math.max(0, Math.min(100, progressPercentage)));

  const [hideHeader, setHideHeader] = React.useState<boolean>(false);
  return (
    <ProgressContext.Provider
      value={{
        progressPercentage: progress,
        setProgressPercentage,
        hideHeader,
        setHideHeader,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
