import { createContext, ReactNode, useContext } from "react";

interface OnboardingContextType {
  // ...
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within a OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  // States...

  // Effects and methods...

  return (
    <OnboardingContext.Provider
      value={
        {
          // ...
        }
      }
    >
      {children}
    </OnboardingContext.Provider>
  );
};
