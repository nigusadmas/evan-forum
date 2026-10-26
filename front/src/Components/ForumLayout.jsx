import { Link, useNavigate } from "react-router-dom";

function ForumLayout({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="forum-shell">
      <header className="forum-header">
        <Link className="wordmark" to="/" aria-label="Evangadi home"><b>E</b>VANGADI</Link>
        <nav aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/how-it-works">How it Works</Link>
          {localStorage.getItem("token")
            ? <button className="button button-blue forum-logout" onClick={logout} type="button">Log out</button>
            : <Link className="button button-blue forum-logout" to="/login">Sign in</Link>}
        </nav>
      </header>
      <main className="forum-content">{children}</main>
    </div>
  );
}

export default ForumLayout;
