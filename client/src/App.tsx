import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import RequireAdmin from "./components/RequireAdmin";
import { type Theme, useUiStore } from "./stores/uiStore";

const Home = lazy(() => import("./pages/Home"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlogList = lazy(() => import("./pages/admin/AdminBlogList"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));
const AdminProjectsList = lazy(
  () => import("./pages/admin/AdminProjectsList")
);
const AdminProjectEditor = lazy(
  () => import("./pages/admin/AdminProjectEditor")
);
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

function ThemeBootstrap({
  defaultTheme = "dark",
  switchable = false,
}: {
  defaultTheme?: Theme;
  switchable?: boolean;
}) {
  const configureTheme = useUiStore(state => state.configureTheme);

  useEffect(() => {
    configureTheme(defaultTheme, switchable);
  }, [configureTheme, defaultTheme, switchable]);

  return null;
}
function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/resume" component={ResumePage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/about" component={AboutPage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin">
          {() => (
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/blog">
          {() => (
            <RequireAdmin>
              <AdminBlogList />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/blog/:id">
          {() => (
            <RequireAdmin>
              <AdminBlogEditor />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/projects">
          {() => (
            <RequireAdmin>
              <AdminProjectsList />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/projects/:id">
          {() => (
            <RequireAdmin>
              <AdminProjectEditor />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/admin/settings">
          {() => (
            <RequireAdmin>
              <AdminSettings />
            </RequireAdmin>
          )}
        </Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeBootstrap defaultTheme="dark" />
      <Toaster />
      <Router />
    </ErrorBoundary>
  );
}

export default App;
