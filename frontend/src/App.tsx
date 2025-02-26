
import "./App.css";
import { ChatRoom } from "./components/ChatRoom";
import { JoinRoom } from "./components/JoinRoom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketContextProvider } from "./components/SocketContextProvider";

const App = () => {
  return (
    <SocketContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JoinRoom />} />
          <Route path="/chat" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </SocketContextProvider>
  );
};

export default App;
