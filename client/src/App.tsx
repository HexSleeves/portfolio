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
import AdminDashboard from "./pages/admin/AdminDashboard";
import RequireAdmin from "./components/RequireAdmin";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";
import AdminProjectsList from "./pages/admin/AdminProjectsList";
import AdminProjectEditor from "./pages/admin/AdminProjectEditor";
import AdminSettings from "./pages/admin/AdminSettings";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/resume" component={ResumePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/about" component={AboutPage} />
      {/* Admin routes — protected by RequireAdmin (owner/admin only) */}
      <Route path="/admin">{() => <RequireAdmin><AdminDashboard /></RequireAdmin>}</Route>
      <Route path="/admin/blog">{() => <RequireAdmin><AdminBlogList /></RequireAdmin>}</Route>
      <Route path="/admin/blog/:id">{() => <RequireAdmin><AdminBlogEditor /></RequireAdmin>}</Route>
      <Route path="/admin/projects">{() => <RequireAdmin><AdminProjectsList /></RequireAdmin>}</Route>
      <Route path="/admin/projects/:id">{() => <RequireAdmin><AdminProjectEditor /></RequireAdmin>}</Route>
      <Route path="/admin/settings">{() => <RequireAdmin><AdminSettings /></RequireAdmin>}</Route>
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
