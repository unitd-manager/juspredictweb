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
import AppleSignInButton from "react-apple-signin-auth";

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

type SignupResponse = {
  accessToken?: string;
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

type DateOfBirth = {
  day: number;
  month: number;
  year: number;
};

/* -------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------- */

const assertSignupResponseSuccess = (payload: SignupResponse) => {
  if (payload.status?.type && payload.status.type !== "SUCCESS") {
    const detail =
      payload.status.details?.find((d) => d?.message || d?.code) ??
      payload.status.details?.[0];

    const error: ApiStatusError = Object.assign(
      new Error(detail?.message || "Signup failed"),
      {
        status: payload.status,
        detail,
        code: detail?.code,
      }
    );
    throw error;
  }

  const token = payload.accessToken;
  if (!token) throw new Error("Signup failed: token missing");

  return token;
};

const getStatusCodeFromError = (err: unknown): string | undefined => {
  const error = err as ApiStatusError;
  return error?.code || error?.detail?.code;
};

const persistSession = (token: string, data: SignupResponse) => {
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

const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain uppercase letters" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain numbers" };
  }
  return { valid: true };
};

const validateDateOfBirth = (dob: DateOfBirth): boolean => {
  const today = new Date();
  const birthDate = new Date(dob.year, dob.month - 1, dob.day);
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 13; // Minimum age requirement
};

/* -------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------- */

export const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState({
    day: 1,
    month: 1,
    year: 2000,
  });
const handleAppleSignup = async (response: any) => {
  try {
    setLoading(true);

    const appleToken = response?.authorization?.id_token;
    if (!appleToken) {
      throw new Error("Invalid Apple response");
    }

    const signupData = (await api.post("/user/v1/signup", {
      socialSignup: {
        platform: "APPLE",
        token: appleToken,
      },
    })) as SignupResponse;

    const token = assertSignupResponseSuccess(signupData);
    persistSession(token, signupData);

    toast.success("Account created with Apple");
    navigate("/verify-email");
  } catch (err: any) {
    toast.error(err?.message || "Apple signup failed");
  } finally {
    setLoading(false);
  }
};

  /* ---------------- EMAIL SIGNUP ---------------- */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return toast.error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const pwd = validatePassword(password);
    if (!pwd.valid) return toast.error(pwd.message);

    if (!validateDateOfBirth(dateOfBirth)) {
      return toast.error("You must be at least 13 years old");
    }

    setLoading(true);
    try {
      const signupData = (await api.post("/user/v1/signup", {
        emailSignup: { password },
        email,
        firstName,
        lastName,
        dateOfBirth,
      })) as SignupResponse;

      const token = assertSignupResponseSuccess(signupData);
      persistSession(token, signupData);

      toast.success("Account created successfully");
      navigate("/verify-email", { state: { email } });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE SIGNUP ---------------- */
  const handleGoogleResponse = async (googleToken: string) => {
    try {
      setLoading(true);
      if (!googleToken) throw new Error("Invalid Google token");

      const claims: any = jwtDecode(googleToken);

      const signupData = (await api.post("/user/v1/signup", {
        socialSignup: {
          platform: "GOOGLE",
          token: googleToken,
        },
        email: claims.email,
        firstName: claims.given_name,
        lastName: claims.family_name,
      })) as SignupResponse;

      const token = assertSignupResponseSuccess(signupData);
      persistSession(token, signupData);

      toast.success("Account created with Google");
      navigate("/verify-email", { state: { email: claims.email } });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
  <div className="w-full max-w-lg px-4">
        <Card className="embossed">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Join JusPredict and start predicting
            </CardDescription>
          </CardHeader>

          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">

              {/* Names */}
              <Input placeholder="First Name" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />
              <Input placeholder="Last Name" value={lastName}
                onChange={(e) => setLastName(e.target.value)} />

              {/* Email */}
              <Input type="email" placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />

              {/* Password */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* SUBMIT */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              {/* DIVIDER */}
              <div className="relative my-4">
                <div className="h-px bg-border" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              {/* GOOGLE */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(cred) =>
                    handleGoogleResponse(cred.credential as string)
                  }
                  onError={() => toast.error("Google signup failed")}
                />
              </div>

              {/* APPLE */}
<div className="flex justify-center mt-3">
  <AppleSignInButton
    authOptions={{
      clientId: "com.juspredict", // Apple Service ID
      scope: "email name",
      redirectURI: "https://test.juspredict.com/auth/apple/callback",
      state: "state123",
      nonce: "nonce123",
      usePopup: true,
    }}
    uiType="dark"
    className="apple-btn"
    buttonExtraChildren="Sign up with Apple"
    onSuccess={handleAppleSignup}
    onError={(err: any) => {
      console.error(err);
      toast.error("Apple signup failed");
    }}
  />
</div>

            </CardContent>

            <CardFooter className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-semibold">
                Login
              </a>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};


export default Signup;
