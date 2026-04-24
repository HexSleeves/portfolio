import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetail";
import ResumePage from "./pages/ResumePage";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import AboutPage from "./pages/AboutPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/resume" component={ResumePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/about" component={AboutPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
