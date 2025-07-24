import { StorageKeys } from "@/constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useUserName() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserName() {
      try {
        const storedName = await AsyncStorage.getItem(StorageKeys.USER_NAME);
        if (storedName) {
          setUserName(JSON.parse(storedName));
        }
      } catch (error) {
        console.error("Error loading user name:", error);
      }
    }

    loadUserName();
  }, []);

  return userName;
}
