import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MailIcon, CheckCircleIcon, RefreshCwIcon } from "lucide-react";

interface EmailVerificationProps {
  email: string;
  onResend: () => Promise<void>;
  onSkip: () => void;
}

export function EmailVerification({ email, onResend, onSkip }: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");
    try {
      await onResend();
      setMessage("Verification email sent successfully! Please check your inbox.");
    } catch (error: any) {
      setMessage(`Failed to resend email: ${error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <MailIcon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-muted-foreground mt-2">
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      </div>

      {/* Verification Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            Email Verification Required
          </CardTitle>
          <CardDescription>
            Please check your email and click the verification link to activate your account.
            This helps us ensure the security of your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.includes("Failed") ? "destructive" : "default"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={isResending}
              variant="outline"
              className="w-full"
              data-testid="resend-email-button"
            >
              {isResending ? (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Resend verification email
                </>
              )}
            </Button>

            <Button
              onClick={onSkip}
              variant="ghost"
              className="w-full"
              data-testid="skip-verification-button"
            >
              Continue without verification
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder.
            </p>
            <p className="text-sm text-muted-foreground">
              You can verify your email later from your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
