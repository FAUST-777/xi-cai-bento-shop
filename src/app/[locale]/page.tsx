import {getTranslations} from 'next-intl/server';
import styles from "./page.module.css";
import {Link} from '@/i18n/routing';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tShop = await getTranslations({locale, namespace: 'Shop'});
  const tMenu = await getTranslations({locale, namespace: 'Menu'});

  const mainItems = [
    { id: 1, img: '/images/雙主菜便當_.png', price: 120, hasImg: true },
    { id: 2, img: '/images/牛肉便當.jpg', price: 110, hasImg: true },
    { id: 3, img: '/images/控肉便當.jpg', price: 90, hasImg: true },
    { id: 4, img: '/images/蝦捲便當.jpg', price: 90, hasImg: true },
    { id: 5, img: '/images/鮮魚便當.jpg', price: 90, hasImg: true },
    { id: 6, img: '/images/雞腿便當.jpg', price: 105, hasImg: true },
    { id: 7, img: '/images/滷肉便當_.png', price: 70, hasImg: true },
    { id: 8, img: '/images/菜飯便當_.png', price: 60, hasImg: true },
    { id: 9, img: '/images/炒麵_.png', price: '35 / 50', hasImg: true },
    { id: 10, img: '/images/滷肉飯_.png', price: '35 / 50', hasImg: true },
  ];

  const soupItems = [
    { id: 1, price: 35 },
    { id: 2, price: 35 },
    { id: 3, price: 35 },
    { id: 4, price: 25 },
  ];

  const sideItems = [
    { id: 1, price: 15 },
    { id: 2, price: 15 },
    { id: 3, price: 5 },
    { id: 4, price: 65 },
  ];

  const locales = [
    { code: 'zh', label: '中文' },
    { code: 'th', label: 'ไทย' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'my', label: 'မြန်မာ' },
    { code: 'km', label: 'ខ្មែរ' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.shopName}>{tShop('name')}</h1>
        <nav className={styles.langSwitcher}>
          {locales.map((l) => (
            <Link 
              key={l.code} 
              href="/" 
              locale={l.code} 
              className={`${styles.langLink} ${locale === l.code ? styles.langLinkActive : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className={styles.hero}>
        <img src="/images/hero.png" alt="Delicious Bento" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>{tShop('name')}</h2>
          <p className={styles.heroSubtitle}>{tShop('delivery')}</p>
        </div>
      </section>

      <main className={styles.menuSection}>
        <h2 className={styles.sectionTitle}>{tShop('mains')}</h2>
        <div className={styles.grid}>
          {mainItems.map((item) => (
            <div key={item.id} className={styles.card}>
              {item.hasImg && (
                <img src={item.img} alt={tMenu(`mains_${item.id}_name`)} className={styles.cardImage} />
              )}
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{tMenu(`mains_${item.id}_name`)}</h3>
                  <span className={styles.cardPrice}>{tShop('currency')}{item.price}</span>
                </div>
                <p className={styles.cardDesc}>{tMenu(`mains_${item.id}_desc`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>{tShop('soups')}</h2>
            <div className={styles.listSection}>
              {soupItems.map(item => (
                <div key={item.id} className={styles.listItem}>
                  <span className={styles.listItemName}>{tMenu(`soups_${item.id}_name`)}</span>
                  <span className={styles.listItemPrice}>{tShop('currency')}{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>{tShop('sides')}</h2>
            <div className={styles.listSection}>
              {sideItems.map(item => (
                <div key={item.id} className={styles.listItem}>
                  <span className={styles.listItemName}>{tMenu(`sides_${item.id}_name`)}</span>
                  <span className={styles.listItemPrice}>{tShop('currency')}{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInfo}>
          <h2>{tShop('name')}</h2>
          <p>📍 {tShop('address')}</p>
          <p>📞 {tShop('phone')}</p>
        </div>
      </footer>
    </div>
  );
}
