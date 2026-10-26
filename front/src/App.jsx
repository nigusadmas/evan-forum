import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Questions from "./Pages/Questions";
import AskQuestion from "./Pages/AskQuestion";
import QuestionDetail from "./Pages/QuestionDetail";
import AnswerPage from "./Pages/AnswerPage";
import HowItWorks from "./Pages/HowItWorks";
import { useCallback, useEffect, useState, createContext } from "react";
import axios from "./axiosConfig";

export const AppState = createContext();
function App() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const checkUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser({});
      if (location.pathname === "/" || location.pathname.startsWith("/questions")) navigate("/login");
      return;
    }

    try {
      const { data } = await axios.get("/users/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (error) {
      navigate("/login");
    }
  }, [location.pathname, navigate]);
  useEffect(() => {
    if (location.pathname === "/" || location.pathname.startsWith("/questions")) checkUser();
  }, [checkUser, location.pathname]);
  return (
    <AppState.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questions/ask" element={<AskQuestion />} />
        <Route path="/questions/answers" element={<AnswerPage />} />
        <Route path="/questions/:questionId/answers" element={<AnswerPage />} />
        <Route path="/questions/:questionId" element={<QuestionDetail />} />
      </Routes>
    </AppState.Provider>
  );
}

export default App;
