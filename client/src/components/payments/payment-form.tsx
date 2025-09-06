import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  DollarSignIcon,
  InfoIcon,
  LoaderIcon
} from "lucide-react";

// Load Stripe with public key from environment
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_example_key"
);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  description: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function CheckoutForm({ amount, description, onSuccess, onError }: Omit<PaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Payment Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Payment for:</span>
              <span className="text-sm font-medium">{description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="text-lg font-bold text-primary">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Processing Fee:</span>
              <span className="text-sm">$0.00</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">${amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Element */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Enter your payment details to complete the transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-start space-x-2 p-4 bg-muted/30 rounded-lg">
        <ShieldCheckIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <div className="font-medium mb-1">Secure Payment</div>
          <div className="text-muted-foreground">
            Your payment information is encrypted and processed securely through Stripe. 
            Funds will be held in escrow until the milestone is completed.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !elements || isProcessing}
        size="lg"
        data-testid="submit-payment"
      >
        {isProcessing ? (
          <>
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <DollarSignIcon className="mr-2 h-4 w-4" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          <InfoIcon className="h-4 w-4 inline mr-1" />
          By proceeding, you agree to our terms of service and payment policy
        </p>
      </div>
    </form>
  );
}

export function PaymentForm({ 
  clientSecret, 
  amount, 
  description, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#f97316',
      colorBackground: 'var(--background)',
      colorText: 'var(--foreground)',
      colorDanger: '#ef4444',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <LoaderIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing payment...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-6 w-6" />
            Complete Payment
          </CardTitle>
          <CardDescription>
            Secure payment processing powered by Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              amount={amount}
              description={description}
              onSuccess={onSuccess}
              onError={onError}
            />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
