import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../axiosConfig";
import ForumLayout from "../Components/ForumLayout";

function AnswerPage() {
  const { questionId } = useParams();
  const token = localStorage.getItem("token");
  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadAnswers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!questionId) {
        const { data } = await axios.get("questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(data.questions);
        return;
      }
      const { data } = await axios.get(`questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion(data.question);
      setAnswers(data.answers);
    } catch (requestError) {
      setError(requestError.response?.data?.msg || (questionId ? "Unable to load this question and its answers." : "Unable to load questions."));
    } finally {
      setLoading(false);
    }
  }, [questionId, token]);

  useEffect(() => { loadAnswers(); }, [loadAnswers]);

  async function handleSubmit(event) {
    event.preventDefault();
    const answer = answerText.trim();
    if (!answer) {
      setAnswerError("Write an answer before posting.");
      return;
    }
    setSubmitting(true);
    setAnswerError("");
    try {
      const { data } = await axios.post(`questions/${questionId}/answers`, { answer }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers((current) => [...current, data.answer]);
      setAnswerText("");
    } catch (requestError) {
      setAnswerError(requestError.response?.data?.msg || "Unable to post your answer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ForumLayout>
      {questionId ? <Link className="back-link" to={`/questions/${questionId}`}>&lt; Back to question</Link> : <Link className="back-link" to="/questions">&lt; All questions</Link>}
      {!questionId && <div className="questions-heading"><div><span className="eyebrow">Evangadi community</span><h1>Answer a question</h1><p>Choose a question to read it and post your answer.</p></div></div>}
      {loading && <p className="page-message">{questionId ? "Loading answers..." : "Loading questions..."}</p>}
      {error && <p className="form-alert" role="alert">{error}</p>}
      {!loading && !error && !questionId && questions.length === 0 && <section className="empty-state"><h2>No questions to answer yet</h2><p>New questions will appear here.</p><Link className="button button-blue" to="/questions">Browse questions</Link></section>}
      {!loading && !error && !questionId && questions.length > 0 && <div className="answer-question-picker">
        {questions.map((item) => <article className="question-list-card" key={item.questionid}>
          <div className="answer-count"><strong>{item.answerCount}</strong><span>answers</span></div>
          <div className="question-list-copy">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Link className="button button-orange" to={`/questions/${item.questionid}/answers`}>Answer this question</Link>
          </div>
        </article>)}
      </div>}
      {!loading && question && <>
        <article className="question-detail-card answer-question-summary">
          <span className="eyebrow">Question</span>
          <h1>{question.title}</h1>
          <p className="question-detail-description">{question.description}</p>
          <span className="question-meta">Asked by {question.username || "Community member"}</span>
        </article>
        <section className="answers-section">
          <h2>{answers.length} {answers.length === 1 ? "Answer" : "Answers"}</h2>
          {answers.length === 0 && <p className="page-message">No answers yet. Be the first to help.</p>}
          <div className="answer-list">
            {answers.map((item) => <article className="answer-card" key={item.answerid}>
              <p>{item.answer}</p>
              <span className="question-meta">Answered by {item.username || "Community member"}</span>
            </article>)}
          </div>
        </section>
        <section className="answer-form-card">
          <h2>Your Answer</h2>
          <form onSubmit={handleSubmit} noValidate>
            <label className="visually-hidden" htmlFor="answer-text">Your answer</label>
            <textarea id="answer-text" maxLength={300} placeholder="Write your answer (up to 300 characters)..." value={answerText} onChange={(event) => { setAnswerText(event.target.value); setAnswerError(""); }} />
            {answerError && <p className="form-alert" role="alert">{answerError}</p>}
            <button className="button button-blue" disabled={submitting} type="submit">{submitting ? "Posting..." : "Post Your Answer"}</button>
          </form>
        </section>
      </>}
    </ForumLayout>
  );
}

export default AnswerPage;
