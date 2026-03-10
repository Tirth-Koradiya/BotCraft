
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot, Code, Heart, Brain, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Coding Assistant",
      description: "Get help with debugging, code optimization, and learning programming languages.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Healthcare Advisor",
      description: "Receive general health information, wellness tips, and medical explanations.",
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Learning Companion",
      description: "Study assistance for various subjects, from science to literature and beyond.",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Creative Partner",
      description: "Get inspiration for writing, design, and other creative endeavors.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 container text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-secondary/20 via-background to-background"></div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-fade-in max-w-4xl mx-auto">
          Discover the Power of Specialized AI Chatbots
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in">
          Access expert assistance in coding, healthcare, learning, and creativity through our suite of specialized AI assistants.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Link to={isAuthenticated ? "/dashboard" : "/login"}>
            <Button size="lg" className="gap-2 shadow-lg">
              Get Started <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="gap-2">
              Learn More
            </Button>
          </Link>
        </div>
        
        {/* Floating Bot Icons */}
        <div className="relative mt-20 h-64 md:h-80">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute h-16 w-16 rounded-2xl glassmorphism flex items-center justify-center animate-float"
                  style={{
                    top: `${50 - 35 * Math.sin((i * 2 * Math.PI) / 5)}%`,
                    left: `${50 - 35 * Math.cos((i * 2 * Math.PI) / 5)}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <Bot className="h-8 w-8 text-primary" />
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold animate-pulse-glow">
                  AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Our Specialized Assistants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bot-container glass-card flex flex-col items-center text-center p-8 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 p-3 rounded-full bg-accent">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Ready to Experience the Future of AI Assistance?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from our specialized AI chatbots.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button size="lg" className="gap-2 shadow-lg">
              {isAuthenticated ? "Go to Dashboard" : "Sign Up for Free"} <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
