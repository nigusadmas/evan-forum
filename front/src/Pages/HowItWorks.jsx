import { Link } from "react-router-dom";
import ForumLayout from "../Components/ForumLayout";

function HowItWorks() {
  return (
    <ForumLayout>
      <article className="guide-page">
        <span className="eyebrow">Evangadi Networks</span>
        <h1>How it works</h1>
        <p className="guide-intro">A place to ask clear questions, learn from the community, and share useful answers.</p>

        <section className="guide-section">
          <span className="guide-step">01</span>
          <div><h2>Ask a question</h2><p>Open <Link to="/questions/ask">Ask a question</Link>, write a short title, and explain the problem in the description. Include what you tried and what result you expected. Select <strong>Post Your Question</strong> to publish it.</p></div>
        </section>
        <section className="guide-section">
          <span className="guide-step">02</span>
          <div><h2>Browse questions</h2><p>Visit the <Link to="/questions">Questions page</Link> to read questions from the community. Each question shows its title, description, author, and answer count. Select a title to read the full question.</p></div>
        </section>
        <section className="guide-section">
          <span className="guide-step">03</span>
          <div><h2>Write an answer</h2><p>Select <strong>View answers and write an answer</strong> on a question, or open <Link to="/questions/answers">Answer a question</Link> to choose one. Write your response and select <strong>Post Your Answer</strong>. The answer is saved and appears with the question.</p></div>
        </section>
        <section className="guide-section">
          <span className="guide-step">04</span>
          <div><h2>Keep it useful</h2><p>Use a specific title, include relevant details, and keep answers focused on the question. Questions and answers are associated with the account that posted them.</p></div>
        </section>

        <div className="guide-actions">
          <Link className="button button-blue" to="/questions">Browse questions</Link>
          <Link className="button button-orange" to="/questions/ask">Ask a question</Link>
        </div>
      </article>
    </ForumLayout>
  );
}

export default HowItWorks;
