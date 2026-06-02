import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const utils = trpc.useUtils();
  const { data: settingsMap, isLoading } = trpc.settings.getAll.useQuery();

  const [form, setForm] = useState({
    availabilityBannerEnabled: true,
    availabilityBannerText: "Open to new opportunities",
    siteTitle: "Jacob LeCoq",
    siteTagline: "Senior Staff Software Engineer",
    contactEmail: "lecoqjacob@gmail.com",
    githubUrl: "https://github.com/HexSleeves",
    linkedinUrl: "https://linkedin.com/in/jacob-lecoq",
    twitterUrl: "",
  });

  useEffect(() => {
    if (settingsMap) {
      setForm({
        availabilityBannerEnabled:
          settingsMap.availabilityBannerEnabled === "true" ||
          settingsMap.availabilityBannerEnabled === undefined
            ? true
            : settingsMap.availabilityBannerEnabled === "true",
        availabilityBannerText:
          settingsMap.availabilityBannerText ?? "Open to new opportunities",
        siteTitle: settingsMap.siteTitle ?? "Jacob LeCoq",
        siteTagline:
          settingsMap.siteTagline ?? "Senior Staff Software Engineer",
        contactEmail: settingsMap.contactEmail ?? "lecoqjacob@gmail.com",
        githubUrl: settingsMap.githubUrl ?? "https://github.com/HexSleeves",
        linkedinUrl:
          settingsMap.linkedinUrl ?? "https://linkedin.com/in/jacob-lecoq",
        twitterUrl: settingsMap.twitterUrl ?? "",
      });
    }
  }, [settingsMap]);

  const updateSettings = trpc.settings.setBatch.useMutation({
    onSuccess: () => {
      toast.success("Settings saved!");
      utils.settings.getAll.invalidate();
    },
    onError: (err: { message?: string }) =>
      toast.error(err.message || "Failed to save settings"),
  });

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

  if (isLoading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center py-16">
          <div className="size-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings">
      <div className="max-w-2xl space-y-6">
        {/* Save */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              updateSettings.mutate([
                {
                  key: "availabilityBannerEnabled",
                  value: String(form.availabilityBannerEnabled),
                },
                {
                  key: "availabilityBannerText",
                  value: form.availabilityBannerText,
                },
                { key: "siteTitle", value: form.siteTitle },
                { key: "siteTagline", value: form.siteTagline },
                { key: "contactEmail", value: form.contactEmail },
                { key: "githubUrl", value: form.githubUrl },
                { key: "linkedinUrl", value: form.linkedinUrl },
                { key: "twitterUrl", value: form.twitterUrl },
              ])
            }
            disabled={updateSettings.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "oklch(0.82 0.15 200)",
              color: "oklch(0.085 0.012 265)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {updateSettings.isPending ? (
              <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save Settings
          </button>
        </div>

        {/* Availability Banner */}
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{
            background: "oklch(0.10 0.012 265)",
            borderColor: "oklch(1 0 0 / 8%)",
          }}
        >
          <h3
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Availability Banner
          </h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.availabilityBannerEnabled}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  availabilityBannerEnabled: e.target.checked,
                }))
              }
              className="size-4 rounded"
              style={{ accentColor: "oklch(0.82 0.15 200)" }}
            />
            <span
              className="text-sm"
              style={{
                color: "oklch(0.82 0.005 240)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Show availability banner on all pages
            </span>
          </label>
          <div>
            <label
              htmlFor="settings-banner-text"
              className="block text-xs mb-1"
              style={labelStyle}
            >
              Banner Message
            </label>
            <input
              id="settings-banner-text"
              type="text"
              value={form.availabilityBannerText}
              onChange={e =>
                setForm(f => ({ ...f, availabilityBannerText: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Site Identity */}
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{
            background: "oklch(0.10 0.012 265)",
            borderColor: "oklch(1 0 0 / 8%)",
          }}
        >
          <h3
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Site Identity
          </h3>
          <div>
            <label
              htmlFor="settings-site-title"
              className="block text-xs mb-1"
              style={labelStyle}
            >
              Site Title
            </label>
            <input
              id="settings-site-title"
              type="text"
              value={form.siteTitle}
              onChange={e =>
                setForm(f => ({ ...f, siteTitle: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              htmlFor="settings-tagline"
              className="block text-xs mb-1"
              style={labelStyle}
            >
              Tagline
            </label>
            <input
              id="settings-tagline"
              type="text"
              value={form.siteTagline}
              onChange={e =>
                setForm(f => ({ ...f, siteTagline: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Contact & Social */}
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{
            background: "oklch(0.10 0.012 265)",
            borderColor: "oklch(1 0 0 / 8%)",
          }}
        >
          <h3
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              color: "oklch(0.52 0.015 250)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Contact & Social
          </h3>
          <div>
            <label
              htmlFor="settings-contact-email"
              className="block text-xs mb-1"
              style={labelStyle}
            >
              Contact Email
            </label>
            <input
              id="settings-contact-email"
              type="email"
              value={form.contactEmail}
              onChange={e =>
                setForm(f => ({ ...f, contactEmail: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              htmlFor="settings-github-url"
              className="block text-xs mb-1"
              style={labelStyle}
            >
              GitHub URL
            </label>
            <input
              id="settings-github-url"
              type="url"
              value={form.githubUrl}
              onChange={e =>
                setForm(f => ({ ...f, githubUrl: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              htmlFor="settings-linkedin-url"
              className="block text-xs mb-1"
              style={labelStyle}
            >
              LinkedIn URL
            </label>
            <input
              id="settings-linkedin-url"
              type="url"
              value={form.linkedinUrl}
              onChange={e =>
                setForm(f => ({ ...f, linkedinUrl: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              htmlFor="settings-twitter-url"
              className="block text-xs mb-1"
              style={labelStyle}
            >
              Twitter / X URL
            </label>
            <input
              id="settings-twitter-url"
              type="url"
              value={form.twitterUrl}
              onChange={e =>
                setForm(f => ({ ...f, twitterUrl: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
