import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "../App";
import { useLang } from "../LanguageContext";
import logo from "../assets/logo.png";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "../CartContext";
import MonoIcon from "../components/MonoIcon";

function Home() {
  const { goWithFlash } = usePageTransition();
  const { t, toggleLang } = useLang();
  const { cart } = useCart();

  const go = (path) => {
    goWithFlash(path);
  };

  const [mediaList, setMediaList] = useState([]);
  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const loadHomeMedia = async () => {
      const snap = await getDocs(collection(db, "homeMedia"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setMediaList(data);
    };

    loadHomeMedia();
  }, []);

  useEffect(() => {
    if (mediaList.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % mediaList.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [mediaList]);

  const next = () => {
    if (mediaList.length === 0) return;
    setIndex((prev) => (prev + 1) % mediaList.length);
  };

  const prev = () => {
    if (mediaList.length === 0) return;
    setIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const toggleDark = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  const items = [
    { name: t.sweets, path: "/sweets", icon: "🍬" },
    { name: t.chocolate, path: "/chocolate", icon: "🍫" },
    { name: t.nuts, path: "/nuts", icon: "🥜" },
    { name: t.flowers, path: "/flowers", icon: "🌸" },
    { name: t.others, path: "/others", icon: "🎁" },
    { name: t.contact, path: "/contact", icon: "📞" }
  ];

  return (
    <div className="home-split">
      <div className="top-actions">

        {/* 🛒 LEFT */}
        <div className="glass cart-box">
          <button onClick={() => go("/cart")} aria-label="Cart">
            <MonoIcon name="cart" size={24} />
          </button>

          {cart.length > 0 && (
            <span className="cart-badge">
              {cart.length}
            </span>
          )}
        </div>

        {/* 🌙 + 🌐 RIGHT */}
        <div className="glass tools-box">

          <button onClick={toggleDark} aria-label="Toggle dark mode">
            <MonoIcon name={dark ? "sun" : "moon"} size={24} />
          </button>

          <button onClick={toggleLang} aria-label="Toggle language">
            <MonoIcon name="language" size={24} />
          </button>

        </div>

      </div>

      <div className="home-content">
        <div className="home-left glass">
          <h1 className="home-tag">{t.title}</h1>

          <img className="home-logo" src={logo} alt="ROSA Logo" />

          <p className="home-text">{t.description}</p>

          <div className="home-actions">
            {items.map((item) => (
              <button key={item.path} onClick={() => goWithFlash(item.path)}>
                <span>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="home-right glass">
          {mediaList.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mediaList[index].id || index}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  {mediaList[index].type === "video" ? (
                    <video
                      src={mediaList[index].src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="home-media"
                    />
                  ) : (
                    <img
                      src={mediaList[index].src}
                      alt="media"
                      className="home-media"
                      loading="lazy"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {mediaList.length > 1 && (
                <>
                  <button className="arrow left" onClick={prev}>‹</button>
                  <button className="arrow right" onClick={next}>›</button>

                  <div className="slider-dots">
                    {mediaList.map((_, i) => (
                      <button
                        key={i}
                        className={`slider-dot ${i === index ? "active" : ""}`}
                        onClick={() => setIndex(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=80"
              alt="ROSA shop"
            />
          )}

          <div className="floating-badge">
            <a
              href="https://maps.app.goo.gl/H977ZCWZxLZYTeZ57"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.location}
            </a>
          </div>
        </div>
      </div>

      <div className="footer glass">
        <p>© 2026 ROSA Coffee & Flowers</p>
        <button onClick={() => goWithFlash("/contact")}>
          {t.contact}
        </button>
      </div>
    </div>
  );
}

export default Home;