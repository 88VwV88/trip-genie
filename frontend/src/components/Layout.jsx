import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-indigo-50 text-indigo-600 shadow-sm"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
  }`;

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    toast.success("Logged out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L4.09 12.63a1 1 0 00.77 1.62H11v5.75a.5.5 0 00.9.3L20.91 9.37a1 1 0 00-.77-1.62H13V2.25a.5.5 0 00-.9-.3L13 2z" />
              </svg>
            </span>
            Trip Genie
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-1">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/wall-calendar" className={navClass}>
              Calendar
            </NavLink>
            {user ? (
              <>
                <NavLink to="/generate" className={navClass}>
                  Generate
                </NavLink>
                <NavLink to="/saved-trips" className={navClass}>
                  Saved
                </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

export default Layout;
