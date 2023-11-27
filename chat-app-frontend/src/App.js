import "./App.css";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import UsersPage from "./Pages/UsersPage.js";
import { Route, Routes } from "react-router-dom";
import { ChatState } from "./Context/ChatProvider";

function App() {
  const { user } = ChatState();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/chats" element={<ChatPage />} />
        {user && user.isAdmin && <Route path="/users" element={<UsersPage />} />}
      </Routes>
    </div>
  );
}

export default App;
