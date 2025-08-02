import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
