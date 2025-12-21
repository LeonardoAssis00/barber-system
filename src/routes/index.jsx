import { Routes, Route } from "react-router-dom";

// Home
import Home from "../pages/Home";

// Auth - Register
import UserRegister from "../pages/auth/UserRegister";
import BarberRegister from "../pages/auth/BarberRegister";

// Auth - Login
import UserLogin from "../pages/auth/UserLogin";
import BarberLogin from "../pages/auth/BarberLogin";
import LoginChoice from "../pages/auth/LoginChoice";

export default function RoutesApp() {
  return (
    <Routes>
      {/* Página inicial */}
      <Route path="/" element={<Home />} />

      {/* Escolha do login */}
      <Route path="/login" element={<LoginChoice />} />

      {/* Cadastro */}
      <Route path="/register/user" element={<UserRegister />} />
      <Route path="/register/barber" element={<BarberRegister />} />

      {/* Login */}
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/login/barber" element={<BarberLogin />} />
    </Routes>
  );
}
