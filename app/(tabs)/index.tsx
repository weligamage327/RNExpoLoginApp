import {SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import {useThemeColor} from "@/hooks/useThemeColor";
import {TabBarIcon} from "@/components/navigation/TabBarIcon";

export default function HomeScreen() {
  const color = useThemeColor({ light: "#000", dark: "#fff" }, "background");
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.content}>
          <ThemedText style={{ paddingBottom: 20 }} type="title">
            Settings
          </ThemedText>

          <TouchableOpacity onPress={handleLogout}>
            <ThemedView style={styles.row}>
              <TabBarIcon name={"log-out"} color={color} />
              <ThemedText type="subtitle">Logout!</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexDirection: "column",
    flex: 1,
    padding: 32,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
});
