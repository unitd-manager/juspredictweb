import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
import { toast } from "../components/ui/sonner";
import { api } from "../api/api";

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

type VerifyResponse = {
  status?: ApiStatus;
};

type ResendResponse = {
  status?: ApiStatus;
};

/* -------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------- */

const assertResponseSuccess = (payload: VerifyResponse | ResendResponse) => {
  if (payload.status?.type && payload.status.type !== "SUCCESS") {
    const detail =
      payload.status.details?.find((d) => d?.message || d?.code) ??
      payload.status.details?.[0];

    const error: ApiStatusError = Object.assign(
      new Error(detail?.message || "Operation failed"),
      {
        status: payload.status,
        detail,
        code: detail?.code,
      }
    );
    throw error;
  }

  return true;
};

const getStatusCodeFromError = (err: unknown): string | undefined => {
  const error = err as ApiStatusError;
  return error?.code || error?.detail?.code;
};

/* -------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------- */

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const email = location.state?.email || "";

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ---------------------------------------------
     VERIFY OTP
  --------------------------------------------- */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      return toast.error("Please enter a valid OTP");
    }

    setLoading(true);
    try {
      const data = (await api.post("/user/v1/verify", {
        oneTimePassword: otp,
        scope: "ACCT_ACTIVATION",
      })) as VerifyResponse;

      assertResponseSuccess(data);

      toast.success("Email verified successfully");
      navigate("/");
    } catch (error: any) {
      const statusCode = getStatusCodeFromError(error);
      if (statusCode === "1009") {
        toast.error("Invalid or expired OTP. Please try again.");
      } else {
        toast.error(error?.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     RESEND OTP
  --------------------------------------------- */
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const data = (await api.post("/user/v1/resendverification", {
        scope: "ACCT_ACTIVATION",
      })) as ResendResponse;

      assertResponseSuccess(data);

      toast.success("OTP resent to your email");
      setResendTimer(60); // 60 second cooldown
      setOtp("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
        <Card className="embossed">
          <CardHeader>
            <CardTitle>Verify Email Address</CardTitle>
            <CardDescription>
              We've sent a verification code to your email
              {email && <span className="block mt-2 font-semibold">{email}</span>}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleVerify}>
            <CardContent className="space-y-6">
              {/* OTP Input */}
              <div>
                <Label htmlFor="otp">Enter Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // Allow only numbers
                    const value = e.target.value.replace(/\D/g, "");
                    setOtp(value);
                  }}
                  maxLength={6}
                  required
                  className="text-center text-lg tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Check your email for the 6-digit code
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-muted/50 border border-muted rounded-md p-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Didn't receive the code?</span>
                  {" "}Check your spam folder or request a new one below.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                disabled={loading}
                type="submit"
                className="w-full embossed-button"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={resendLoading || resendTimer > 0}
                onClick={handleResendOtp}
                className="w-full"
              >
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : resendLoading
                  ? "Sending..."
                  : "Resend Code"}
              </Button>

              <div className="text-sm text-muted-foreground text-center">
                <a href="/login" className="text-primary hover:underline font-semibold">
                  Back to Login
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
