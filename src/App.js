import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useLang } from "./LanguageContext";
import { CartProvider } from "./CartContext";

import "leaflet/dist/leaflet.css";

import Home from "./pages/Home";
import Sweets from "./pages/Sweets";
import Chocolate from "./pages/Chocolate";
import Nuts from "./pages/Nuts";
import Flowers from "./pages/Flowers";
import Others from "./pages/Others";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";

import "./styles/main.css";

const TransitionContext = createContext();

export function usePageTransition() {
  return useContext(TransitionContext);
}

function AppContent() {
  const navigate = useNavigate();
  const [showFlash, setShowFlash] = useState(false);

  const { lang } = useLang();

  useEffect(() => {
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const goWithFlash = (path) => {
    setShowFlash(true);

    setTimeout(() => {
      navigate(path);
    }, 400);

    setTimeout(() => {
      setShowFlash(false);
    }, 800);
  };

  return (
    <TransitionContext.Provider value={{ goWithFlash }}>
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(28px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(255, 240, 250, 0.7)",
              zIndex: 9999
            }}
          />
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sweets" element={<Sweets />} />
        <Route path="/chocolate" element={<Chocolate />} />
        <Route path="/nuts" element={<Nuts />} />
        <Route path="/flowers" element={<Flowers />} />
        <Route path="/others" element={<Others />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </TransitionContext.Provider>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 9999999999,
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.92)",
            color: "#4a1830",
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
            backdropFilter: "blur(14px)"
          }
        }}
      />
      <HashRouter>
        <AppContent />
      </HashRouter>
    </CartProvider>
  );
}