
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Code, Heart, Brain, Sparkles, UserRound, Cpu, Check } from "lucide-react";

const About = () => {
  const bots = [
    {
      name: "CodeBot",
      icon: <Code className="h-10 w-10 text-white" />,
      color: "bg-blue-500",
      description: "Expert assistance with coding, debugging, and development",
      capabilities: [
        "Debugging help for multiple languages",
        "Code optimization suggestions",
        "Learning resources for programmers",
      ],
    },
    {
      name: "HealthBot",
      icon: <Heart className="h-10 w-10 text-white" />,
      color: "bg-red-500",
      description: "General health information and wellness guidance",
      capabilities: [
        "General health information",
        "Exercise and nutrition tips",
        "Wellness habit tracking assistance",
      ],
    },
    {
      name: "EduBot",
      icon: <Brain className="h-10 w-10 text-white" />,
      color: "bg-violet-500",
      description: "Study assistance for various academic subjects",
      capabilities: [
        "Homework help across subjects",
        "Study strategy suggestions",
        "Explanations of complex topics",
      ],
    },
    {
      name: "CreativeBot",
      icon: <Sparkles className="h-10 w-10 text-white" />,
      color: "bg-amber-500",
      description: "Inspiration and assistance for creative projects",
      capabilities: [
        "Writing prompts and feedback",
        "Design ideas and suggestions",
        "Creative problem-solving assistance",
      ],
    },
  ];

  return (
    <div className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4 gradient-text">About ChatVerse</h1>
        <p className="text-xl text-muted-foreground">
          Your gateway to specialized AI assistance across multiple domains. Our mission is to provide
          accessible, specialized AI chatbots for everyone.
        </p>
      </div>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Meet Our AI Specialists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bots.map((bot, index) => (
            <Card key={index} className="overflow-hidden bot-container">
              <div className={`${bot.color} p-6 flex justify-center`}>
                <div className="rounded-full p-4 bg-white/20 backdrop-blur-sm">
                  {bot.icon}
                </div>
              </div>
              <CardHeader>
                <CardTitle>{bot.name}</CardTitle>
                <CardDescription>{bot.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {bot.capabilities.map((capability, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 gradient-text">Our Technology</h2>
            <p className="text-lg text-muted-foreground mb-6">
              ChatVerse leverages cutting-edge AI models trained on diverse datasets to provide specialized
              assistance across multiple domains. Our AI systems are designed to be helpful, harmless, and honest.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Domain-Specific Models</h3>
                  <p className="text-muted-foreground">
                    Each chatbot is powered by models specialized for their domain.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Human-Centered Design</h3>
                  <p className="text-muted-foreground">
                    Our interfaces are designed for intuitive, helpful interactions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Continuous Learning</h3>
                  <p className="text-muted-foreground">
                    Our AI systems continuously improve from user interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "0.1s" }}>
                  <div className="h-16 w-16 rounded-lg glassmorphism flex items-center justify-center">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "0.3s" }}>
                  <div className="h-16 w-16 rounded-lg glassmorphism flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "0.5s" }}>
                  <div className="h-16 w-16 rounded-lg glassmorphism flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="absolute top-3/4 left-2/3 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "0.7s" }}>
                  <div className="h-16 w-16 rounded-lg glassmorphism flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold animate-pulse-glow">
                    <Bot className="h-16 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Join Our Community</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Become part of the ChatVerse community today and experience the future of AI assistance.
          We're committed to creating AI that's helpful, informative, and accessible to all.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>We're here to help!</CardTitle>
              <CardDescription>
                Our team is constantly working to improve our AI assistants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Have feedback or suggestions? We'd love to hear from you!
                Contact us at <span className="text-primary">support@chatverse.example.com</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
