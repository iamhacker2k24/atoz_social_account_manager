import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Schuduler from "./pages/Schuduler";
import Layout from "./pages/Layout";
import AIComposer from "./pages/AIComposer";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/schedule" element={<Schuduler />} />
          <Route path="/ai-composer" element={<AIComposer />} />
        </Route>
      </Routes>
    </>
  );
};

// 40
export default App;
