"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/components/shared/Icon";
import { useBrandLogo } from "@/components/shared/brand-logo";
import styles from "./LoginPage.module.css";

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

  return <main className={`${styles.root} login-shell login-single-shell`}>
    <section className="login-single-card" aria-labelledby="login-title">
      <div className="login-card-decoration" aria-hidden="true"><i/><i/><i/></div>
      <Brand/>
      <div className="login-single-heading"><span className="welcome-icon"><Icon name="sparkles"/></span><h1 id="login-title">Welcome back</h1></div>
      <form onSubmit={login}>
        <label htmlFor="username">Username</label><div className="input-wrap"><span className="input-icon"><Icon name="user"/></span><input id="username" value={username} onChange={event => setUsername(event.target.value)} placeholder="Enter your username" autoComplete="username" required/></div>
        <div className="password-label"><label htmlFor="password">Password</label><button type="button" onClick={showHelp}>Forgot password?</button></div>
        <div className="input-wrap"><span className="input-icon"><Icon name="shield"/></span><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required/><button className="eye-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? "Hide" : "Show"}</button></div>
        {error && <div className="login-error" role="alert">{error}</div>}
        <div className="remember-row"><label className="check-label"><input id="remember-login" type="checkbox" defaultChecked/><span/>Remember me</label></div>
        <button className="sign-in" type="submit">Sign in <Icon name="arrow-right" size={17}/></button>
      </form>
      {helpMessage && <div className="help-message" role="status">{helpMessage}</div>}
      <div className="demo-hint"><span><Icon name="sparkles" size={17}/></span><div><strong>Demo access</strong><br/><span>Username: <code>admin.login</code> &nbsp;·&nbsp; Password: <code>Admin@123</code></span></div></div>
    </section>
  </main>;
}

export function Brand({ onClick }: { onClick?: () => void }) {
  const uploadedLogo = useBrandLogo();
  const content = <><span className={`brand-icon ${uploadedLogo ? "has-uploaded-logo" : ""}`}>{uploadedLogo ? <Image src={uploadedLogo} alt="" width={35} height={35} unoptimized className="brand-logo-image"/> : "C"}</span><span>country<span className="brand-light">admin</span></span></>;
  return onClick ? <button className="brand-mark side-brand" onClick={onClick}>{content}</button> : <div className="brand-mark">{content}</div>;
}
