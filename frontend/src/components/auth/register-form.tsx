import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerSchema, type RegisterData } from "@shared/schema";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "freelancer",
      firstName: "",
      lastName: "",
    },
  });

  const handleSubmit = async (data: RegisterData) => {
    try {
      setError("");
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <Label>I want to</Label>
        <RadioGroup
          value={form.watch("role")}
          onValueChange={(value) => form.setValue("role", value as "freelancer" | "client")}
          className="flex flex-col space-y-2"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="freelancer" id="freelancer" data-testid="role-freelancer" />
            <Label htmlFor="freelancer" className="font-normal cursor-pointer">
              Work as a freelancer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="client" id="client" data-testid="role-client" />
            <Label htmlFor="client" className="font-normal cursor-pointer">
              Hire talent for my projects
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            {...form.register("firstName")}
            disabled={isLoading}
            data-testid="register-first-name-input"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...form.register("lastName")}
            disabled={isLoading}
            data-testid="register-last-name-input"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="johndoe"
          {...form.register("username")}
          disabled={isLoading}
          data-testid="register-username-input"
        />
        {form.formState.errors.username && (
          <p className="text-sm text-destructive">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...form.register("email")}
          disabled={isLoading}
          data-testid="register-email-input"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            {...form.register("password")}
            disabled={isLoading}
            data-testid="register-password-input"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            data-testid="toggle-password-visibility"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || form.formState.isSubmitting}
        data-testid="register-submit-button"
      >
        {isLoading || form.formState.isSubmitting ? (
          <>
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
