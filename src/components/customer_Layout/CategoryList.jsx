import { useNavigate, useSearchParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { categoryService } from "../../services/categoryService";
import { SIDEBAR_CATEGORY_PRESETS } from "../../data/sidebarCategories";

// Shared by the desktop <Sidebar /> rail and the mobile <MobileDrawer />, so
// both always show the same categories, icons and active state.
export function useCategoryItems() {
  const [params] = useSearchParams();
  const activeCategoryId = params.get("category")
    ? Number(params.get("category"))
    : null;

  const { data: categoriesData } = useFetch(() => categoryService.list(), []);
  const loaded = Array.isArray(categoriesData);
  const categories = loaded ? categoriesData : [];

  const categoryByPresetName = new Map(
    categories.map((c) => [c.name.trim().toLowerCase(), c]),
  );

  return SIDEBAR_CATEGORY_PRESETS.map((preset) => {
    const matchedCategory = categoryByPresetName.get(preset.name.toLowerCase());
    return {
      preset,
      matchedCategory,
      loaded,
      isConnected: Boolean(matchedCategory),
      isActive: Boolean(matchedCategory) && activeCategoryId === matchedCategory.id,
    };
  });
}

// Full-width category list (icon + name) used inside the mobile drawer.
export default function CategoryList({ onSelect }) {
  const navigate = useNavigate();
  const items = useCategoryItems();

  return (
    <ul className="cat-list">
      {items.map((item) => {
        const Icon = item.preset.icon;
        const showSoon = item.loaded && !item.isConnected;
        return (
          <li key={item.preset.name}>
            <button
              type="button"
              disabled={!item.isConnected}
              className={[
                "cat-list-item",
                item.isActive ? "is-active" : "",
                showSoon ? "is-disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (!item.isConnected) return;
                navigate(`/shop?category=${item.matchedCategory.id}`);
                onSelect?.();
              }}
            >
              <Icon className="cat-list-icon" />
              <span className="cat-list-name">{item.preset.name}</span>
              {showSoon && <span className="cat-list-tag">Soon</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
