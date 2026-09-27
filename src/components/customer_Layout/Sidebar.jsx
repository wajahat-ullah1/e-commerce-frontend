import { useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { categoryService } from "../../services/categoryService";
import { SIDEBAR_CATEGORY_PRESETS } from "../../data/sidebarCategories";
import "./Sidebar.css";

// A slim icon-only rail, fixed to the viewport (stays put on scroll). A
// spacer div reserves the same 64px in the normal page flow so main content
// never renders underneath it. On hover it expands as an overlay (painted
// above the page, not pushing it) with a pink "Menu" header row on top and
// a dimmed/blurred backdrop behind the rest of the screen.
export default function Sidebar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  const activeCategoryId = params.get("category")
    ? Number(params.get("category"))
    : null;

  const { data: categoriesData } = useFetch(() => categoryService.list(), []);
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const categoryByPresetName = new Map(
    categories.map((c) => [c.name.trim().toLowerCase(), c]),
  );

  const items = SIDEBAR_CATEGORY_PRESETS.map((preset) => {
    const matchedCategory = categoryByPresetName.get(preset.name.toLowerCase());
    return {
      preset,
      matchedCategory,
      isConnected: Boolean(matchedCategory),
      isActive: Boolean(matchedCategory) && activeCategoryId === matchedCategory.id,
    };
  });

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
            return (
              <button
                key={item.preset.name}
                type="button"
                title={
                  item.isConnected
                    ? item.preset.name
                    : `${item.preset.name} (not created yet)`
                }
                disabled={!item.isConnected}
                className={[
                  "app-sidebar-item",
                  item.isActive ? "is-active" : "",
                  !item.isConnected ? "is-disabled" : "",
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
                {!item.isConnected && (
                  <span className="app-sidebar-label app-sidebar-tag">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}