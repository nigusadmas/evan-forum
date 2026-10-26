import React, { useState } from "react";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "./Login";

const initialForm = { email: "", firstname: "", lastname: "", username: "", password: "" };

function Field({ name, label, placeholder, type = "text", autoComplete, form, errors, onChange }) {
  const id = `register-${name}`;
  return (
    <div className="form-field">
      <label className="visually-hidden" htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} placeholder={placeholder} value={form[name]} onChange={onChange} autoComplete={autoComplete} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${id}-error` : undefined} />
      {errors[name] && <span className="field-error" id={`${id}-error`}>{errors[name]}</span>}
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(values) {
    const next = {};
    if (!values.email.trim()) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = "Enter a valid email address.";
    if (!values.firstname.trim()) next.firstname = "Enter your first name.";
    else if (!/^[\p{L}][\p{L} '\u2019-]*$/u.test(values.firstname.trim())) next.firstname = "Use letters, spaces, apostrophes, or hyphens only.";
    if (!values.lastname.trim()) next.lastname = "Enter your last name.";
    else if (!/^[\p{L}][\p{L} '\u2019-]*$/u.test(values.lastname.trim())) next.lastname = "Use letters, spaces, apostrophes, or hyphens only.";
    if (!values.username.trim()) next.username = "Choose a username.";
    else if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(values.username.trim())) next.username = "Use 3 to 30 letters, numbers, dots, underscores, or hyphens.";
    if (!values.password) next.password = "Choose a password.";
    else if (values.password.length < 8) next.password = "Use at least 8 characters.";
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
      await axios.post("users/register", {
        username: form.username.trim(),
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", { state: { message: "Your account is ready. Please sign in." } });
    } catch (error) {
      setServerError(error.response?.data?.msg || "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell mode="register">
      <div className="auth-heading">
        <h1>Join the network</h1>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Field name="email" label="Email" placeholder="Email" type="email" autoComplete="email" form={form} errors={errors} onChange={updateField} />
        <div className="form-row">
          <Field name="firstname" label="First name" placeholder="First Name" autoComplete="given-name" form={form} errors={errors} onChange={updateField} />
          <Field name="lastname" label="Last name" placeholder="Last Name" autoComplete="family-name" form={form} errors={errors} onChange={updateField} />
        </div>
        <Field name="username" label="Username" placeholder="User Name" autoComplete="username" form={form} errors={errors} onChange={updateField} />
        <Field name="password" label="Password" placeholder="Password (at least 8 characters)" type="password" autoComplete="new-password" form={form} errors={errors} onChange={updateField} />
        {serverError && <p className="form-alert" role="alert">{serverError}</p>}
        <button className="button button-blue register-submit" disabled={submitting} type="submit">{submitting ? "Creating account..." : "Agree and Join"}</button>
        <p className="policy-copy">By joining, you agree to our <a href="#about">privacy policy</a> and <a href="#about">terms of service</a>.</p>
        <p className="auth-bottom-link"><Link to="/login">Already have an account?</Link></p>
      </form>
    </AuthShell>
  );
}

export default Register;
