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

  // Email signup form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<DateOfBirth>({
    day: 1,
    month: 1,
    year: 2000,
  });

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"email" | "social">("email");

  /* ---------------------------------------------
     GOOGLE SIGNUP HANDLER
  --------------------------------------------- */
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
    } catch (err: any) {
      const statusCode = getStatusCodeFromError(err);
      if (statusCode === "1011") {
        toast.error("Email already registered. Please login instead.");
      } else {
        toast.error(err?.message || "Google signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     EMAIL SIGNUP
  --------------------------------------------- */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return toast.error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return toast.error(passwordValidation.message);
    }

    if (!validateDateOfBirth(dateOfBirth)) {
      return toast.error("You must be at least 13 years old to sign up");
    }

    setLoading(true);
    try {
      const signupData = (await api.post("/user/v1/signup", {
        emailSignup: {
          password,
        },
        email,
        firstName,
        lastName,
        dateOfBirth,
      })) as SignupResponse;

      const token = assertSignupResponseSuccess(signupData);
      persistSession(token, signupData);

      toast.success("Account created successfully");
      navigate("/verify-email", { state: { email } });
    } catch (error: any) {
      const statusCode = getStatusCodeFromError(error);
      if (statusCode === "1011") {
        toast.error("Email already registered. Please login instead.");
      } else {
        toast.error(error?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     HELPERS FOR DATE INPUTS
  --------------------------------------------- */
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  ).reverse();

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8">
      <div className="w-full max-w-lg px-4 sm:px-6 lg:px-10">
        <br/><br/>
        <Card className="embossed">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join JusPredict today and start predicting</CardDescription>
          </CardHeader>

          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <Tabs value={mode} onValueChange={(v: string) => setMode(v as "email" | "social")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email Signup</TabsTrigger>
                  <TabsTrigger value="social">Google Signup</TabsTrigger>
                </TabsList>

                {/* EMAIL SIGNUP */}
                <TabsContent value="email" className="space-y-4">
                  {/* First Name */}
                  <div>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLastName(e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  {/* Date of Birth */}
<div>
  <Label>Date of Birth</Label>

  <div className="grid grid-cols-3 gap-2">
    {/* DAY */}
    <select
      value={dateOfBirth.day}
      onChange={(e) =>
        setDateOfBirth({ ...dateOfBirth, day: Number(e.target.value) })
      }
      required
      className="
        h-10 w-full rounded-md
        border border-[#2A3942]
        bg-[#1F2C34] text-[#E9EDF1]
        px-3 py-2 text-sm
        focus:outline-none
        focus:ring-2 focus:ring-[#25D366]
      "
    >
      <option value="" disabled className="bg-[#1F2C34] text-[#AEBAC1]">
        Day
      </option>
      {days.map((day) => (
        <option
          key={day}
          value={day}
          className="bg-[#1F2C34] text-[#E9EDF1]"
        >
          {day}
        </option>
      ))}
    </select>

    {/* MONTH */}
    <select
      value={dateOfBirth.month}
      onChange={(e) =>
        setDateOfBirth({ ...dateOfBirth, month: Number(e.target.value) })
      }
      required
      className="
        h-10 w-full rounded-md
        border border-[#2A3942]
        bg-[#1F2C34] text-[#E9EDF1]
        px-3 py-2 text-sm
        focus:outline-none
        focus:ring-2 focus:ring-[#25D366]
      "
    >
      <option value="" disabled className="bg-[#1F2C34] text-[#AEBAC1]">
        Month
      </option>
      {months.map((month, idx) => (
        <option
          key={month}
          value={idx + 1}
          className="bg-[#1F2C34] text-[#E9EDF1]"
        >
          {month}
        </option>
      ))}
    </select>

    {/* YEAR */}
    <select
      value={dateOfBirth.year}
      onChange={(e) =>
        setDateOfBirth({ ...dateOfBirth, year: Number(e.target.value) })
      }
      required
      className="
        h-10 w-full rounded-md
        border border-[#2A3942]
        bg-[#1F2C34] text-[#E9EDF1]
        px-3 py-2 text-sm
        focus:outline-none
        focus:ring-2 focus:ring-[#25D366]
      "
    >
      <option value="" disabled className="bg-[#1F2C34] text-[#AEBAC1]">
        Year
      </option>
      {years.map((year) => (
        <option
          key={year}
          value={year}
          className="bg-[#1F2C34] text-[#E9EDF1]"
        >
          {year}
        </option>
      ))}
    </select>
  </div>

  <p className="text-xs text-[#AEBAC1] mt-1">
    Must be at least 13 years old
  </p>
</div>


                  {/* Password */}
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        required
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Min 8 chars, uppercase, and numbers
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setConfirmPassword(e.target.value)
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </TabsContent>

                {/* GOOGLE SIGNUP */}
                <TabsContent value="social" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Sign up with your Google account. Your profile information will be used to
                    create your JusPredict account.
                  </p>

                  <GoogleLogin
                    onSuccess={(cred: { credential?: string }) =>
                      handleGoogleResponse(cred.credential as string)
                    }
                    onError={() => toast.error("Google signup failed")}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              {mode === "email" && (
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full embossed-button"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              )}

              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline font-semibold">
                  Login here
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
