import { getCurrentStreak } from "@/utils/streak";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface StreakContextType {
  streak: number;
  refreshStreak: () => Promise<void>;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error("useStreak must be used within a StreakProvider");
  }
  return context;
};

export const StreakProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState(0);
  const [previousStreak, setPreviousStreak] = useState(0);

  const refreshStreak = useCallback(async () => {
    const currentStreak = await getCurrentStreak();
    if (currentStreak !== streak) {
      setPreviousStreak(streak);
      setStreak(currentStreak);
    }
  }, [streak]);

  useEffect(() => {
    refreshStreak();
  }, [refreshStreak]);

  return (
    <StreakContext.Provider value={{ streak, refreshStreak }}>
      {children}
    </StreakContext.Provider>
  );
};
