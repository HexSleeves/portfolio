import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Edit, Github, Lock, Plus, Star, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "open-source": { bg: "oklch(0.82 0.15 200 / 10%)", text: "oklch(0.82 0.15 200)" },
  "professional": { bg: "oklch(0.75 0.18 145 / 10%)", text: "oklch(0.75 0.18 145)" },
  "personal": { bg: "oklch(0.75 0.15 290 / 10%)", text: "oklch(0.75 0.15 290)" },
};

export default function AdminProjectsList() {
  const utils = trpc.useUtils();
  const { data: projects = [], isLoading } = trpc.projects.adminList.useQuery();

  const toggleFeatured = trpc.projects.update.useMutation({
    onSuccess: () => { utils.projects.adminList.invalidate(); toast.success("Project updated"); },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteProject = trpc.projects.delete.useMutation({
    onSuccess: () => { utils.projects.adminList.invalidate(); toast.success("Project deleted"); },
    onError: () => toast.error("Failed to delete project"),
  });

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteProject.mutate({ id });
  };

  return (
    <AdminLayout title="Projects">
      <div className="max-w-4xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
          <Link href="/admin/projects/new">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "oklch(0.82 0.15 200)", color: "oklch(0.085 0.012 265)", fontFamily: "'Inter', sans-serif" }}
            >
              <Plus size={14} /> New Project
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 rounded-xl border" style={{ borderColor: "oklch(1 0 0 / 8%)", background: "oklch(0.10 0.012 265)" }}>
            <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-3" style={{ background: "oklch(0.82 0.15 200 / 10%)" }}>
              <Plus size={18} style={{ color: "oklch(0.82 0.15 200)" }} />
            </div>
            <p className="text-sm mb-4" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'Inter', sans-serif" }}>No projects yet.</p>
            <Link href="/admin/projects/new">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "oklch(0.82 0.15 200 / 15%)", color: "oklch(0.82 0.15 200)", fontFamily: "'Inter', sans-serif" }}
              >
                Add your first project
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => {
              const catColor = CATEGORY_COLORS[project.category ?? "personal"] ?? CATEGORY_COLORS["personal"];
              return (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                  style={{ background: "oklch(0.10 0.012 265)", borderColor: "oklch(1 0 0 / 8%)" }}
                >
                  {/* Category badge */}
                  <span
                    className="px-2 py-0.5 rounded text-xs flex-shrink-0 capitalize"
                    style={{ background: catColor.bg, color: catColor.text, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {project.category}
                  </span>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate" style={{ color: "oklch(0.88 0.005 240)", fontFamily: "'Inter', sans-serif" }}>
                        {project.title}
                      </span>
                      {project.isFeatured && (
                        <Star size={11} fill="currentColor" style={{ color: "oklch(0.82 0.15 200)", flexShrink: 0 }} />
                      )}
                      {project.isPrivate && (
                        <Lock size={11} style={{ color: "oklch(0.52 0.015 250)", flexShrink: 0 }} />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {project.stars != null && project.stars > 0 && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                          <Star size={9} fill="currentColor" /> {project.stars}
                        </span>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs"
                          style={{ color: "oklch(0.52 0.015 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                          <Github size={9} /> GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Toggle featured */}
                    <button
                      onClick={() => toggleFeatured.mutate({ id: project.id, isFeatured: !project.isFeatured })}
                      disabled={toggleFeatured.isPending}
                      className="p-2 rounded-lg transition-colors"
                      title={project.isFeatured ? "Remove from featured" : "Mark as featured"}
                      style={{ color: project.isFeatured ? "oklch(0.82 0.15 200)" : "oklch(0.52 0.015 250)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "oklch(0.82 0.15 200 / 8%)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <Star size={14} fill={project.isFeatured ? "currentColor" : "none"} />
                    </button>

                    {/* Edit */}
                    <Link href={`/admin/projects/${project.id}`}>
                      <button
                        className="p-2 rounded-lg transition-colors"
                        title="Edit"
                        style={{ color: "oklch(0.52 0.015 250)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "oklch(0.82 0.15 200)"; e.currentTarget.style.background = "oklch(0.82 0.15 200 / 8%)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "oklch(0.52 0.015 250)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <Edit size={14} />
                      </button>
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      disabled={deleteProject.isPending}
                      className="p-2 rounded-lg transition-colors"
                      title="Delete"
                      style={{ color: "oklch(0.52 0.015 250)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "oklch(0.65 0.15 25)"; e.currentTarget.style.background = "oklch(0.65 0.15 25 / 8%)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "oklch(0.52 0.015 250)"; e.currentTarget.style.background = "transparent"; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
