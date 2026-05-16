import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("rosaCart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("rosaCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, amount = null) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      );

      const isKg = product.unit === "kg";

      const quantityToAdd =
        amount !== null
          ? amount
          : isKg
          ? 0.05
          : 1;

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantityToAdd
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          desc: product.desc,
          image: product.image,
          price: product.price || 0,
          unit: product.unit || "piece",
          quantity: quantityToAdd
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        const step =
          item.unit === "kg" ? 0.05 : 1;

        return item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + step
            }
          : item;
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const step =
            item.unit === "kg" ? 0.05 : 1;

          return item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - step
              }
            : item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}