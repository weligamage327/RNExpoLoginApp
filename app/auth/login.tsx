import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useLogin } from "@/hooks/useLogin";
import { useFormValidation } from "@/hooks/useFormValidation";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordWrapperFocused, setIsPasswordWrapperFocused] =
    useState(false);

  const color = useThemeColor({}, "icon");
  const borderColor = useThemeColor({}, "inputBorder");

  const { login } = useAuth();
  const { loginUser, loading, error: apiError } = useLogin();
  const { errors, validate } = useFormValidation();

  const handleLogin = async () => {
    const isValid = validate(email, password);

    if (!isValid) return;

    const result = await loginUser(email, password, rememberMe);

    if (result) {
      const { userData, authKey } = result;
      login(userData, authKey);
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("../../assets/images/alfresco.png")}
        style={styles.logo}
      />
      <ThemedText type={"title"} style={styles.title}>
        Welcome
      </ThemedText>

      <ThemedView
        style={[styles.inputWrapper, isEmailFocused && styles.focusedWrapper]}
      >
        <ThemedTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus={true}
        />
      </ThemedView>
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <ThemedView
        style={[
          styles.inputWrapper,
          isPasswordWrapperFocused && styles.focusedWrapper,
        ]}
      >
        <ThemedTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          onFocus={() => setIsPasswordWrapperFocused(true)}
          onBlur={() => setIsPasswordWrapperFocused(false)}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Feather
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={16}
            color={color}
          />
        </TouchableOpacity>
      </ThemedView>
      {errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}

      {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={toggleRememberMe}>
          <MaterialCommunityIcons
            name={rememberMe ? "checkbox-outline" : "checkbox-blank-outline"}
            size={24}
            color={borderColor}
          />
        </TouchableOpacity>
        <ThemedText onPress={toggleRememberMe}>Remember Me</ThemedText>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading} // Disable the button when loading
      >
        <Text style={styles.loginButtonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    height: 42,
    overflow: "hidden",
  },
  focusedWrapper: {
    borderColor: "#2596be",
    borderWidth: 1,
  },
  iconContainer: {
    height: 50,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
    marginLeft: 3,
    alignSelf: "flex-start",
  },
  rememberMeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#2596be",
    padding: 14,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
