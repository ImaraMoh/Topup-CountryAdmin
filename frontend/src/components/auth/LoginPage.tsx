"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localStorage.getItem("country-admin-session") === "active" || sessionStorage.getItem("country-admin-session") === "active") router.replace("/overview");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username !== "admin.login" || password !== "Admin@123") {
      setError("That username or password doesn’t match. Please try again.");
      return;
    }
    const remember = (document.getElementById("remember-login") as HTMLInputElement | null)?.checked ?? true;
    if (remember) {
      localStorage.setItem("country-admin-session", "active");
      sessionStorage.removeItem("country-admin-session");
    } else {
      sessionStorage.setItem("country-admin-session", "active");
      localStorage.removeItem("country-admin-session");
    }
    router.push("/overview");
  }

  const showHelp = () => setHelpMessage("For this demo, use the credentials shown in the Demo access box.");

  return <main className="login-shell">
    <section className="login-card">
      <Brand/>
      <div className="login-art"><div className="globe"><span className="globe-lines"/><span className="globe-dot">✦</span></div><span className="float-card card-top"><span className="mini-dot"/> Global operations</span><span className="float-card card-bottom"><span className="mini-shield">✓</span> Secure access</span></div>
      <div className="login-copy"><div className="eyebrow">YOUR WORLD, IN ONE PLACE</div><h1>One view.<br/><span>Every country.</span></h1><p>Manage your global operations with clarity, confidence, and control.</p></div>
      <div className="login-foot"><span>© 2026 Country Admin</span><span><i/> All systems operational</span></div>
    </section>
    <section className="login-form-side">
      <div className="form-top"><span>New to Country Admin?</span><button onClick={showHelp}>Get started ↗</button></div>
      <div className="form-wrap"><div className="welcome-icon">✳</div><div className="eyebrow">WELCOME BACK</div><h2>Sign in to your account</h2><p className="form-intro">Enter your credentials to access your workspace.</p>
        <form onSubmit={login}>
          <label htmlFor="username">Username</label><div className="input-wrap"><span className="input-icon">♙</span><input id="username" value={username} onChange={event => setUsername(event.target.value)} placeholder="Enter your username" autoComplete="username" required/></div>
          <div className="password-label"><label htmlFor="password">Password</label><button type="button" onClick={showHelp}>Forgot password?</button></div>
          <div className="input-wrap"><span className="input-icon">♙</span><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required/><button className="eye-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? "Hide" : "Show"}</button></div>
          {error && <div className="login-error" role="alert">{error}</div>}
          <div className="remember-row"><label className="check-label"><input id="remember-login" type="checkbox" defaultChecked/><span/>Remember me</label><span className="secure-note">⌑ Secure connection</span></div>
          <button className="sign-in" type="submit">Sign in <span>→</span></button>
        </form>
        {helpMessage && <div className="help-message" role="status">{helpMessage}</div>}
        <div className="demo-hint"><span>✳</span><div><strong>Demo access</strong><br/>Username: <code>admin.login</code> &nbsp;·&nbsp; Password: <code>Admin@123</code></div></div>
      </div>
      <div className="form-footer"><span>Protected by enterprise-grade security</span><button onClick={showHelp}>Need help?</button></div>
    </section>
  </main>;
}

export function Brand({ onClick }: { onClick?: () => void }) {
  const content = <><span className="brand-icon">C</span><span>country<span className="brand-light">admin</span></span></>;
  return onClick ? <button className="brand-mark side-brand" onClick={onClick}>{content}</button> : <div className="brand-mark">{content}</div>;
}
