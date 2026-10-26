import { useContext } from "react";
import { AppState } from "../App";
import { Link } from "react-router-dom";
import ForumLayout from "../Components/ForumLayout";

function Home() {
  const { user } = useContext(AppState);

  return (
    <ForumLayout>
      <section className="home-welcome">
        <span className="eyebrow">Evangadi Networks</span>
        <h1>Welcome{user?.username ? `, ${user.username}` : ""}</h1>
        <p>Ask questions, share what you know, and learn with the community.</p>
        <div className="home-actions">
          <Link className="button button-blue" to="/questions">Browse questions</Link>
          <Link className="button button-orange" to="/questions/ask">Ask a question</Link>
        </div>
      </section>
    </ForumLayout>
  );
}

export default Home;
