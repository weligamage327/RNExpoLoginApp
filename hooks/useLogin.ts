import { useState } from 'react';

interface LoginResponse {
  userData: {
    email: string;
  };
  authKey: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Define the loginUser function with typed parameters and return type
  const loginUser = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<LoginResponse | null> => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://13.201.75.192/api/login", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const jsonData = await response.json();

      if (!response.ok) {
        setError(jsonData.message || "Login failed");
        return null;
      }

      const userData = jsonData.data.user;

      const authKey = jsonData.data.accessToken;

      return { userData, authKey };
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};
