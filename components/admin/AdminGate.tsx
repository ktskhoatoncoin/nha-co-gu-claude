"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

// V1 DEMO GATE ONLY.
// This checks a password client-side and is trivially bypassed by anyone
// reading the bundle — it exists only so the admin routes aren't wide open
// in this demo. Before going to production, replace this entirely with
// Supabase Auth (email/password or magic link) checked in middleware.ts,
// so /admin/** never renders without a verified session. See README.md.
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DEMO_PASSWORD || "nhacogu-admin";
const SESSION_KEY = "ncg_admin_authed";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of sessionStorage on mount, required to avoid SSR/CSR mismatch
    setAuthed(window.sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  if (authed === null) return null;

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <div className="flex items-center gap-2 mb-4 text-wood">
          <Lock className="size-5" />
          <span className="text-sm">Khu vực quản trị</span>
        </div>
        <h1 className="font-display text-2xl text-ink mb-6">Đăng nhập Admin</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input === DEMO_PASSWORD) {
              window.sessionStorage.setItem(SESSION_KEY, "1");
              setAuthed(true);
              setError(false);
            } else {
              setError(true);
            }
          }}
          className="space-y-3"
        >
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mật khẩu quản trị"
            className="w-full rounded-md border border-linen px-4 py-2.5 text-sm"
            autoFocus
          />
          {error && <p className="text-sm text-alert">Sai mật khẩu, vui lòng thử lại.</p>}
          <button type="submit" className="w-full rounded-full bg-ink text-paper py-2.5 text-sm">
            Đăng nhập
          </button>
          <p className="text-xs text-stone pt-2">
            Demo V1: mật khẩu mặc định là <code className="bg-ivory px-1 py-0.5 rounded">nhacogu-admin</code> trừ khi
            đã đổi qua biến môi trường NEXT_PUBLIC_ADMIN_DEMO_PASSWORD.
          </p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
