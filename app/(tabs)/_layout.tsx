import { Tabs, useRouter } from "expo-router";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";

import { CalendarDays, Home, Plus } from "@tamagui/lucide-icons";

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "rgba(86, 19, 19, 0.1)",
            height: 85,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="History"
          options={{
            title: "History",
            tabBarIcon: ({ color }) => <CalendarDays color={color} />,
          }}
        />
      </Tabs>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 35,
          left: "50%",
          marginLeft: -35,
          width: 70,
          height: 70,
          borderRadius: 40,
          backgroundColor: Colors.primary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 1000,
        }}
        onPress={() => router.push("/medications/add")}
      >
        <Plus color={Colors.white} size={36} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
