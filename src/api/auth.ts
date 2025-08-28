export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }

  return {
    token: "mock-jwt-token-" + Date.now(),
    user: {
      id: "1",
      email: credentials.email,
      name: "Sprint Board User",
    },
  };
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}
