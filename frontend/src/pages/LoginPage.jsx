import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      toast.success("Logged in successfully.");
      navigate(location.state?.from?.pathname || "/generate", { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 md:grid-cols-5">
        {/* ── Left illustration panel ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 p-8 text-white md:col-span-2 md:flex">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L4.09 12.63a1 1 0 00.77 1.62H11v5.75a.5.5 0 00.9.3L20.91 9.37a1 1 0 00-.77-1.62H13V2.25a.5.5 0 00-.9-.3L13 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-black leading-tight">
              Welcome back to Trip Genie
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Your AI-powered travel companion. Pick up right where you left off and keep planning amazing trips.
            </p>
          </div>

          {/* Social proof */}
          <div className="mt-8 space-y-3">
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
              <p className="text-sm italic text-white/90">"Generated the perfect 7-day Bali itinerary in under 30 seconds. Mind blown."</p>
              <p className="mt-2 text-xs font-semibold text-white/70">-- Priya, Solo Traveller</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-amber-400", "bg-emerald-400", "bg-rose-400", "bg-sky-400"].map((c, i) => (
                  <div key={i} className={`h-7 w-7 rounded-full border-2 border-white/40 ${c}`} />
                ))}
              </div>
              <p className="text-xs text-white/70">
                <span className="font-semibold text-white">2,000+</span> travellers this month
              </p>
            </div>
          </div>

          {/* Floating emoji */}
          <motion.div
            className="pointer-events-none absolute bottom-6 right-6 text-5xl opacity-20"
            animate={{ y: [-6, 6, -6], rotate: [-5, 5, -5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            ✈️
          </motion.div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex flex-col justify-center p-8 md:col-span-3 md:p-12">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Sign in</h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your email and password to continue
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Email
              </label>
              <div className={`flex items-center gap-3 rounded-xl border-2 bg-slate-50 px-4 py-3 transition ${focused === "email" ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" : "border-slate-200"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={focused === "email" ? "#6366f1" : "#94a3b8"} strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/reset-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Reset password
              </Link>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Password
              </label>
              <div className={`flex items-center gap-3 rounded-xl border-2 bg-slate-50 px-4 py-3 transition ${focused === "password" ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" : "border-slate-200"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={focused === "password" ? "#6366f1" : "#94a3b8"} strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <motion.div
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">New here?</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <Link
            to="/register"
            className="mt-4 block rounded-xl border-2 border-slate-200 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
