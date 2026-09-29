import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import CategoryList from "./CategoryList.jsx";
import logoImage from "../../assets/sami-games-logo.png";
import "./MobileDrawer.css";

// Slide-out drawer for tablets and phones (below 1024px). Two tabs:
//   Categories (default) - same icons/names as the desktop sidebar rail
//   Menu                 - the header's nav links + account links
//
// Rendered through a portal because .site-header uses backdrop-filter, which
// would otherwise trap a position: fixed child inside the header's box.
export default function MobileDrawer({
  open,
  onClose,
  navLinks,
  isLoggedIn,
  onLogout,
}) {
  const [tab, setTab] = useState("categories");

  // Always reopen on the Categories tab.
  useEffect(() => {
    if (open) setTab("categories");
  }, [open]);

  // Lock page scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Growing past the tablet breakpoint (desktop sidebar takes over): close.
  useEffect(() => {
    if (!open) return undefined;
    const mql = window.matchMedia("(min-width: 64em)");
    const onChange = (e) => e.matches && onClose();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="mdrawer-root">
      <div className="mdrawer-backdrop" onClick={onClose} />

      <aside className="mdrawer-panel" role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="mdrawer-top">
          <img src={logoImage} alt="Sami Games" className="mdrawer-logo" />
          <button type="button" className="mdrawer-close" onClick={onClose} aria-label="Close menu">
            <X className="mdrawer-close-icon" />
          </button>
        </div>

        <div className="mdrawer-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "categories"}
            className={tab === "categories" ? "mdrawer-tab is-active" : "mdrawer-tab"}
            onClick={() => setTab("categories")}
          >
            Categories
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "menu"}
            className={tab === "menu" ? "mdrawer-tab is-active" : "mdrawer-tab"}
            onClick={() => setTab("menu")}
          >
            Menu
          </button>
        </div>

        <div className="mdrawer-body">
          {tab === "categories" ? (
            <CategoryList onSelect={onClose} />
          ) : (
            <nav className="mdrawer-menu">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} className="mdrawer-link" onClick={onClose}>
                  {link.label}
                </Link>
              ))}

              <div className="mdrawer-account">
                {isLoggedIn ? (
                  <>
                    <Link to="/account" className="mdrawer-link" onClick={onClose}>
                      My Account
                    </Link>
                    <Link to="/account/orders" className="mdrawer-link" onClick={onClose}>
                      My Orders
                    </Link>
                    <button
                      type="button"
                      className="mdrawer-link mdrawer-logout"
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="mdrawer-link mdrawer-signin" onClick={onClose}>
                    Sign In / Register
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
