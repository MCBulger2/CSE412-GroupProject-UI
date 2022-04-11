import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Conversation from "./Conversation/Conversation";
import TitleBar from "./TitleBar/TitleBar";
import Login from "./Login/Login";

const App = () => {
  return (
    <BrowserRouter>
      <div className="screen">
        <TitleBar />
        <div className="page">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/conversation/:conversationId" element={<Conversation />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
