import React, { useState } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(values) {
    const next = {};
    if (!values.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Enter your password.";
    return next;
  }

  function updateField(event) {
    const next = { ...form, [event.target.name]: event.target.value };
    setForm(next);
    setErrors(validate(next));
    setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const { data } = await axios.post("users/login", {
        email: form.email.trim(),
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      setServerError(error.response?.data?.msg || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell mode="login">
      <div className="auth-heading">
        <h1>Login to your account</h1>
        <p>Don't have an account? <Link to="/register">Create a new account</Link></p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Field label="Email" name="email" type="email" placeholder="Your Email" value={form.email} error={errors.email} onChange={updateField} autoComplete="email" />
        <Field label="Password" name="password" type="password" placeholder="Your Password" value={form.password} error={errors.password} onChange={updateField} autoComplete="current-password" />
        {serverError && <p className="form-alert" role="alert">{serverError}</p>}
        <button className="button button-orange login-submit" disabled={submitting} type="submit">{submitting ? "Signing in..." : "Sign in"}</button>
        <p className="auth-bottom-link"><Link to="/register">Create an account?</Link></p>
      </form>
    </AuthShell>
  );
}

function Field({ label, name, type, placeholder, value, error, onChange, autoComplete }) {
  const id = `login-${name}`;
  return (
    <div className="form-field">
      <label className="visually-hidden" htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <span className="field-error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}

export function AuthShell({ children, mode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Evangadi home"><b>E</b>VANGADI</Link>
        <nav aria-label="Main navigation"><Link to="/">Home</Link><Link to="/how-it-works">How it Works</Link><Link className="button button-blue nav-button" to="/login">Sign in</Link></nav>
      </header>
      <main className={`auth-main auth-main-${mode}`}>
        <div className="auth-content">
          <section className="auth-card">{children}</section>
          <aside className="about-panel" id="about">
            <span className="eyebrow">About</span>
            <h2>Evangadi Networks Q&amp;A</h2>
            <p>Connect with a community of learners, ask questions, and share what you know.</p>
            <p>Find thoughtful answers and help others work through their toughest questions.</p>
            <p>Learn together, build confidence, and keep moving forward.</p>
            <Link className="button button-orange how-button" to="/how-it-works">How it works</Link>
          </aside>
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div><Link className="wordmark footer-wordmark" to="/" aria-label="Evangadi home"><b>E</b>VANGADI</Link><div className="social-links"><a href="https://www.facebook.com/" aria-label="Facebook">f</a><a href="https://www.instagram.com/" aria-label="Instagram">IG</a><a href="https://www.youtube.com/" aria-label="YouTube">YT</a></div></div>
          <div><h2>Useful Link</h2><Link to="/how-it-works">How it works</Link><a href="#about">Terms of Service</a><a href="#about">Privacy policy</a></div>
          <div><h2>Contact Info</h2><span>Evangadi Networks</span><a href="mailto:support@evangadi.com">support@evangadi.com</a><a href="tel:+12023862702">+1-202-386-2702</a></div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
