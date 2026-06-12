import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

type Tab = "content" | "staff" | "gallery" | "news";

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
            {(["content", "staff", "gallery", "news"] as Tab[]).map((t) => (
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
              const isLong = (values[k]?.length ?? 0) > 80 || k.endsWith(".body") || k.endsWith(".story") || k.endsWith(".steps") || k.endsWith(".subtitle") || k.endsWith(".intro") || k.endsWith(".mission") || k.endsWith(".vision") || k.endsWith(".address");
              return (
                <div key={k} className="grid gap-2 md:grid-cols-[280px_1fr_auto] md:items-start">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono pt-3">{k}</label>
                  {isLong ? (
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
  const [form, setForm] = useState({ name: "", position: "", bio: "", photo_url: "", sort_order: 0 });
  const [busy, setBusy] = useState(false);

  const refresh = () => { qc.invalidateQueries({ queryKey: ["staff_admin"] }); qc.invalidateQueries({ queryKey: ["staff"] }); };

  const addStaff = async () => {
    if (!form.name || !form.position) return toast.error("Name and position required");
    setBusy(true);
    const { error } = await supabase.from("staff").insert({ ...form });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Staff added");
    setForm({ name: "", position: "", bio: "", photo_url: "", sort_order: 0 });
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (error) return toast.error(error.message);
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
        <h3 className="font-display text-xl">Add a staff member</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
          <input placeholder="Position (e.g. Head Teacher)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
          <textarea placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="md:col-span-2 rounded-md border border-border bg-background px-3 py-2 text-sm" rows={3} />
          <label className="inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-2 text-sm cursor-pointer hover:bg-secondary">
            <Upload className="h-4 w-4" />
            {form.photo_url ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </label>
          {form.photo_url && <img src={form.photo_url} alt="" className="h-16 w-16 rounded-full object-cover" />}
        </div>
        <button disabled={busy} onClick={addStaff} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-navy-deep disabled:opacity-60">
          <Plus className="h-4 w-4" /> Add staff
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff?.map((s) => (
          <div key={s.id} className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="aspect-[4/3] bg-secondary">
              {s.photo_url ? <img src={s.photo_url} alt={s.name} className="h-full w-full object-cover" /> : <div className="h-full w-full marquee-gold" />}
            </div>
            <div className="p-4">
              <div className="font-display text-lg">{s.name}</div>
              <div className="text-xs uppercase tracking-widest text-accent">{s.position}</div>
              {s.bio && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.bio}</p>}
              <button onClick={() => remove(s.id)} className="mt-3 inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
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
        const { error } = await supabase.from("gallery_images").insert({ image_url: url, title: file.name.replace(/\.[^.]+$/, "") });
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
      <textarea placeholder={"Body: write paragraphs separated by blank lines.\nEmbed images using:  ![alt text](https://image-url.jpg)"} rows={12} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      <p className="text-xs text-muted-foreground">Tip: paste an image URL inside <code className="rounded bg-background px-1 py-0.5">![caption](url)</code> on its own line to embed it in the post.</p>
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