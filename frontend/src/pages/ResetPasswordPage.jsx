import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialToken = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requestingToken, setRequestingToken] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const onRequestToken = async (e) => {
    e.preventDefault();
    setRequestingToken(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      const resetToken = res.data?.data?.resetToken || "";
      setToken(resetToken);
      const message = resetToken
        ? "Reset token created. Paste it below to finish password reset."
        : "If your account exists, a reset token has been generated.";
      setSuccess(message);
      toast.success("Reset request sent.");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to request reset token";
      setError(message);
      toast.error(message);
    } finally {
      setRequestingToken(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setResettingPassword(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/auth/reset-password", { token, password });
      const message = res.data.message || "Password reset successful";
      setSuccess(message);
      toast.success(message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password";
      setError(message);
      toast.error(message);
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">Reset your password</h1>
      <p className="mt-2 text-sm text-slate-600">Request a reset token and set your new password from this page.</p>
      <form onSubmit={onRequestToken} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">Step 1: Request reset token</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="field w-full rounded-xl px-4 py-3 text-sm"
          required
        />
        <button type="submit" disabled={requestingToken} className="btn-secondary w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60">
          {requestingToken ? "Requesting..." : "Request reset token"}
        </button>
      </form>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <p className="text-sm font-semibold text-slate-700">Step 2: Set new password</p>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value.trim())}
          placeholder="Reset token"
          className="field min-h-24 w-full rounded-xl px-4 py-3 text-sm"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min 6 chars)"
          className="field w-full rounded-xl px-4 py-3 text-sm"
          minLength={6}
          required
        />
        <button type="submit" disabled={resettingPassword} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60">
          {resettingPassword ? "Resetting..." : "Reset password"}
        </button>
      </form>
      {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}
      <Link to="/login" className="mt-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline">
        Back to login
      </Link>
    </div>
  );
}

export default ResetPasswordPage;
