import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";

import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { toast } from "../components/ui/sonner";
import { api } from "../api/api";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

/* -------------------------------------------------------------------
   TYPES
------------------------------------------------------------------- */

type StatusDetail = {
  type?: "SUCCESS" | "WARN" | "ERROR";
  code?: string;
  message?: string;
};

type ApiStatus = {
  type?: "SUCCESS" | "WARN" | "ERROR";
  details?: StatusDetail[];
};

type ApiStatusError = Error & {
  status?: ApiStatus;
  detail?: StatusDetail;
  code?: string;
};

type LoginResponse = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  tokenExpiry?: string;
  status?: ApiStatus;
  userProfile?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    userStatus?: string;
  };
};

/* -------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------- */

const extractPrimaryToken = (payload: LoginResponse) =>
  payload.token || payload.accessToken || payload.access_token || "";

const assertLoginResponseSuccess = (payload: LoginResponse) => {
  if (payload.status?.type && payload.status.type !== "SUCCESS") {
    const detail =
      payload.status.details?.find((d) => d?.message || d?.code) ??
      payload.status.details?.[0];

    const error: ApiStatusError = Object.assign(
      new Error(detail?.message || "Login failed"),
      {
        status: payload.status,
        detail,
        code: detail?.code,
      }
    );
    throw error;
  }

  const token = extractPrimaryToken(payload);
  if (!token) throw new Error("Login failed: token missing");

  return token;
};

const getStatusCodeFromError = (err: unknown): string | undefined => {
  const error = err as ApiStatusError;
  return error?.code || error?.detail?.code;
};

const persistSession = (token: string, data: LoginResponse) => {
  localStorage.setItem("auth_token", token);

  window.dispatchEvent(
    new CustomEvent("local-storage", {
      detail: { key: "auth_token", newValue: token },
    })
  );

  if (data.refreshToken) localStorage.setItem("refresh_token", data.refreshToken);
  if (data.tokenExpiry) localStorage.setItem("token_expiry", data.tokenExpiry);

  if (data.userProfile)
    localStorage.setItem("user_profile", JSON.stringify(data.userProfile));
};

/* -------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------- */

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"email" | "social">("email");

  /* ---------------------------------------------
     GOOGLE LOGIN HANDLER (new version)
  --------------------------------------------- */
  const handleGoogleResponse = async (googleToken: string) => {
    try {
      setLoading(true);

      if (!googleToken) throw new Error("Invalid Google token");

      const claims: any = jwtDecode(googleToken);
console.log(claims);
      // Try Login
      try {
        const loginData = (await api.post("/user/v1/login", {
          socialLogin: {
            platform: "GOOGLE",
            token: googleToken,
          },
        })) as LoginResponse;

        const token = assertLoginResponseSuccess(loginData);
        persistSession(token, loginData);

        toast.success("Logged in with Google");
        navigate("/");
        return;
      } catch (loginError) {
        // ERROR 1010 → User not exists → Signup
        if (getStatusCodeFromError(loginError) === "1010") {
          const signupData = (await api.post("/user/v1/signup", {
            socialSignup: {
              platform: "GOOGLE",
              token: googleToken,
            },
            email: claims.email,
            firstName: claims.given_name,
            lastName: claims.family_name,
          })) as LoginResponse;

          const token = assertLoginResponseSuccess(signupData);
          persistSession(token, signupData);

          toast.success("Account created via Google");
          navigate("/");
          return;
        }

        throw loginError;
      }
    } catch (err: any) {
      toast.error(err?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     EMAIL LOGIN
  --------------------------------------------- */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email & password");

    setLoading(true);
    try {
      const data = (await api.post("/user/v1/login", {
        emailLogin: { email, password },
      })) as LoginResponse;

      const token = assertLoginResponseSuccess(data);
      persistSession(token, data);

      toast.success("Logged in successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-10">
          <Card className="embossed">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Access your JusPredict account</CardDescription>
            </CardHeader>

            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4">
                <Tabs value={mode} onValueChange={(v: string) => setMode(v as "email" | "social")}>
                  <TabsList>
                    <TabsTrigger value="email">Email Login</TabsTrigger>
                    <TabsTrigger value="social">Google Login</TabsTrigger>
                  </TabsList>

                  {/* EMAIL LOGIN */}
                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* GOOGLE LOGIN */}
                  <TabsContent value="social" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Continue with Google
                    </p>

                    <GoogleLogin
                      onSuccess={(cred: { credential?: string }) =>
                        handleGoogleResponse(cred.credential as string)
                      }
                      onError={() => toast.error("Google login failed")}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                {mode === "email" && (
                  <Button disabled={loading} type="submit" className="w-full embossed-button">
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                )}

                <div className="text-sm text-muted-foreground text-center">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-primary hover:underline font-semibold">
                    Sign up here
                  </a>
                </div>
              </CardFooter>
            </form>
          </Card>
      </div>
    </div>
  );
};

export default Login;
