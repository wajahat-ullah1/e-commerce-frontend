import {
  Gamepad,
  Dices,
  RotateCcw,
  Cable,
  Headphones,
  Speaker,
  Keyboard,
  Mouse,
  Watch,
  Tablet,
  Tv,
  MonitorSmartphone,
  Smartphone,
} from "lucide-react";
import { FaPlaystation, FaXbox } from "react-icons/fa";

// ---------------------------------------------------------------------------
// The fixed, hardcoded list of categories that are allowed to appear in the
// storefront sidebar, each with its own icon. Single source of truth, used
// by:
//   1. Admin "Create/Edit Category" screen (Categories.jsx) — dropdown.
//   2. Customer-facing Sidebar component — icon rail + hover flyout.
//
// PlayStation and Xbox use their real brand marks (from react-icons' Font
// Awesome brand set — `npm install react-icons` if you haven't already).
// There is no accurate Nintendo brand icon in any common open icon library
// (Simple Icons, Font Awesome, etc. all omit it — Nintendo enforces its IP
// more tightly than Sony/Microsoft do here), so Nintendo currently uses a
// generic controller icon as a placeholder. If you have an official Nintendo
// glyph (SVG/PNG) you're licensed to use, swap it in as a custom <img> or
// inline SVG component in place of `Gamepad` below.
// ---------------------------------------------------------------------------
export const SIDEBAR_CATEGORY_PRESETS = [
  { name: "PlayStation", icon: FaPlaystation },
  { name: "Xbox", icon: FaXbox },
  { name: "Nintendo", icon: Gamepad },
  // { name: "Other Gaming", icon: Dices },
  { name: "Used Gaming", icon: RotateCcw },
  { name: "Accessories", icon: Cable },
  { name: "Headphones", icon: Headphones },
  { name: "Speakers", icon: Speaker },
  { name: "Keyboard", icon: Keyboard },
  { name: "Mouse", icon: Mouse },
  { name: "Smart Watches", icon: Watch },
  { name: "Tablets", icon: Tablet },
  { name: "TV Boxes", icon: Tv },
  { name: "TV Accessories", icon: MonitorSmartphone },
  { name: "Mobile Accessories", icon: Smartphone },
];

const PRESET_BY_NAME = new Map(
  SIDEBAR_CATEGORY_PRESETS.map((preset) => [preset.name.toLowerCase(), preset]),
);

export function getPresetByName(name = "") {
  return PRESET_BY_NAME.get(name.trim().toLowerCase()) || null;
}

export function getAvailablePresets(existingCategories = []) {
  const used = new Set(
    existingCategories.map((c) => c.name.trim().toLowerCase()),
  );
  return SIDEBAR_CATEGORY_PRESETS.filter(
    (preset) => !used.has(preset.name.toLowerCase()),
  );
}