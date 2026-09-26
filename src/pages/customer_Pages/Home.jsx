import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products, categories, testimonials } from '../../data/products';
import ProductCard from '../../components/customer_Ui/ProductCard';
import Rating from '../../components/customer_Ui/Rating';
import styles from './Home.module.css';

const benefits = [
  {
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    title: 'Quality Products',
    desc: 'Every product is carefully vetted for quality, durability, and value before listing.',
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Fast Delivery',
    desc: 'Express and standard delivery options. Most orders shipped within 24 hours.',
  },
  {
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    title: 'Secure Shopping',
    desc: 'Your personal data is protected. We never share information with third parties.',
  },
  {
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    title: 'Customer Support',
    desc: '24/7 customer support team ready to help you with any questions or issues.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const bestSellers = products.filter(p => p.badge === 'Best Seller');
  const newArrivals = products.filter(p => p.badge === 'New');

  const handleSubscribe = e => {
    e.preventDefault();
    if (email) { setSubscribed(true); }
  };

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop&auto=format"
            alt="Premium shopping experience"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>New Collection 2026</span>
            <h1 className={styles.heroTitle}>
              Everything You Need,<br />
              <span className={styles.heroTitleAccent}>Delivered to Your Door.</span>
            </h1>
            <p className={styles.heroText}>
              Discover a curated selection of premium products — from electronics and fashion to home essentials and beauty. Quality guaranteed.
            </p>
            <div className={styles.heroActions}>
              <button onClick={() => navigate('/shop')} className={styles.btnPrimary}>
                Shop Now
              </button>
              <button onClick={() => navigate('/shop')} className={styles.btnGhost}>
                Explore Products
              </button>
            </div>
            <div className={styles.heroStats}>
              {[['50k+', 'Happy Customers'], ['10k+', 'Products'], ['4.9★', 'Rating']].map(([val, label]) => (
                <div key={label}>
                  <p className={styles.heroStatValue}>{val}</p>
                  <p className={styles.heroStatLabel}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div>
              <p className={styles.eyebrow}>Browse</p>
              <h2 className={styles.sectionTitle}>Featured Categories</h2>
            </div>
            <Link to="/shop" className={styles.viewAllLink}>
              View All
              <svg className={styles.viewAllIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`} className={styles.categoryCard}>
                <img src={cat.image} alt={cat.name} className={styles.categoryImage} />
                <div className={styles.categoryOverlay} />
                <div className={styles.categoryLabel}>
                  <p className={styles.categoryName}>{cat.name}</p>
                  <p className={styles.categoryCount}>{cat.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div>
              <p className={styles.eyebrow}>Top Picks</p>
              <h2 className={styles.sectionTitle}>Best Sellers</h2>
            </div>
            <Link to="/shop?sort=best" className={styles.viewAllLink}>
              View All
              <svg className={styles.viewAllIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className={styles.productGrid}>
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.promoCard}>
            <div className={styles.promoImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop&auto=format"
                alt="Sale"
                className={styles.promoImage}
              />
            </div>
            <div className={styles.promoInner}>
              <div>
                <span className={styles.promoEyebrow}>Limited Offer</span>
                <h2 className={styles.promoTitle}>Up to 30% Off<br />Selected Items</h2>
                <p className={styles.promoText}>Premium products at exceptional value. Offer ends soon.</p>
                <button onClick={() => navigate('/shop?sort=sale')} className={styles.promoButton}>
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
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div>
              <p className={styles.eyebrow}>Just Landed</p>
              <h2 className={styles.sectionTitle}>New Arrivals</h2>
            </div>
            <Link to="/shop?sort=new" className={styles.viewAllLink}>
              View All
              <svg className={styles.viewAllIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className={styles.productGrid}>
            {(newArrivals.length > 0 ? newArrivals : products.slice(0, 4)).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.centerHead}>
            <p className={styles.eyebrow}>Our Promise</p>
            <h2 className={styles.sectionTitle}>Why Shop With Us</h2>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map(benefit => (
              <div key={benefit.title} className={styles.benefitCard}>
                <div className={styles.benefitIconWrap}>
                  <svg className={styles.benefitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={benefit.icon} />
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
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <div className={styles.centerHead}>
            <p className={styles.eyebrow}>Reviews</p>
            <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map(t => (
              <div key={t.id} className={styles.testimonialCard}>
                <Rating value={t.rating} size="md" />
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialFooter}>
                  <img src={t.avatar} alt={t.author} className={styles.testimonialAvatar} />
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
          <h2 className={styles.newsletterTitle}>Stay in the Loop</h2>
          <p className={styles.newsletterText}>Get the latest arrivals, exclusive deals, and style inspiration delivered to your inbox.</p>
          {subscribed ? (
            <div className={styles.subscribedBox}>
              <svg className={styles.subscribedIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You're subscribed! Thanks for joining.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                id='email'
                type="email"
                required
                autoComplete='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterSubmit}>
                Subscribe
              </button>
            </form>
          )}
          <p className={styles.newsletterFine}>No spam. Unsubscribe anytime. We respect your privacy.</p>
        </div>
      </section>
    </div>
  );
}