import { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategoryItems } from "./CategoryList.jsx";
import "./Sidebar.css";

// A slim icon-only rail, fixed to the viewport (stays put on scroll). A
// spacer div reserves the same 64px in the normal page flow so main content
// never renders underneath it. On hover it expands as an overlay (painted
// above the page, not pushing it) with a pink "Menu" header row on top and
// a dimmed/blurred backdrop behind the rest of the screen.
// Desktop only (>= 1024px). Below that the header switches to its hamburger
// layout and the same categories live in the MobileDrawer's Categories tab.
export default function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const items = useCategoryItems();

  return (
    <div className="app-sidebar-wrap">
      {expanded && <div className="app-sidebar-backdrop" />}

      <aside
        className={expanded ? "app-sidebar is-expanded" : "app-sidebar"}
        aria-label="Shop categories"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="app-sidebar-header">
          <Menu className="app-sidebar-icon" />
          <span className="app-sidebar-label">Menu</span>
        </div>

        <nav className="app-sidebar-nav">
          {items.map((item) => {
            const Icon = item.preset.icon;
            const showSoon = item.loaded && !item.isConnected;
            return (
              <button
                key={item.preset.name}
                type="button"
                title={
                  showSoon
                    ? `${item.preset.name} (not created yet)`
                    : item.preset.name
                }
                disabled={!item.isConnected}
                className={[
                  "app-sidebar-item",
                  item.isActive ? "is-active" : "",
                  showSoon ? "is-disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  if (item.isConnected) {
                    setExpanded(false);
                    navigate(`/shop?category=${item.matchedCategory.id}`);
                  }
                }}
              >
                <Icon className="app-sidebar-icon" />
                <span className="app-sidebar-label">{item.preset.name}</span>
                {showSoon && (
                  <span className="app-sidebar-label app-sidebar-tag">Soon</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
