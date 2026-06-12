import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/bomas-logo.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin sign in - Bomas Academy" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] grid place-items-center bg-secondary/60 px-6 py-8">
      <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-xl shadow-black/5 border border-border">
        <div className="flex items-center gap-3 group">
          <img src={logoAsset} alt="" className="h-10 w-10 rounded-full ring-1 ring-border transition-transform group-hover:rotate-[6deg]" />
          <div>
            <div className="font-display text-lg">Bomas Academy</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Admin area</div>
          </div>
        </div>
        <h1 className="mt-8 font-display text-3xl">{mode === "signin" ? "Sign in" : "Create admin account"}</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md border border-border bg-background px-4 py-3"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-border bg-background px-4 py-3"
          />
          <button
            disabled={loading}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-navy-deep transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Need to create an admin account?" : "Already have an account? Sign in"}
        </button>
        <p className="mt-6 text-xs text-muted-foreground">
          Note: after creating the first account, it must be granted admin permissions from the backend before content can be edited.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}