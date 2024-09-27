import { ActivityIndicator, Image, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function HomeScreen() {
  const { user, authKey, logout, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/home-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authKey}`, // Pass token in the header
          },
        }); // Example API endpoint
        if (response.status === 401 || response.status === 403) {
          // Handle token expiration or incorrect token
          console.log("Token expired or invalid. Logging out...");
          logout();
          return;
        }

        if (!response.ok) {
          setError("Failed to fetch home data.");
        }
        const data = await response.json();
      } catch (err) {
        setError("Failed to load home data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return <ActivityIndicator size="large" color="#2596be" />;
  }

  if (error) {
    return (
      <ThemedText type="default" style={styles.errorText}>
        {error}
      </ThemedText>
    );
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Welcome! {user?.email}</ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
