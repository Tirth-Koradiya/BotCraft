
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-8 animate-pulse-glow">
        <Bot className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-5xl font-bold mb-4 gradient-text">404</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
        Oops! It seems this bot doesn't exist in our multiverse.
      </p>
      <Link to="/">
        <Button className="gap-2">
          <Home size={18} />
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
