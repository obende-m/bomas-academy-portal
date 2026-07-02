import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Loader2, Trash2, Plus, Upload, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/use-auth";
import { uploadMedia } from "@/lib/media";
import { DEFAULTS } from "@/lib/use-site-content";
import logoAsset from "@/assets/bomas-logo.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin - Bomas Academy" }] }),
  component: AdminPage,
});

type Tab = "content" | "downloads" | "staff" | "gallery" | "news";

function AdminPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(session?.user?.id);
  const [tab, setTab] = useState<Tab>("content");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || (session && roleLoading)) {
    return (
      <div className="min-h-[60svh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="container-wide pt-10 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 group">
          <img src={logoAsset} alt="" className="h-10 w-10 rounded-full ring-1 ring-border transition-transform group-hover:rotate-[6deg]" />
          <div>
            <h1 className="font-display text-2xl">Admin dashboard</h1>
            <p className="text-xs text-muted-foreground">Signed in as {session.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
            ← Home
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {!isAdmin ? (
        <div className="mt-12 rounded-2xl border border-border bg-secondary/60 p-8">
          <h2 className="font-display text-2xl">Not an admin yet</h2>
          <p className="mt-2 text-muted-foreground">
            Your account is signed in but doesn't have admin permissions yet. Open the Cloud
            backend, find your user in the <code className="rounded bg-background px-1.5 py-0.5">user_roles</code> table,
            and insert a row with your user id and role <code className="rounded bg-background px-1.5 py-0.5">admin</code>.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">Your user id: <code className="rounded bg-background px-1.5 py-0.5">{session.user.id}</code></p>
          <Link to="/" className="mt-6 inline-block text-sm text-accent">Back to site</Link>
        </div>
      ) : (
        <>
          <div className="mt-10 flex gap-1 border-b border-border overflow-x-auto">
            {(["content", "downloads", "staff", "gallery", "news"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-colors relative ${
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {tab === t && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-accent rounded-full" />}
              </button>
            ))}
          </div>
          <div className="mt-10">
            {tab === "content" && <ContentEditor />}
            {tab === "downloads" && <DownloadsManager />}
            {tab === "staff" && <StaffEditor />}
            {tab === "gallery" && <GalleryEditor />}
            {tab === "news" && <NewsEditor />}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------- Content editor -------------------- */

function DocumentUploader({ onUpload, disabled }: { onUpload: (name: string, url: string) => void; disabled?: boolean }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file, "downloads");
      const displayName = file.name.split(".").slice(0, -1).join(" ").replace(/[-_]/g, " ");
      onUpload(displayName, url);
      toast.success("Document uploaded successfully!");
    } catch (err: unknown) {
      console.error("Upload error:", err);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <label className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {uploading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Upload className="h-3 w-3" />
      )}
      Upload Document (PDF/Doc)
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading || disabled}
      />
    </label>
  );
}

function DownloadsListEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const items = value
    .split("\n")
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split("|");
      const title = parts[0]?.trim() || "";
      const url = parts.slice(1).join("|")?.trim() || "";
      return { id: `${index}-${title}`, title, url };
    });

  const updateItems = (newItems: typeof items) => {
    const serialized = newItems
      .map(item => `${item.title.trim()} | ${item.url.trim()}`)
      .join("\n");
    onChange(serialized);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const next = [...items];
    next[index] = { ...next[index], title: newTitle };
    updateItems(next);
  };

  const handleUrlChange = (index: number, newUrl: string) => {
    const next = [...items];
    next[index] = { ...next[index], url: newUrl };
    updateItems(next);
  };

  const handleDelete = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    updateItems(next);
  };

  const handleAddManual = () => {
    const next = [...items, { id: String(Date.now()), title: "New Document", url: "" }];
    updateItems(next);
  };

  return (
    <div className="w-full space-y-4 rounded-xl border border-border bg-secondary/20 p-4">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Document Title (e.g. 2026 Prospectus)"
                  value={item.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-sm font-medium"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Document URL (https://...)"
                    value={item.url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground font-mono"
                  />
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent hover:underline shrink-0"
                    >
                      Open Link
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive/10 shrink-0 self-end sm:self-center"
                title="Delete document"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <DocumentUploader
          onUpload={(fileName, url) => {
            const next = [...items, { id: String(Date.now()), title: fileName, url }];
            updateItems(next);
          }}
        />
        <button
          type="button"
          onClick={handleAddManual}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add Link Manually
        </button>
      </div>
    </div>
  );
}

function DownloadsManager() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site_content_downloads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      const map: Record<string, string> = { ...DEFAULTS };
      for (const r of data ?? []) map[r.key] = r.value;
      return map;
    },
  });

  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  if (isLoading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground text-center my-10" />;
  }

  const save = async (key: string) => {
    setSaving(key);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: values[key] ?? "" }, { onConflict: "key" });
      if (error) throw error;
      toast.success("Saved successfully");
      qc.invalidateQueries({ queryKey: ["site_content"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl">Manage Downloads Page</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure the downloads page title, introduction text, and uploaded files.
        </p>
      </div>

      <div className="grid gap-6 rounded-2xl border border-border bg-secondary/30 p-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Page Title</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={values["downloads.title"] ?? ""}
              onChange={(e) => setValues({ ...values, "downloads.title": e.target.value })}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Downloads"
            />
            <button
              onClick={() => save("downloads.title")}
              disabled={saving === "downloads.title"}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground hover:bg-navy-deep disabled:opacity-60 shrink-0"
            >
              {saving === "downloads.title" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save
            </button>
          </div>
        </div>

        {/* Intro */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Page Introduction</label>
          <div className="flex gap-3 items-end">
            <textarea
              rows={2}
              value={values["downloads.intro"] ?? ""}
              onChange={(e) => setValues({ ...values, "downloads.intro": e.target.value })}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
              placeholder="Forms, prospectuses and policy documents for Bomas Academy families."
            />
            <button
              onClick={() => save("downloads.intro")}
              disabled={saving === "downloads.intro"}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground hover:bg-navy-deep disabled:opacity-60 shrink-0 mb-0.5"
            >
              {saving === "downloads.intro" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Document Downloads</label>
            <button
              onClick={() => save("downloads.items")}
              disabled={saving === "downloads.items"}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground hover:bg-navy-deep disabled:opacity-60"
            >
              {saving === "downloads.items" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              Save Document List
            </button>
          </div>
          <DownloadsListEditor
            value={values["downloads.items"] ?? ""}
            onChange={(newValue) => setValues({ ...values, "downloads.items": newValue })}
          />
        </div>
      </div>
    </div>
  );
}

function ContentEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site_content_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error) throw error;
      const map: Record<string, string> = { ...DEFAULTS };
      for (const r of data ?? []) map[r.key] = r.value;
      return map;
    },
  });
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  useEffect(() => { if (data) setValues(data); }, [data]);

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;

  const groups: Record<string, string[]> = {};
  for (const key of Object.keys(values).sort()) {
    const group = key.split(".")[0];
    if (group === "downloads") continue; // Exclude downloads from generic content editor
    (groups[group] ||= []).push(key);
  }

  const save = async (key: string) => {
    setSaving(key);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: values[key] ?? "" }, { onConflict: "key" });
      if (error) throw error;
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["site_content"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-12">
      <p className="text-sm text-muted-foreground max-w-2xl">
        Edit any block of text on the website. Changes appear immediately. Use the multi-line fields for longer copy and bullet lists (one item per line).
      </p>
      {Object.entries(groups).map(([group, keys]) => (
        <section key={group}>
          <h3 className="font-display text-xl capitalize border-b border-border pb-2">{group}</h3>
          <div className="mt-6 space-y-6">
            {keys.map((k) => {
              const isLong = (values[k]?.length ?? 0) > 80 || k.endsWith(".body") || k.endsWith(".story") || k.endsWith(".steps") || k.endsWith(".subtitle") || k.endsWith(".intro") || k.endsWith(".mission") || k.endsWith(".vision") || k.endsWith(".address") || k.endsWith(".items");
              return (
                <div key={k} className="grid gap-2 md:grid-cols-[280px_1fr_auto] md:items-start">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono pt-3">{k}</label>
                  </div>
                  {k === "downloads.items" ? (
                    <DownloadsListEditor
                      value={values[k] ?? ""}
                      onChange={(newValue) => setValues({ ...values, [k]: newValue })}
                    />
                  ) : isLong ? (
                    <textarea
                      rows={Math.max(3, Math.min(10, Math.ceil((values[k]?.length ?? 0) / 80)))}
                      value={values[k] ?? ""}
                      onChange={(e) => setValues({ ...values, [k]: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      value={values[k] ?? ""}
                      onChange={(e) => setValues({ ...values, [k]: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  )}
                  <button
                    onClick={() => save(k)}
                    disabled={saving === k}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground hover:bg-navy-deep disabled:opacity-60"
                  >
                    {saving === k ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    Save
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* -------------------- Staff editor -------------------- */

const BLANK_STAFF = { name: "", position: "", bio: "", photo_url: "", sort_order: 0 };

function StaffEditor() {
  const qc = useQueryClient();
  const { data: staff } = useQuery({
    queryKey: ["staff_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
  const [form, setForm] = useState(BLANK_STAFF);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => { qc.invalidateQueries({ queryKey: ["staff_admin"] }); qc.invalidateQueries({ queryKey: ["staff"] }); };

  const startEdit = (s: NonNullable<typeof staff>[number]) => {
    setEditingId(s.id);
    setForm({ name: s.name, position: s.position, bio: s.bio ?? "", photo_url: s.photo_url ?? "", sort_order: s.sort_order ?? 0 });
  };

  const cancelEdit = () => { setEditingId(null); setForm(BLANK_STAFF); };

  const save = async () => {
    if (!form.name || !form.position) return toast.error("Name and position required");
    setBusy(true);
    const payload = { ...form };
    const { error } = editingId
      ? await supabase.from("staff").update(payload).eq("id", editingId)
      : await supabase.from("staff").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Staff updated" : "Staff added");
    cancelEdit();
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (editingId === id) cancelEdit();
    refresh();
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file, "staff");
      setForm((f) => ({ ...f, photo_url: url }));
      toast.success("Photo uploaded");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-border p-6 bg-secondary/40">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">{editingId ? "Edit staff member" : "Add a staff member"}</h3>
          {editingId && (
            <button onClick={cancelEdit} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          )}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
          <input placeholder="Position (e.g. Head Teacher)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
          <textarea placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="md:col-span-2 rounded-md border border-border bg-background px-3 py-2 text-sm" rows={3} />
          <label className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm cursor-pointer hover:bg-secondary">
            <Upload className="h-4 w-4" />
            {form.photo_url ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </label>
          <div className="flex items-center gap-3">
            {form.photo_url && <img src={form.photo_url} alt="" className="h-16 w-16 rounded-full object-cover" />}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Sort order (lower = appears first)</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        <button disabled={busy} onClick={save} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-navy-deep disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Save changes" : "Add staff"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff?.map((s) => (
          <div key={s.id} className={`rounded-xl border overflow-hidden bg-card transition-colors ${editingId === s.id ? "border-accent" : "border-border"}`}>
            <div className="aspect-[4/3] bg-secondary">
              {s.photo_url ? <img src={s.photo_url} alt={s.name} className="h-full w-full object-cover" /> : <div className="h-full w-full marquee-gold" />}
            </div>
            <div className="p-4">
              <div className="font-display text-lg">{s.name}</div>
              <div className="text-xs uppercase tracking-widest text-accent">{s.position}</div>
              {s.sort_order != null && <div className="mt-1 text-xs text-muted-foreground">Order: {s.sort_order}</div>}
              {s.bio && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.bio}</p>}
              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => startEdit(s)} className="inline-flex items-center gap-1 text-xs hover:underline">
                  Edit
                </button>
                <button onClick={() => remove(s.id)} className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Gallery editor -------------------- */

function GalleryEditor() {
  const qc = useQueryClient();
  const { data: images } = useQuery({
    queryKey: ["gallery_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const [busy, setBusy] = useState(false);

  const refresh = () => { qc.invalidateQueries({ queryKey: ["gallery_admin"] }); qc.invalidateQueries({ queryKey: ["gallery"] }); };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadMedia(file, "gallery");
        const { error } = await supabase.from("gallery_images").insert({ image_url: url, title: "" });
        if (error) throw error;
      }
      toast.success("Images uploaded");
      refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally { setBusy(false); e.target.value = ""; }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this image?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  return (
    <div className="space-y-8">
      <label className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-navy-deep cursor-pointer disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Upload images
        <input type="file" multiple accept="image/*" className="hidden" onChange={onUpload} disabled={busy} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images?.map((img) => (
          <div key={img.id} className="group relative overflow-hidden rounded-xl">
            <img src={img.image_url} alt={img.title ?? ""} className="aspect-square w-full object-cover" />
            <button onClick={() => remove(img.id)} className="absolute top-2 right-2 rounded-full bg-background/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- News editor -------------------- */

function NewsEditor() {
  const qc = useQueryClient();
  const { data: posts } = useQuery({
    queryKey: ["news_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_posts").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const [editing, setEditing] = useState<string | "new" | null>(null);

  const refresh = () => { qc.invalidateQueries({ queryKey: ["news_admin"] }); qc.invalidateQueries({ queryKey: ["news_list"] }); qc.invalidateQueries({ queryKey: ["news_home"] }); };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  return (
    <div className="space-y-8">
      <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-navy-deep">
        <Plus className="h-4 w-4" /> New post
      </button>

      {editing && (
        <NewsForm
          post={editing === "new" ? null : posts?.find((p) => p.id === editing) ?? null}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh(); }}
        />
      )}

      <div className="divide-y divide-border border-y border-border">
        {posts?.map((p) => (
          <div key={p.id} className="py-5 flex items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="font-display text-lg truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">
                {p.published ? "Published" : "Draft"} · {new Date(p.published_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setEditing(p.id)} className="text-sm hover:underline">Edit</button>
              <button onClick={() => remove(p.id)} className="text-sm text-destructive hover:underline inline-flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string;
};

function NewsForm({ post, onClose, onSaved }: { post: NewsRow | null; onClose: () => void; onSaved: () => void }) {
  const todayISO = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    cover_image_url: post?.cover_image_url ?? "",
    published: post?.published ?? true,
    published_at: post?.published_at ? post.published_at.split("T")[0] : todayISO,
  });
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const onUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file, "news");
      setForm((f) => ({ ...f, cover_image_url: url }));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally { setBusy(false); }
  };

  const onUploadBodyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file, "news");
      const textarea = bodyRef.current;
      const insert = `\n![](${url})\n`;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newBody = form.body.substring(0, start) + insert + form.body.substring(end);
        setForm((f) => ({ ...f, body: newBody }));
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + insert.length;
          textarea.focus();
        }, 0);
      } else {
        setForm((f) => ({ ...f, body: f.body + insert }));
      }
      toast.success("Image uploaded — inserted at cursor");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally { setBusy(false); e.target.value = ""; }
  };

  const save = async () => {
    const slug = form.slug || slugify(form.title);
    if (!form.title || !slug) return toast.error("Title required");
    setBusy(true);
    const payload = { ...form, slug };
    const { error } = post
      ? await supabase.from("news_posts").update(payload).eq("id", post.id)
      : await supabase.from("news_posts").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(post ? "Post updated" : "Post created");
    onSaved();
  };

  return (
    <div className="rounded-2xl border border-border p-6 bg-secondary/40 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl">{post ? "Edit post" : "New post"}</h3>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
      </div>
      <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-base" />
      <input placeholder="URL slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono" />
      <textarea placeholder="Short excerpt (shown on listings)" rows={2} value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Body</span>
          <label className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background px-2.5 py-1 text-xs cursor-pointer hover:bg-secondary">
            <Upload className="h-3 w-3" /> Insert image
            <input type="file" accept="image/*" className="hidden" onChange={onUploadBodyImage} disabled={busy} />
          </label>
        </div>
        <textarea ref={bodyRef} placeholder={"Body: write paragraphs separated by blank lines.\nEmbed images using:  ![alt text](https://image-url.jpg)"} rows={12} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      </div>
      <p className="text-xs text-muted-foreground">Tip: click "Insert image" to upload a photo and drop it at your cursor position in the body.</p>
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm cursor-pointer hover:bg-secondary">
          <Upload className="h-4 w-4" /> {form.cover_image_url ? "Replace cover" : "Upload cover image"}
          <input type="file" accept="image/*" className="hidden" onChange={onUploadCover} />
        </label>
        {form.cover_image_url && <img src={form.cover_image_url} alt="" className="h-16 w-24 rounded object-cover" />}
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span>Date:</span>
          <input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground" />
        </div>
      </div>
      <button onClick={save} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-navy-deep disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save post
      </button>
    </div>
  );
}