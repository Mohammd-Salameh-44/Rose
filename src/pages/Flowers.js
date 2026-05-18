import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useLang } from "../LanguageContext";
import { usePageTransition } from "../App";
import { useCart } from "../CartContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Flowers() {
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState("");

  const { t } = useLang();
  const { goWithFlash } = usePageTransition();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      const snap = await getDocs(collection(db, "products"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(data.filter((p) => p.page === "flowers" && !p.hidden));
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase())
  );

  const getStep = (product) => {
    return product.unit === "kg" ? 0.05 : 1;
  };

  const formatQuantity = (value, unit) => {
    return unit === "kg" ? value.toFixed(3) : value;
  };

  const getUnitLabel = (unit) => {
    return unit === "kg" ? "Kg" : "Piece";
  };

  return (
    <div className="container">
      <Navbar />

      <h2 className="page-title">{t.flowers}</h2>

      <div className="search-card glass">
        <input
          type="text"
          placeholder={t.searchFlowers}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <button className="search-btn">🔍</button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-card glass">
          <div className="empty-icon">🌸</div>
          <h3>{t.noProductsTitle}</h3>
          <p>{t.noProductsDesc}</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              className="glass card"
            >
              <motion.img
                src={p.image}
                alt={p.name}
                loading="lazy"
              />

              <div className="card-info">
                <motion.h3>
                  {p.name}
                </motion.h3>

                <button
                  className="more-btn"
                  onClick={() => {
                    setSelected(p);
                    setQuantity(p.unit === "kg" ? 0.05 : 1);
                  }}
                >
                  More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            <motion.div
              className="glass modal"
              initial={{
                opacity: 0,
                scale: 0.68,
                y: 36
              }}
              animate={{
                opacity: 1,
                scale: [0.68, 1.035, 0.985, 1],
                y: [36, -4, 2, 0]
              }}
              exit={{
                opacity: 0,
                scale: 0.78,
                y: 28
              }}
              transition={{
                duration: 0.42,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <button
                className="modal-close-x"
                onClick={() => setSelected(null)}
              >
                ×
              </button>

              <motion.img
                src={selected.image}
                alt={selected.name}
                loading="lazy"
              />

              <motion.h2>
                {selected.name}
              </motion.h2>

              <p>{selected.desc}</p>

              {selected.showPrice && (
                <p className="card-price">
                  ₪ {selected.price} / {getUnitLabel(selected.unit)}
                </p>
              )}

              <div className="product-quantity">
                <button
                  onClick={() => {
                    const step = getStep(selected);
                    setQuantity((q) => Math.max(step, q - step));
                  }}
                >
                  −
                </button>

                <span>
                  {formatQuantity(quantity, selected.unit)} {getUnitLabel(selected.unit)}
                </span>

                <button
                  onClick={() => {
                    const step = getStep(selected);
                    setQuantity((q) => q + step);
                  }}
                >
                  +
                </button>
              </div>

              <button
                className="add-cart-btn"
                onClick={() => {
                  addToCart(selected, quantity);
                  setToast("Product added to cart");
                  setSelected(null);

                  setTimeout(() => {
                    setToast("");
                  }, 2000);
                }}
              >
                Add To Cart
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast-card glass"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="footer glass">
        <p>© 2026 ROSA Coffee & Flowers</p>

        <button onClick={() => goWithFlash("/contact")}>
          {t.contact}
        </button>
      </div>
    </div>
  );
}