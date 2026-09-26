import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, categories, testimonials } from "../../data/products";
import ProductCard from "../../components/customer_Ui/ProductCard";
import Rating from "../../components/customer_Ui/Rating";
import styles from "./Home.module.css";

const CATEGORY_ICONS = {
  controller: {
    d: "M7 9v3m1.5-1.5h-3M15.5 10h.01M17.5 12h.01M7.5 6h9a5 5 0 015 5v3a4 4 0 01-4 4c-.9 0-1.5-.4-2-1l-.6-.8a1.5 1.5 0 00-1.2-.6h-2.4a1.5 1.5 0 00-1.2.6l-.6.8a4 4 0 01-2 1 4 4 0 01-4-4v-3a5 5 0 015-5z",
  },
  console: {
    d: "M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zM8 9v6M12 9v6M16 9v6",
  },
  headset: {
    d: "M12 3a7 7 0 00-7 7v5a2 2 0 002 2h1v-6H6v-1a6 6 0 0112 0v1h-2v6h1a2 2 0 002-2v-5a7 7 0 00-7-7z",
  },
  monitor: {
    d: "M3 5h18v11H3zM8 20h8M12 16v4",
  },
  accessory: {
    d: "M13 2L4 13h6l-1 9 9-11h-6l1-9z",
    filled: true,
  },
};

function getCategoryIcon(name = "") {
  const key = name.toLowerCase();
  if (key.includes("controller")) return CATEGORY_ICONS.controller;
  if (
    key.includes("console") ||
    key.includes("playstation") ||
    key.includes("xbox")
  )
    return CATEGORY_ICONS.console;
  if (
    key.includes("headset") ||
    key.includes("audio") ||
    key.includes("headphone")
  )
    return CATEGORY_ICONS.headset;
  if (key.includes("monitor") || key.includes("display"))
    return CATEGORY_ICONS.monitor;
  return CATEGORY_ICONS.accessory;
}

const benefits = [
  {
    icon: "M7 9v3m1.5-1.5h-3M15.5 10h.01M17.5 12h.01M7.5 6h9a5 5 0 015 5v3a4 4 0 01-4 4c-.9 0-1.5-.4-2-1l-.6-.8a1.5 1.5 0 00-1.2-.6h-2.4a1.5 1.5 0 00-1.2.6l-.6.8a4 4 0 01-2 1 4 4 0 01-4-4v-3a5 5 0 015-5z",
    title: "Authentic Gear",
    desc: "Every console, controller, and accessory is 100% genuine, sourced directly from authorized distributors.",
  },
  {
    icon: "M13 2L4 13h6l-1 9 9-11h-6l1-9z",
    filled: true,
    title: "Lightning-Fast Delivery",
    desc: "Same-day dispatch on in-stock gear. Most orders arrive within 24-48 hours, fully tracked.",
  },
  {
    icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z",
    title: "Secure Checkout",
    desc: "Encrypted payments and buyer protection on every order. Your data stays yours, always.",
  },
  {
    icon: "M4 4h16v12H8l-4 4V4z",
    title: "24/7 Squad Support",
    desc: "Our gaming-obsessed support team is online around the clock for setup help, warranty, and more.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const bestSellers = products.filter((p) => p.badge === "Best Seller");
  const newArrivals = products.filter((p) => p.badge === "New");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlowA} />
        <div className={styles.heroGlowB} />

        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Level Up Your Setup</span>
            <h1 className={styles.heroTitle}>
              Gear Up For
              <br />
              <span className={styles.heroTitleAccent}>Your Next Victory.</span>
            </h1>
            <p className={styles.heroText}>
              Consoles, controllers, headsets, and accessories for players who
              take their game seriously. Authentic hardware, unbeatable prices.
            </p>
            <div className={styles.heroActions}>
              <button
                onClick={() => navigate("/shop")}
                className={styles.btnPrimary}
              >
                Shop Consoles
              </button>
              <button
                onClick={() => navigate("/shop")}
                className={styles.btnGhost}
              >
                Browse Controllers
              </button>
            </div>
            <div className={styles.heroStats}>
              {[
                ["50k+", "Gamers Served"],
                ["1.2k+", "Products"],
                ["4.9★", "Avg. Rating"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className={styles.heroStatValue}>{val}</p>
                  <p className={styles.heroStatLabel}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroVisualGlow} />
            <svg
              className={styles.heroControllerIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.8}
                d="M7 9v3m1.5-1.5h-3M15.5 10h.01M17.5 12h.01M7.5 6h9a5 5 0 015 5v3a4 4 0 01-4 4c-.9 0-1.5-.4-2-1l-.6-.8a1.5 1.5 0 00-1.2-.6h-2.4a1.5 1.5 0 00-1.2.6l-.6.8a4 4 0 01-2 1 4 4 0 01-4-4v-3a5 5 0 015-5z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.sectionLight}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div>
              <p className={styles.eyebrow}>Browse</p>
              <h2 className={styles.sectionTitle}>Shop by Category</h2>
            </div>
            <Link to="/shop" className={styles.viewAllLink}>
              View All
              <svg
                className={styles.viewAllIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => {
              const icon = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className={styles.categoryCard}
                >
                  <div className={styles.categoryIconWrap}>
                    <svg
                      className={styles.categoryIcon}
                      viewBox="0 0 24 24"
                      fill={icon.filled ? "currentColor" : "none"}
                      stroke={icon.filled ? "none" : "currentColor"}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.6}
                        d={icon.d}
                      />
                    </svg>
                  </div>
                  <p className={styles.categoryName}>{cat.name}</p>
                  <p className={styles.categoryCount}>{cat.count} items</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className={styles.sectionLighter}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div>
              <p className={styles.eyebrow}>Top Picks</p>
              <h2 className={styles.sectionTitle}>Fan Favorites</h2>
            </div>
            <Link to="/shop?sort=best" className={styles.viewAllLink}>
              View All
              <svg
                className={styles.viewAllIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className={styles.productGrid}>
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className={styles.sectionDarker}>
        <div className={styles.container}>
          <div className={styles.promoCard}>
            <div className={styles.promoGlow} />
            <div className={styles.promoInner}>
              <div>
                <span className={styles.promoEyebrow}>Limited Drop</span>
                <h2 className={styles.promoTitle}>
                  Up to 30% Off
                  <br />
                  Pro Gear
                </h2>
                <p className={styles.promoText}>
                  Consoles, controllers, and headsets at unbeatable prices.
                  While stock lasts.
                </p>
                <button
                  onClick={() => navigate("/shop?sort=sale")}
                  className={styles.promoButton}
                >
                  Shop the Sale
                </button>
              </div>
              <div className={styles.promoBadgeWrap}>
                <div className={styles.promoBadgeNumber}>30%</div>
                <div className={styles.promoBadgeOff}>OFF</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={styles.sectionLighter}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div>
              <p className={styles.eyebrow}>Just Landed</p>
              <h2 className={styles.sectionTitle}>New Arrivals</h2>
            </div>
            <Link to="/shop?sort=new" className={styles.viewAllLink}>
              View All
              <svg
                className={styles.viewAllIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className={styles.productGrid}>
            {(newArrivals.length > 0 ? newArrivals : products.slice(0, 4)).map(
              (p) => (
                <ProductCard key={p.id} product={p} />
              ),
            )}
          </div>
        </div>
      </section>

      {/* Why Gamers Choose Us */}
      <section className={styles.sectionDark}>
        <div className={styles.container}>
          <div className={styles.centerHead}>
            <p className={styles.eyebrow}>Our Promise</p>
            <h2 className={styles.sectionTitle}>Why Gamers Choose Us</h2>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.title} className={styles.benefitCard}>
                <div className={styles.benefitIconWrap}>
                  <svg
                    className={styles.benefitIcon}
                    fill={benefit.filled ? "currentColor" : "none"}
                    stroke={benefit.filled ? "none" : "currentColor"}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d={benefit.icon}
                    />
                  </svg>
                </div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDesc}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.sectionDarker}>
        <div className={styles.container}>
          <div className={styles.centerHead}>
            <p className={styles.eyebrow}>Reviews</p>
            <h2 className={styles.sectionTitle}>What Gamers Are Saying</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.testimonialCard}>
                <Rating value={t.rating} size="md" />
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialFooter}>
                  <div className={styles.testimonialAvatar}>
                    <span>{t.author?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className={styles.testimonialAuthor}>{t.author}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={`${styles.container} ${styles.newsletterInner}`}>
          <h2 className={styles.newsletterTitle}>Join the Squad</h2>
          <p className={styles.newsletterText}>
            Get restock alerts, exclusive drops, and gaming deals delivered to
            your inbox.
          </p>
          {subscribed ? (
            <div className={styles.subscribedBox}>
              <svg
                className={styles.subscribedIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              You're in! Watch your inbox for drops.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterSubmit}>
                Subscribe
              </button>
            </form>
          )}
          <p className={styles.newsletterFine}>
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>
    </div>
  );
}
