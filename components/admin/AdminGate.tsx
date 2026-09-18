"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [ready, setReady] = useState(() => !hasSupabaseConfig());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      return;
    }
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.subscription.unsubscribe();
  }, []);

  if (!ready) return null;
  if (!hasSupabaseConfig()) {
    return <div className="mx-auto max-w-lg px-4 py-24"><h1 className="font-display text-2xl text-ink mb-4">Admin chưa được cấu hình</h1><p className="text-sm text-stone">Hãy thêm NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY và SUPABASE_SECRET_KEY vào môi trường, sau đó chạy schema trong supabase/schema.sql.</p></div>;
  }
  if (!user) {
    return <div className="mx-auto max-w-sm px-4 py-24"><div className="flex items-center gap-2 mb-4 text-wood"><Lock className="size-5" /><span className="text-sm">Khu vực quản trị</span></div><h1 className="font-display text-2xl text-ink mb-6">Đăng nhập Admin</h1><form onSubmit={async (event) => { event.preventDefault(); setError(null); const { error: signInError } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password }); if (signInError) setError("Email hoặc mật khẩu không đúng."); }} className="space-y-3"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email quản trị" className="w-full rounded-md border border-linen px-4 py-2.5 text-sm" /><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mật khẩu" className="w-full rounded-md border border-linen px-4 py-2.5 text-sm" />{error && <p className="text-sm text-alert">{error}</p>}<button type="submit" className="w-full rounded-full bg-ink text-paper py-2.5 text-sm">Đăng nhập</button></form></div>;
  }
  return <>{children}</>;
}
