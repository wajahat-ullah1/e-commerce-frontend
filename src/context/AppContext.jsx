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
import { cartService, guestCartService } from "../services/cartService";
import { normalizeProduct } from "../services/productService";
import { addressService } from "../services/addressService";
import { wishlistService } from "../services/wishlistService";

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
    const storedGuestCartId = localStorage.getItem("guestCartId");
    const { user, token } = await authService.register({
      ...payload,
      guestCartId: storedGuestCartId || undefined,
    });
    const normalizedUser = {
      ...user,
      role: (user.role || "customer").toLowerCase(),
    };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    if (storedGuestCartId) {
      localStorage.removeItem("guestCartId");
      setGuestCartId(null);
    }
    return normalizedUser;
  }, []);

  const login = useCallback(async (email, password) => {
    const storedGuestCartId = localStorage.getItem("guestCartId");
    const { user, token } = await authService.login(
      email,
      password,
      storedGuestCartId || undefined,
    );
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
    if (storedGuestCartId) {
      localStorage.removeItem("guestCartId");
      setGuestCartId(null);
    }
    return normalizedUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const registerFromGuestOrder = useCallback(
    async ({ orderId, guestCartId, password }) => {
      const { user, token } = await authService.registerFromGuestOrder({
        orderId,
        guestCartId: guestCartId || undefined,
        password,
      });
      const normalizedUser = {
        ...user,
        role: (user.role || "customer").toLowerCase(),
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      localStorage.removeItem("guestCartId");
      setGuestCartId(null);
      return normalizedUser;
    },
    [],
  );

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

  const [guestCartId, setGuestCartId] = useState(
    () => localStorage.getItem("guestCartId") || null,
  );

  function mapCartItems(items = []) {
    return items.map((item) => ({
      product: normalizeProduct(item.product),
      quantity: item.quantity,
    }));
  }

  const loadCart = useCallback(async () => {
    try {
      if (user) {
        const serverCart = await cartService.get();
        setCart(mapCartItems(serverCart?.items));
        return;
      }
      const storedGuestCartId = localStorage.getItem("guestCartId");
      if (!storedGuestCartId) {
        setCart([]);
        return;
      }
      const guestCart = await guestCartService.get(storedGuestCartId);
      setCart(mapCartItems(guestCart?.items));
    } catch {
      if (!user) {
        localStorage.removeItem("guestCartId");
        setGuestCartId(null);
      }
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const ensureGuestCartId = useCallback(async () => {
    let id = localStorage.getItem("guestCartId");
    if (id) return id;
    const guestCart = await guestCartService.create();
    localStorage.setItem("guestCartId", guestCart.id);
    setGuestCartId(guestCart.id);
    return guestCart.id;
  }, []);

  const addToCart = useCallback(
    async (product, qty = 1) => {
      try {
        if (user) {
          await cartService.add(product.id, qty);
        } else {
          const guestCartId = await ensureGuestCartId();
          await guestCartService.add(guestCartId, product.id, qty);
        }
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
      } catch (err) {
        showToast("error", err.message || "Couldn't add to cart");
      }
    },
    [user, ensureGuestCartId, showToast],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        if (user) {
          await cartService.remove(productId);
        } else {
          const guestCartId = localStorage.getItem("guestCartId");
          if (guestCartId)
            await guestCartService.remove(guestCartId, productId);
        }
        setCart((prev) => prev.filter((i) => i.product.id !== productId));
      } catch (err) {
        showToast("error", err.message || "Couldn't remove item");
      }
    },
    [user, showToast],
  );

  const updateQuantity = useCallback(
    async (productId, qty) => {
      if (qty <= 0) return removeFromCart(productId);
      try {
        if (user) {
          await cartService.update(productId, qty);
        } else {
          const guestCartId = localStorage.getItem("guestCartId");
          if (guestCartId)
            await guestCartService.update(guestCartId, productId, qty);
        }
        setCart((prev) =>
          prev.map((i) =>
            i.product.id === productId ? { ...i, quantity: qty } : i,
          ),
        );
      } catch (err) {
        showToast("error", err.message || "Couldn't update quantity");
      }
    },
    [user, removeFromCart, showToast],
  );

  const clearCart = useCallback(async () => {
    try {
      const storedGuestCartId = localStorage.getItem("guestCartId");
      if (storedGuestCartId) {
        await guestCartService.clear(storedGuestCartId);
        localStorage.removeItem("guestCartId");
        setGuestCartId(null);
      }
    } catch {
      // non-critical — clear local state regardless
    }
    setCart([]);
  }, []);

   // ── Wishlist ────────────────────────────────────────────────────────────────
   
  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const list = await wishlistService.list();
      setWishlist(list);
    } catch {
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const wishlistIds = new Set(wishlist.map((p) => p.id));

  const toggleWishlist = useCallback(
    async (product) => {
      if (!user) {
        showToast('info', 'Log in to save items to your wishlist.');
        return;
      }
      const exists = wishlist.some((p) => p.id === product.id);
      try {
        if (exists) {
          await wishlistService.remove(product.id);
          setWishlist((prev) => prev.filter((p) => p.id !== product.id));
          showToast('info', 'Removed from wishlist');
        } else {
          await wishlistService.add(product.id);
          setWishlist((prev) => [...prev, product]);
          showToast('success', 'Added to wishlist');
        }
      } catch (err) {
        showToast('error', err.message || 'Could not update your wishlist.');
      }
    },
    [user, wishlist, showToast],
  );

  // ── Addresses ───────────────────────────────────────────────────────────────

  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    try {
      const list = await addressService.list();
      setAddresses(list);
    } catch {
      setAddresses([]);
    }
  }, [user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const addAddress = useCallback(async (addr) => {
    const created = await addressService.create(addr);
    setAddresses((prev) => {
      const next = created.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;
      return [...next, created];
    });
    return created; // Checkout.jsx needs the new id
  }, []);

  const updateAddress = useCallback(async (id, addr) => {
    const updated = await addressService.update(id, addr);
    setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }, []);

  const deleteAddress = useCallback(async (id) => {
    await addressService.remove(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback(async (id) => {
    await addressService.setDefault(id);
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
        registerFromGuestOrder,
        updateUser,
        cart,
        guestCartId,
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
