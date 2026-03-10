
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                BC
              </div>
              <span className="text-xl font-bold gradient-text">BotCraft</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your all-in-one platform for specialized AI chatbots in coding, healthcare, and more.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Dashboard</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BotCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
