import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "../App";
import { useLang } from "../LanguageContext";
import { useCart } from "../CartContext";
import logo from "../assets/logo.png";
import MonoIcon from "./MonoIcon";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY || 0;
        const scrollDiff = currentScrollY - lastScrollY.current;

        if (currentScrollY < 80 || open) {
          setHideHeader(false);
        } else if (scrollDiff > 6) {
          setHideHeader(true);
        } else if (scrollDiff < -2) {
          setHideHeader(false);
        }

        lastScrollY.current = currentScrollY;
        ticking = false;
      });

      ticking = true;
    };

    lastScrollY.current = window.scrollY || 0;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const { goWithFlash } = usePageTransition();
  const { toggleLang, t } = useLang();
  const { cart } = useCart();
  const cartCount = cart.length;

  const go = (path) => {
    setOpen(false);
    goWithFlash(path);
  };

  const toggleDark = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  return (
    <div className={`navbar glass navbar-scroll-aware ${hideHeader ? "navbar-hidden" : ""}`}>

      {/* LOGO */}
      <div className="logo-left" onClick={() => goWithFlash("/")}>
        <img src={logo} alt="ROSA Logo" className="navbar-logo" />
      </div>

      {/* DESKTOP NAV */}
      <div className="desktop-nav">
        <button onClick={() => go("/")}>{t.home}</button>
        <button onClick={() => go("/sweets")}>{t.sweets}</button>
        <button onClick={() => go("/chocolate")}>{t.chocolate}</button>
        <button onClick={() => go("/nuts")}>{t.nuts}</button>
        <button onClick={() => go("/flowers")}>{t.flowers}</button>
        <button onClick={() => go("/others")}>{t.others}</button>
        <button onClick={() => go("/contact")}>{t.contact}</button>

        <button className="cart-btn" onClick={() => go("/cart")}>
          <MonoIcon name="cart" size={22} />
          {cartCount > 0 && (
            <span className="cart-badge">{parseInt(cartCount)}</span>
          )}
        </button>

        <button className="dark-icon-btn" onClick={toggleDark}>
          <MonoIcon name={dark ? "sun" : "moon"} size={22} />
        </button>

        <button className="lang-btn" onClick={toggleLang}>
          <MonoIcon name="language" size={22} />
        </button>
      </div>

      {/* HAMBURGER */}
      <button className="hamburger-btn" onClick={() => setOpen(!open)}>
        <MonoIcon name="menu" size={24} />
      </button>

      {/* MOBILE MENU — portal renders directly into document.body,
          completely escaping the navbar's stacking context and width */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Invisible full-screen tap-to-close overlay */}
              <motion.div
                className="mobile-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />

              {/* Menu panel — free to use its own fixed positioning */}
              <motion.div
                className="mobile-menu"
                initial={{ scale: 0.4, opacity: 0, x: 40, y: -30 }}
                animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                exit={{ scale: 0.4, opacity: 0, x: 40, y: -30 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => go("/")}>{t.home}</button>
                <button onClick={() => go("/sweets")}>{t.sweets}</button>
                <button onClick={() => go("/chocolate")}>{t.chocolate}</button>
                <button onClick={() => go("/nuts")}>{t.nuts}</button>
                <button onClick={() => go("/flowers")}>{t.flowers}</button>
                <button onClick={() => go("/others")}>{t.others}</button>
                <button onClick={() => go("/contact")}>{t.contact}</button>

                <button onClick={() => go("/cart")}>
                  <MonoIcon name="cart" size={20} /> Cart ({parseInt(cartCount)})
                </button>

                <button className="dark-icon-btn" onClick={toggleDark}>
                  <MonoIcon name={dark ? "sun" : "moon"} size={22} />
                </button>

                <button className="lang-btn" onClick={toggleLang}>
                  <MonoIcon name="language" size={22} />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}