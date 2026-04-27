import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created. Welcome to Trip Genie!");
      navigate("/generate", { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      icon: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      icon: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 7L2 7" />
        </svg>
      ),
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      placeholder: "Min 6 characters",
      icon: (color) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 md:grid-cols-5">
        {/* ── Left illustration panel ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-500 via-cyan-500 to-sky-500 p-8 text-white md:col-span-2 md:flex">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-black leading-tight">
              Start your journey today
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Create your account in seconds and let AI plan your next unforgettable adventure.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              "AI-generated itineraries in seconds",
              "Smart budget & hotel recommendations",
              "Regenerate any section instantly",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/90">{perk}</span>
              </div>
            ))}
          </div>

          <motion.div
            className="pointer-events-none absolute bottom-6 right-6 text-5xl opacity-20"
            animate={{ y: [-6, 6, -6], rotate: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            🌍
          </motion.div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex flex-col justify-center p-8 md:col-span-3 md:p-12">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Create account</h1>
            <p className="mt-1 text-sm text-slate-500">
              It's free. No credit card required.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {f.label}
                </label>
                <div className={`flex items-center gap-3 rounded-xl border-2 bg-slate-50 px-4 py-3 transition ${focused === f.key ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" : "border-slate-200"}`}>
                  {f.icon(focused === f.key ? "#6366f1" : "#94a3b8")}
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                    onFocus={() => setFocused(f.key)}
                    onBlur={() => setFocused("")}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
            ))}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <motion.div
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">Already have an account?</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <Link
            to="/login"
            className="mt-4 block rounded-xl border-2 border-slate-200 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
