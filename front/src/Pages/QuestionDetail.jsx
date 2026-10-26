import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../axiosConfig";
import ForumLayout from "../Components/ForumLayout";

function QuestionDetail() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    axios.get(`questions/${questionId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { if (active) setQuestion(data.question); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.msg || "Unable to load this question."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [questionId]);

  return (
    <ForumLayout>
      <Link className="back-link" to="/questions">&lt; All questions</Link>
      {loading && <p className="page-message">Loading question...</p>}
      {error && <p className="form-alert" role="alert">{error}</p>}
      {!loading && question && <article className="question-detail-card">
        <span className="eyebrow">Question</span>
        <h1>{question.title}</h1>
        <p className="question-detail-description">{question.description}</p>
        <span className="question-meta">Asked by {question.username || "Community member"}</span>
        <Link className="button button-blue answer-page-button" to={`/questions/${question.questionid}/answers`}>
          View answers and write an answer
        </Link>
      </article>}
    </ForumLayout>
  );
}

export default QuestionDetail;
