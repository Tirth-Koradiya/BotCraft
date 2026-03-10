import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, LogIn } from "lucide-react";
import { UserCredential } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login, googleSignIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      await login(email, password);

      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");

      sessionStorage.setItem("user_id", data.user_id);
      sessionStorage.setItem("user_email", email);
      sessionStorage.setItem("user_name", ""); // No name from backend

      navigate(from, { replace: true });
    } catch (error: any) {
      setLoginError(error.message);
      console.error("Login error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = (await googleSignIn()) as UserCredential;

      if (!result.user.email) throw new Error("Google sign-in failed");

      const userInfo = {
        email: result.user.email,
        name: result.user.displayName || "Google User",
      };

      const res = await fetch("http://localhost:8000/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Google login failed");

      sessionStorage.setItem("user_id", data.user_id);
      sessionStorage.setItem("user_email", result.user.email);
      sessionStorage.setItem("user_name", result.user.displayName || "Google User");

      navigate(from, { replace: true });
    } catch (error: any) {
      alert("Google login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/30">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glassmorphism">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center gradient-text">Welcome Back</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="new-email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
  <Input
    id="password"
    type={showPassword ? "text" : "password"}
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="bg-white/50 pr-10"
  />
  <span
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

                {loginError && <p className="text-sm text-red-500 mt-1">{loginError}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><LogIn size={18} /> Sign in</span>
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground mt-2">
                For demo, use: <span className="font-medium">user@example.com</span> / <span className="font-medium">password</span>
              </div>
            </form>
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full mt-4">
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline inline-flex items-center gap-1">
                Sign up <ArrowRight size={14} />
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
