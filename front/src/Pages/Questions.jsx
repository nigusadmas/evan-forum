import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosConfig";
import ForumLayout from "../Components/ForumLayout";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    axios.get("questions", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { if (active) setQuestions(data.questions); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.msg || "Unable to load questions."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <ForumLayout>
      <div className="questions-heading">
        <div><span className="eyebrow">Evangadi community</span><h1>Questions</h1><p>Browse questions and share what you know.</p></div>
        <Link className="button button-blue" to="/questions/ask">Ask a question</Link>
      </div>
      {loading && <p className="page-message">Loading questions...</p>}
      {error && <p className="form-alert" role="alert">{error}</p>}
      {!loading && !error && questions.length === 0 && <section className="empty-state"><h2>No questions yet</h2><p>Start the conversation by asking the first question.</p><Link className="button button-blue" to="/questions/ask">Ask a question</Link></section>}
      <div className="question-list">
        {questions.map((question) => (
          <article className="question-list-card" key={question.questionid}>
            <div className="answer-count"><strong>{question.answerCount}</strong><span>answers</span></div>
            <div className="question-list-copy">
              <Link to={`/questions/${question.questionid}`}>{question.title}</Link>
              <p>{question.description}</p>
              <div className="question-list-footer">
                <span>Asked by {question.username || "Community member"}</span>
                <Link className="view-answers-link" to={`/questions/${question.questionid}/answers`}>
                  View answers and write an answer
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </ForumLayout>
  );
}

export default Questions;
