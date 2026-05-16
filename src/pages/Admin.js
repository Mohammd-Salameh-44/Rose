import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { db, auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../LanguageContext";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

export default function Admin() {
  const { t } = useLang();

  const CLOUD_NAME = "df141dibk";
  const UPLOAD_PRESET = "Rose_Flower";

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [logged, setLogged] = useState(false);

  const ADMIN_EMAILS = ["rosecoffeeflower@gmail.com"];

  const [adminPage, setAdminPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [page, setPage] = useState("sweets");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("piece");
  const [showPrice, setShowPrice] = useState(true);

  const [homeMedia, setHomeMedia] = useState([]);
  const [adminFilter, setAdminFilter] = useState("all");

  useEffect(() => {
    if (logged) {
      loadProducts();
      loadHomeMedia();
      loadOrders();
    }
  }, [logged]);

  const getUnitLabel = (value) => {
    return value === "kg" ? t.kg : t.piece;
  };

  const formatQuantity = (quantity, unit) => {
    return unit === "kg" ? Number(quantity).toFixed(3) : quantity;
  };

  const getStatusLabel = (status) => {
    return t[status] || status || t.pending;
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const userEmail = userCredential.user.email?.toLowerCase();

      if (!ADMIN_EMAILS.includes(userEmail)) {
        await signOut(auth);
        setLogged(false);
        toast.error(t.adminAccessDenied || "This account is not allowed");
        return;
      }

      setLogged(true);
      toast.success(t.loginSuccess);
    } catch (error) {
      console.error(error);
      toast.error(t.loginFailed);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setLogged(false);
  };

  const loadProducts = async () => {
    try {
      const snap = await getDocs(collection(db, "products"));

      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    } catch (error) {
      console.error("Products error:", error);
    }
  };

  const loadHomeMedia = async () => {
    try {
      const snap = await getDocs(collection(db, "homeMedia"));

      setHomeMedia(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    } catch (error) {
      console.error("Home media error:", error);
    }
  };

  const loadOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      setOrders(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    } catch (error) {
      console.error("Orders error:", error);
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: data
      }
    );

    const result = await res.json();

    if (!result.secure_url) {
      toast.error(t.uploadFailed || "Upload failed");
      throw new Error("Cloudinary upload failed");
    }

    return result.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  const handleHomeMedia = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file);

        const newMedia = {
          type: file.type.startsWith("video") ? "video" : "image",
          src: url
        };

        const docRef = await addDoc(collection(db, "homeMedia"), newMedia);

        setHomeMedia((prev) => [
          ...prev,
          {
            id: docRef.id,
            ...newMedia
          }
        ]);
      }

      e.target.value = "";
    } catch (error) {
      console.error(error);
      toast.error(t.homeMediaUploadFailed || "Failed to upload home media");
    }
  };

  const deleteHomeMedia = async (id) => {
    await deleteDoc(doc(db, "homeMedia", id));
    toast.success(t.homeMediaDeleted || "Home media deleted");

    setHomeMedia(homeMedia.filter((m) => m.id !== id));
  };

  const clearForm = () => {
    setName("");
    setDesc("");
    setPage("sweets");
    setImage("");
    setPrice("");
    setUnit("piece");
    setShowPrice(true);
    setEditId(null);
    setEditModalOpen(false);
  };

  const saveProduct = async () => {
    if (!name || !desc || !image || !price) {
      toast.error(t.requiredFields);
      return;
    }

    try {
      let imageUrl = image;

      if (image instanceof File) {
        imageUrl = await uploadToCloudinary(image);
      }

      const productData = {
        name,
        desc,
        image: imageUrl,
        page,
        price: Number(price),
        unit,
        showPrice,
        hidden: false
      };

      if (editId) {
        await updateDoc(doc(db, "products", editId), {
          name,
          desc,
          image: imageUrl,
          page,
          price: Number(price),
          unit,
          showPrice
        });

        setProducts(
          products.map((p) =>
            p.id === editId
              ? {
                ...p,
                name,
                desc,
                image: imageUrl,
                page,
                price: Number(price),
                unit,
                showPrice
              }
              : p
          )
        );

        toast.success(t.productUpdated);
        clearForm();
        return;
      }

      const docRef = await addDoc(collection(db, "products"), productData);

      setProducts([
        ...products,
        {
          id: docRef.id,
          ...productData
        }
      ]);

      toast.success(t.productAdded);
      clearForm();
    } catch (error) {
      console.error(error);
      toast.error(t.productSaveFailed || "Failed to save product");
    }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setName(p.name);
    setDesc(p.desc);
    setPage(p.page);
    setImage(p.image);
    setPrice(p.price || "");
    setUnit(p.unit || "piece");
    setShowPrice(p.showPrice ?? true);
    setEditModalOpen(true);
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    toast.success(t.productDeleted);

    setProducts(products.filter((p) => p.id !== id));
  };

  const toggleHide = async (id) => {
    const product = products.find((p) => p.id === id);
    const newHidden = !product.hidden;

    await updateDoc(doc(db, "products", id), {
      hidden: newHidden
    });

    setProducts(
      products.map((p) =>
        p.id === id
          ? {
            ...p,
            hidden: newHidden
          }
          : p
      )
    );
  };

  const togglePrice = async (id) => {
    const product = products.find((p) => p.id === id);
    const newShowPrice = !product.showPrice;

    await updateDoc(doc(db, "products", id), {
      showPrice: newShowPrice
    });

    setProducts(
      products.map((p) =>
        p.id === id
          ? {
            ...p,
            showPrice: newShowPrice
          }
          : p
      )
    );
  };

  const toggleAllPrices = async (show) => {
    try {
      for (const product of products) {
        await updateDoc(doc(db, "products", product.id), {
          showPrice: show
        });
      }

      setProducts(
        products.map((p) => ({
          ...p,
          showPrice: show
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error(t.priceUpdateFailed || "Failed to update prices");
    }
  };

  const orderStatuses = [
    { value: "pending", label: t.pending },
    { value: "preparing", label: t.preparing },
    { value: "onTheWay", label: t.onTheWay },
    { value: "delivered", label: t.delivered },
    { value: "cancelled", label: t.cancelled }
  ];

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });

      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
              ...order,
              status: newStatus
            }
            : order
        )
      );

      toast.success(t.orderStatusUpdated || "Order status updated");
    } catch (error) {
      console.error(error);
      toast.error(t.orderStatusUpdateFailed || "Failed to update order status");
    }
  };

  const getOrderMapUrl = (order) => {
    if (order.customerLat && order.customerLng) {
      return `https://www.google.com/maps/search/?api=1&query=${order.customerLat},${order.customerLng}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      order.customerAddress || ""
    )}`;
  };

  const filteredAdminProducts = (
    adminFilter === "all"
      ? products
      : products.filter((p) => p.page === adminFilter)
  ).filter((p) =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((order) =>
    order.customerName?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const productPages = [
    { value: "all", label: "All" },
    { value: "sweets", label: "Sweets" },
    { value: "chocolate", label: "Chocolate" },
    { value: "nuts", label: "Nuts" },
    { value: "flowers", label: "Flowers" },
    { value: "others", label: "Others" }
  ];

  if (!logged) {
    return (
      <div className="container">
        <div className="glass admin-box">
          <h2>Admin Login</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />

      <h2 className="page-title">{t.adminPanel || "Admin Dashboard"}</h2>

      <div className="glass admin-topbar">
        <div className="admin-top-actions">
          <button
            className={adminPage === "dashboard" ? "active-admin-tab" : ""}
            onClick={() => setAdminPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={adminPage === "orders" ? "active-admin-tab" : ""}
            onClick={() => setAdminPage("orders")}
          >
            {t.orders}
          </button>
        </div>

        <button onClick={logout}>Logout</button>
      </div>

      {adminPage === "dashboard" && (
        <>
          <div className="glass admin-box">
            <h3>Home Page Images / Videos</h3>

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleHomeMedia}
            />

            <div className="admin-products">
              {homeMedia.map((m) => (
                <div key={m.id} className="glass admin-product-card">
                  {m.type === "video" ? (
                    <video src={m.src} controls className="admin-preview" />
                  ) : (
                    <img src={m.src} alt="" />
                  )}

                  <p>{m.type}</p>

                  <button onClick={() => deleteHomeMedia(m.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>

          {!editId && (
            <div className="glass admin-box">
              <h3>Add Product</h3>

              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="piece">Piece</option>
                <option value="kg">Kg</option>
              </select>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <input
                  type="checkbox"
                  checked={showPrice}
                  onChange={() => setShowPrice(!showPrice)}
                />
                Show Price
              </label>

              <select value={page} onChange={(e) => setPage(e.target.value)}>
                <option value="sweets">Sweets</option>
                <option value="chocolate">Chocolate</option>
                <option value="nuts">Nuts</option>
                <option value="flowers">Flowers</option>
                <option value="others">Others</option>
              </select>

              <input type="file" accept="image/*" onChange={handleImage} />

              {image && (
                <img
                  className="admin-preview"
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt=""
                />
              )}

              <button onClick={saveProduct}>Add Product</button>
            </div>
          )}

          <div className="glass admin-filter-box">
            {productPages.map((item) => (
              <button
                key={item.value}
                onClick={() => setAdminFilter(item.value)}
                className={
                  adminFilter === item.value ? "active-filter-btn" : ""
                }
              >
                {item.label}
              </button>
            ))}

            <button onClick={() => toggleAllPrices(true)}>
              Show All Prices
            </button>

            <button onClick={() => toggleAllPrices(false)}>
              Hide All Prices
            </button>
          </div>

          <div className="glass admin-box">
            <input
              type="text"
              placeholder={t.searchProduct}
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>

          {filteredAdminProducts.length === 0 ? (
            <div className="empty-card glass">
              <div className="empty-icon">📦</div>
              <h3>No Products Yet</h3>
              <p>Products from this section will appear here.</p>
            </div>
          ) : (
            <div className="admin-products">
              {filteredAdminProducts.map((p) => (
                <div key={p.id} className="glass admin-product-card">
                  <img src={p.image} alt="" />

                  <h4>{p.name}</h4>

                  <p>{p.page}</p>

                  <p>
                    {p.showPrice
                      ? `${p.price} ₪ / ${getUnitLabel(p.unit || "piece")}`
                      : "Price Hidden"}
                  </p>

                  <button onClick={() => startEdit(p)}>Edit</button>

                  <button onClick={() => toggleHide(p.id)}>
                    {p.hidden ? "Show Product" : "Hide Product"}
                  </button>

                  <button onClick={() => togglePrice(p.id)}>
                    {p.showPrice ? "Hide Price" : "Show Price"}
                  </button>

                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {adminPage === "orders" && (
        <>
          <div className="glass admin-box">
            <input
              type="text"
              placeholder={t.searchCustomer}
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
          </div>

          <h3 className="page-title">{t.orders}</h3>

          {filteredOrders.length === 0 ? (
            <div className="empty-card glass">
              <div className="empty-icon">🧾</div>
              <h3>No Orders Yet</h3>
              <p>Customer orders will appear here.</p>
            </div>
          ) : (
            <div className="admin-products">
              {filteredOrders.map((order) => (
                <div key={order.id} className="glass admin-product-card">
                  <h3>Order #{order.orderNumber}</h3>

                  <span
                    className={`status-badge status-${order.status || "pending"
                      }`}
                  >
                    {getStatusLabel(order.status || "pending")}
                  </span>

                  <h4>{order.customerName}</h4>

                  <p>📞 {order.customerPhone}</p>

                  <p>
                    📍{" "}
                    <a
                      className="map-link"
                      href={getOrderMapUrl(order)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {order.customerAddress || t.openMaps}
                    </a>
                  </p>

                  {order.customerLat && order.customerLng && (
                    <p>
                      🧭 {order.customerLat.toFixed(6)},{" "}
                      {order.customerLng.toFixed(6)}
                    </p>
                  )}

                  {order.customerNote && <p>📝 {order.customerNote}</p>}

                  <h4>{t.items}</h4>

                  {order.items?.map((item) => (
                    <p key={item.id}>
                      {item.name} - {formatQuantity(item.quantity, item.unit)}{" "}
                      {getUnitLabel(item.unit)} - ₪ {item.price}
                    </p>
                  ))}

                  <hr />

                  <p>
                    {t.productsTotal}: ₪{" "}
                    {Number(order.productsTotal || 0).toFixed(2)}
                  </p>

                  <p>
                    {t.deliveryFee}: ₪{" "}
                    {Number(order.deliveryFee || 0).toFixed(2)}
                  </p>

                  <h3>
                    {t.finalTotal}: ₪ {Number(order.total || 0).toFixed(2)}
                  </h3>

                  <div className="order-status-row">
                    <select
                      className="status-select"
                      value={order.status || "pending"}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p>
                    Waslni:{" "}
                    {order.waslniSuccess || order.waslniResponse?.ok
                      ? "Connected ✅"
                      : "Not Sent ❌"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {editModalOpen && (
          <motion.div
            className="backdrop"
            onClick={clearForm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="glass admin-box edit-product-popup"
              onClick={(e) => e.stopPropagation()}
              initial={{
                opacity: 0,
                scale: 0.88,
                y: 40
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.88,
                y: 40
              }}
              transition={{
                duration: 0.28,
                ease: "easeInOut"
              }}
            >
              <button className="checkout-close" onClick={clearForm}>
                ×
              </button>

              <h3>Edit Product</h3>

              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="piece">Piece</option>
                <option value="kg">Kg</option>
              </select>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <input
                  type="checkbox"
                  checked={showPrice}
                  onChange={() => setShowPrice(!showPrice)}
                />
                Show Price
              </label>

              <select value={page} onChange={(e) => setPage(e.target.value)}>
                <option value="sweets">Sweets</option>
                <option value="chocolate">Chocolate</option>
                <option value="nuts">Nuts</option>
                <option value="flowers">Flowers</option>
                <option value="others">Others</option>
              </select>

              <input type="file" accept="image/*" onChange={handleImage} />

              {image && (
                <img
                  className="admin-preview"
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt=""
                />
              )}

              <button onClick={saveProduct}>Save Changes</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}