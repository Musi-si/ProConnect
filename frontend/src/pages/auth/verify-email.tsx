import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { HandshakeIcon, MailIcon, CheckCircleIcon } from "lucide-react";
import axios from 'axios';

export default function VerifyEmail() {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Call your backend endpoint to resend the verification email
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email: userEmail, // the email of the user who wants to resend
      });

      if (response.status === 200) {
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setMessage("Failed to resend email. Please try again.");
      }
    } catch (error: any) {
      console.error("Resend email error:", error);
      setMessage(
        error.response?.data?.message || "Failed to resend email. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="bg-primary rounded-lg p-2">
              <HandshakeIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">ProConnect</span>
          </Link>
        </div>

        {/* Single Card */}
        <Card className="bg-white/95 dark:bg-card/95 shadow-2xl border border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <MailIcon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="flex items-center gap-2 justify-center mt-2 mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              Email Verification
            </CardTitle>
            <p className="text-muted-foreground mt-2 mb-4">
              We've sent a verification link to{" "}
              <span className="font-medium">{user?.email}</span>
            </p>
            <CardDescription>
              Please check your email and click the verification link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                className="w-full border-[var(--primary)] text-[var(--primary)]"
                data-testid="button-resend-email"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="#" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
