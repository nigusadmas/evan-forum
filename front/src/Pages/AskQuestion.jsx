import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import ForumLayout from "../Components/ForumLayout";

function AskQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(nextTitle = title, nextDescription = description) {
    const next = {};
    if (!nextTitle.trim()) next.title = "Add a short title for your question.";
    else if (nextTitle.trim().length > 70) next.title = "Keep the title under 70 characters.";
    if (!nextDescription.trim()) next.description = "Describe the problem and what you have tried.";
    else if (nextDescription.trim().length > 300) next.description = "Keep the description under 300 characters.";
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("questions", { title: title.trim(), description: description.trim() }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/questions/${data.question.questionid}`);
    } catch (error) {
      setServerError(error.response?.data?.msg || "Unable to post your question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ForumLayout>
      <section className="question-guidance">
        <h1>Steps to write a good question</h1>
        <ul>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </section>
      <section className="ask-card">
        <div className="ask-heading">
          <h2>Ask a public question</h2>
          <Link to="/questions">Go to Question page</Link>
        </div>
        <form className="question-form" onSubmit={handleSubmit} noValidate>
          <label className="visually-hidden" htmlFor="question-title">Title</label>
          <input id="question-title" maxLength={70} placeholder="Title" value={title} onChange={(event) => { setTitle(event.target.value); setErrors(validate(event.target.value, description)); setServerError(""); }} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "question-title-error" : undefined} />
          {errors.title && <p className="field-error" id="question-title-error">{errors.title}</p>}
          <label className="visually-hidden" htmlFor="question-description">Question description</label>
          <textarea id="question-description" maxLength={300} placeholder="Question Description..." value={description} onChange={(event) => { setDescription(event.target.value); setErrors(validate(title, event.target.value)); setServerError(""); }} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "question-description-error" : undefined} />
          {errors.description && <p className="field-error" id="question-description-error">{errors.description}</p>}
          {serverError && <p className="form-alert" role="alert">{serverError}</p>}
          <button className="button button-blue question-submit" disabled={submitting} type="submit">{submitting ? "Posting..." : "Post Your Question"}</button>
        </form>
      </section>
    </ForumLayout>
  );
}

export default AskQuestion;
