import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { authService } from "../services/authService";

// ── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_ADDRESSES = [
  {
    id: "addr-1",
    label: "Home",
    line1: "123 Maple Street",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "United States",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    line1: "456 Market Street",
    line2: "Suite 800",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "United States",
    isDefault: false,
  },
];

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState(DEMO_ADDRESSES);
  const [toasts, setToasts] = useState([]);

  // restore session on refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const showToast = useCallback((type, message) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Auth ────────────────────────────────────────────────────────────────────

  const register = useCallback(async (payload) => {
    const { user, token } = await authService.register(payload);
    const normalizedUser = {
      ...user,
      role: (user.role || "customer").toLowerCase(),
    };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, token } = await authService.login(email, password);
    const normalizedUser = { ...user, role: user.role.toLowerCase() };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  //__ Profile __________________________________________________________________
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const merged = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  }, []);
  // ── Cart ────────────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + qty }
              : i,
          );
        }
        return [...prev, { product, quantity: qty }];
      });
      showToast("success", `${product.name} added to cart`);
    },
    [showToast],
  );

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i,
        ),
      );
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Wishlist ────────────────────────────────────────────────────────────────
  const wishlistIds = new Set(wishlist.map((p) => p.id));
  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (exists) {
          showToast("info", `Removed from wishlist`);
          return prev.filter((p) => p.id !== product.id);
        }
        showToast("success", `Added to wishlist`);
        return [...prev, product];
      });
    },
    [showToast],
  );

  // ── Addresses ───────────────────────────────────────────────────────────────
  const addAddress = useCallback((addr) => {
    const id = "addr-" + Math.random().toString(36).slice(2);
    setAddresses((prev) => {
      if (addr.isDefault) {
        return [
          ...prev.map((a) => ({ ...a, isDefault: false })),
          { ...addr, id },
        ];
      }
      return [...prev, { ...addr, id }];
    });
  }, []);

  const updateAddress = useCallback((id, addr) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...addr } : a)),
    );
  }, []);

  const deleteAddress = useCallback((id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        register,
        login,
        logout,
        updateUser,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        wishlistIds,
        toggleWishlist,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
