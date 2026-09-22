import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { authService } from "../services/authService";
import { profileService } from "../services/profileService";
import { notificationService } from "../services/notificationService";

// ── Context ───────────────────────────────────────────────────────────────────

export const AppContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // restore session on refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      profileService
        .get()
        .then((fullProfile) => {
          setUser((prev) => {
            const merged = {
              ...prev,
              ...fullProfile,
              role: (fullProfile.role || prev?.role || "").toLowerCase(),
            };
            localStorage.setItem("user", JSON.stringify(merged));
            return merged;
          });
        })
        .catch(() => {}); // stale/invalid token will surface as a real 401 on the next actual request anyway
    }
    setLoading(false);
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const count = await notificationService.unreadCount();
      setUnreadCount(count);
    } catch {
      // non-critical — don't disrupt the UI over a badge count failing
    }
  }, [user]);

  useEffect(() => {
    refreshUnreadCount();

    if (!user) return;

    const token = localStorage.getItem("token");
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/notifications/stream?token=${token}`,
    );

    eventSource.onmessage = () => {
      refreshUnreadCount();
    };

    eventSource.onerror = () => {
      // browser auto-reconnects EventSource on its own; nothing to do here
    };

    return () => eventSource.close();
  }, [user]);

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
    localStorage.setItem("token", token);
    let normalizedUser = { ...user, role: user.role.toLowerCase() };
    try {
      const fullProfile = await profileService.get();
      normalizedUser = {
        ...normalizedUser,
        ...fullProfile,
        role: normalizedUser.role,
      };
    } catch {
      // profile fetch failing here shouldn't block login itself
    }
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
      const merged = {
        ...prev,
        ...updates,
        role: (updates.role || prev.role || "").toLowerCase(),
      };
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
        unreadCount,
        refreshUnreadCount,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
