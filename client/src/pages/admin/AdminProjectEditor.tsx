import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

interface ProjectFormState {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: "open-source" | "professional" | "personal";
  technologies: string;
  githubUrl: string;
  liveUrl: string;
  isFeatured: boolean;
  isPrivate: boolean;
  stars: number;
  sortOrder: number;
}

const DEFAULT_FORM: ProjectFormState = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  category: "personal",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  isFeatured: false,
  isPrivate: false,
  stars: 0,
  sortOrder: 0,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminProjectEditor() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === "new";
  const projectId = isNew ? null : parseInt(params.id!, 10);

  const [form, setForm] = useState<ProjectFormState>(DEFAULT_FORM);
  const [slugManual, setSlugManual] = useState(false);

  const utils = trpc.useUtils();

  const { data: existingProject, isLoading } = trpc.projects.adminById.useQuery(
    { id: projectId! },
    { enabled: !isNew && !!projectId }
  );

  useEffect(() => {
    if (existingProject) {
      setForm({
        title: existingProject.title,
        slug: existingProject.slug,
        summary: existingProject.summary ?? "",
        description: existingProject.description ?? "",
        category: (existingProject.category as ProjectFormState["category"]) ?? "personal",
        technologies: Array.isArray(existingProject.technologies)
          ? (existingProject.technologies as string[]).join(", ")
          : "",
        githubUrl: existingProject.githubUrl ?? "",
        liveUrl: existingProject.liveUrl ?? "",
        isFeatured: existingProject.isFeatured ?? false,
        isPrivate: existingProject.isPrivate ?? false,
        stars: existingProject.stars ?? 0,
        sortOrder: existingProject.sortOrder ?? 0,
      });
      setSlugManual(true);
    }
  }, [existingProject]);

  const createProject = trpc.projects.create.useMutation({
    onSuccess: (project) => {
      toast.success("Project created!");
      utils.projects.adminList.invalidate();
      if (project) navigate(`/admin/projects/${project.id}`);
    },
    onError: (err) => toast.error(err.message || "Failed to create project"),
  });

  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      toast.success("Project saved!");
      utils.projects.adminList.invalidate();
      utils.projects.adminById.invalidate({ id: projectId! });
    },
    onError: (err) => toast.error(err.message || "Failed to save project"),
  });

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugManual ? f.slug : slugify(title) }));
  };

  const handleSave = () => {
    const technologies = form.technologies.split(",").map((t) => t.trim()).filter(Boolean);
    const data = {
      ...form,
      technologies,
      githubUrl: form.githubUrl || undefined,
      liveUrl: form.liveUrl || undefined,
    };
    if (isNew) {
      createProject.mutate(data);
    } else {
      updateProject.mutate({ id: projectId!, ...data });
    }
  };

  const isPending = createProject.isPending || updateProject.isPending;

  if (!isNew && isLoading) {
    return (
      <AdminLayout title="Edit Project">
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const inputStyle = {
    background: "oklch(0.085 0.012 265)",
    borderColor: "oklch(1 0 0 / 10%)",
    color: "oklch(0.88 0.005 240)",
    fontFamily: "'Inter', sans-serif",
  };

  const labelStyle = {
    color: "oklch(0.52 0.015 250)",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <AdminLayout title={isNew ? "New Project" : "Edit Project"}>
      <div className="max-w-3xl space-y-6">
        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium"
            style={{ background: "oklch(0.82 0.15 200)", color: "oklch(0.085 0.012 265)", fontFamily: "'Inter', sans-serif" }}
          >
            {isPending ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save Project
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border p-5 space-y-4" style={{ background: "oklch(0.10 0.012 265)", borderColor: "oklch(1 0 0 / 8%)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                Basic Info
              </h3>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-none font-mono"
                  style={{ ...inputStyle, color: "oklch(0.82 0.15 200)", fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Summary *</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  rows={2}
                  placeholder="One-line description shown on project cards"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Full Description (Markdown)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={6}
                  placeholder="Detailed description shown on the project detail page..."
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none font-mono"
                  style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}
                />
              </div>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
                  placeholder="TypeScript, React, PostgreSQL, Docker"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="rounded-xl border p-5 space-y-4" style={{ background: "oklch(0.10 0.012 265)", borderColor: "oklch(1 0 0 / 8%)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                Links
              </h3>
              <div>
                <label className="block text-xs mb-1" style={labelStyle}>GitHub URL</label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                  placeholder="https://github.com/HexSleeves/..."
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Live URL</label>
                <input
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                  placeholder="https://myproject.com"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border p-4 space-y-4" style={{ background: "oklch(0.10 0.012 265)", borderColor: "oklch(1 0 0 / 8%)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                Settings
              </h3>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProjectFormState["category"] }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="open-source">Open Source</option>
                  <option value="professional">Professional</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>GitHub Stars</label>
                <input
                  type="number"
                  value={form.stars}
                  onChange={(e) => setForm((f) => ({ ...f, stars: parseInt(e.target.value) || 0 }))}
                  min={0}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="space-y-3 pt-2 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "oklch(0.82 0.15 200)" }}
                  />
                  <span className="text-sm" style={{ color: "oklch(0.82 0.005 240)", fontFamily: "'Inter', sans-serif" }}>
                    Featured on homepage
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPrivate}
                    onChange={(e) => setForm((f) => ({ ...f, isPrivate: e.target.checked }))}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "oklch(0.82 0.15 200)" }}
                  />
                  <span className="text-sm" style={{ color: "oklch(0.82 0.005 240)", fontFamily: "'Inter', sans-serif" }}>
                    Private (no GitHub link)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
