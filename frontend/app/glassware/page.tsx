'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../shop/shop.css';

const ALL_PRODUCTS = [
  { id:1,  name:'Borosil Vision Glass Set of 6 (205 ml)',                                          price:599,  oldPrice:899,  rating:4.7, reviews:2341, material:'Borosilicate Glass', style:'Classic',    type:'Drinking Glass', image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/k/z/b/205-vision-glass-set-of-6-205-ml-borosil-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:2,  name:'Treo by Milton Cube Storage Glass Jar with Lid (1000 ml)',                        price:449,  oldPrice:699,  rating:4.5, reviews:876,  material:'Borosilicate Glass', style:'Minimalist', type:'Storage Jar',    image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/jar/h/z/b/1000-cube-storage-glass-jar-with-lid-1000-ml-treo-by-milton-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:3,  name:'Pasabahce Sylvana Glass Tumbler Set of 6 (300 ml)',                               price:799,  oldPrice:1199, rating:4.6, reviews:543,  material:'Crystal Glass',      style:'Modern',     type:'Drinking Glass', image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/y/z/b/300-sylvana-glass-tumbler-set-of-6-300-ml-pasabahce-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:4,  name:'Duralex Picardie Glass Tumbler Set of 6 (250 ml)',                                price:1099, oldPrice:null, rating:4.8, reviews:1203, material:'Tempered Glass',     style:'Classic',    type:'Drinking Glass', image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/z/z/b/250-picardie-glass-tumbler-set-of-6-250-ml-duralex-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:5,  name:'Luminarc Tempered Glass Whisky Tumbler Set of 6 (300 ml)',                        price:849,  oldPrice:1299, rating:4.5, reviews:432,  material:'Tempered Glass',     style:'Modern',     type:'Whisky Glass',   image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/a/z/b/300-whisky-tumbler-set-of-6-300-ml-luminarc-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:6,  name:'Borosil Carafe Glass Water Bottle with Lid (1000 ml)',                            price:699,  oldPrice:999,  rating:4.6, reviews:765,  material:'Borosilicate Glass', style:'Minimalist', type:'Carafe',         image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/bottle/b/z/b/1000-carafe-glass-water-bottle-with-lid-1000-ml-borosil-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:7,  name:'Cello Checkers Glass Tumbler Set of 6 (200 ml)',                                  price:399,  oldPrice:599,  rating:4.4, reviews:321,  material:'Crystal Glass',      style:'Boho',       type:'Drinking Glass', image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/c/z/b/200-checkers-glass-tumbler-set-of-6-200-ml-cello-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:8,  name:'Treo by Milton Classique Wine Glass Set of 6 (350 ml)',                           price:1299, oldPrice:1799, rating:4.7, reviews:654,  material:'Crystal Glass',      style:'Floral',     type:'Wine Glass',     image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/d/z/b/350-classique-wine-glass-set-of-6-350-ml-treo-by-milton-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:9,  name:'Borosil IH11 Mixing Glass Cocktail Shaker (700 ml)',                              price:999,  oldPrice:null, rating:4.5, reviews:234,  material:'Borosilicate Glass', style:'Modern',     type:'Cocktail Glass', image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/e/z/b/700-ih11-mixing-glass-cocktail-shaker-700-ml-borosil-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:10, name:'Pasabahce Bistro Beer Glass Set of 6 (500 ml)',                                   price:749,  oldPrice:1099, rating:4.6, reviews:432,  material:'Tempered Glass',     style:'Classic',    type:'Beer Glass',     image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/f/z/b/500-bistro-beer-glass-set-of-6-500-ml-pasabahce-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:11, name:'Duralex Lys Stackable Glass Tumbler Set of 6 (220 ml)',                           price:899,  oldPrice:1299, rating:4.7, reviews:876,  material:'Tempered Glass',     style:'Minimalist', type:'Drinking Glass', image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/g/z/b/220-lys-stackable-glass-tumbler-set-of-6-220-ml-duralex-original-imah3yghfhgzghgz.jpeg?q=90' },
  { id:12, name:'Luminarc Octime Glass Tumbler Set of 6 (330 ml)',                                 price:649,  oldPrice:899,  rating:4.5, reviews:543,  material:'Tempered Glass',     style:'Modern',     type:'Drinking Glass', image:'https://rukminim1.flixcart.com/image/1280/1280/xif0q/glass/h/z/b/330-octime-glass-tumbler-set-of-6-330-ml-luminarc-original-imah3yghfhgzghgz.jpeg?q=90' },
];

const CATEGORIES = ['Beer Glass', 'Carafe', 'Cocktail Glass', 'Drinking Glass', 'Storage Jar', 'Whisky Glass', 'Wine Glass'];
const MATERIALS  = ['Borosilicate Glass', 'Crystal Glass', 'Tempered Glass'];
const STYLES     = ['Boho', 'Classic', 'Floral', 'Minimalist', 'Modern'];
const SORT_OPTIONS = [
  { label: 'Featured',           value: 'featured'   },
  { label: 'Price: Low to High', value: 'price-asc'  },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated',          value: 'rating'     },
];
const MAX_PRICE = 2000;

function FilterSection({ label, isOpen, onToggle, children }: {
  label: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="nf-section">
      <button className={`nf-section-btn${isOpen ? ' open' : ''}`} onClick={onToggle} aria-expanded={isOpen}>
        <span className="nf-section-label">{label}</span>
        <svg className="nf-chevron" width="12" height="12" viewBox="0 0 12 12"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <polyline points="2,4 6,8 10,4"/>
        </svg>
      </button>
      <div className={`nf-panel${isOpen ? ' open' : ''}`}>
        <div className="nf-panel-inner">
          <div className="nf-options-list">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CheckOption({ label, checked, onChange, count }: {
  label: string; checked: boolean; onChange: () => void; count: number;
}) {
  return (
    <label className={`nf-option${checked ? ' checked' : ''}`}>
      <span className="nf-checkbox" aria-hidden="true">
        {checked && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <input type="checkbox" className="nf-hidden-input" checked={checked} onChange={onChange} aria-label={label}/>
      <span className="nf-option-text">{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>({count})</span>
    </label>
  );
}

function ProductCard({ p, idx }: { p: typeof ALL_PRODUCTS[0]; idx: number }) {
  const [hovered,    setHovered]    = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const isOnSale = !!p.oldPrice;
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  return (
    <div className="csp-card" style={{ animationDelay: `${Math.min(idx * 40, 400)}ms` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="csp-img-wrap">
        <Link href="/shop" tabIndex={-1} aria-hidden="true">
          <img src={p.image} alt={p.name} className={`csp-img${hovered ? ' zoomed' : ''}`}
            loading={idx < 8 ? 'eager' : 'lazy'}/>
        </Link>
        <div className="csp-badges">
          {isOnSale && <span className="csp-badge sale">Sale</span>}
        </div>
        <button className={`csp-wishlist${wishlisted ? ' active' : ''}`}
          aria-label={`${wishlisted ? 'Remove' : 'Add'} ${p.name} ${wishlisted ? 'from' : 'to'} wishlist`}
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"
            fill={wishlisted ? '#e74c3c' : 'none'}
            stroke={wishlisted ? '#e74c3c' : 'currentColor'} strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div className={`csp-overlay${hovered ? ' show' : ''}`} aria-hidden={!hovered}>
          <Link href="/shop" className="csp-quick-view">Quick View</Link>
        </div>
      </div>
      <div className="csp-info">
        <Link href="/shop" className="csp-name">{p.name}</Link>
        <div className="csp-price-row">
          {isOnSale && p.oldPrice && <span className="csp-old-price">₹{p.oldPrice.toLocaleString()}</span>}
          <span className={`csp-price${isOnSale ? ' sale' : ''}`}>₹{p.price.toLocaleString()}</span>
          {discount !== null && <span className="csp-save-badge">{discount}% off</span>}
        </div>
      </div>
    </div>
  );
}

export default function GlasswarePage() {
  const [sort,          setSort]          = useState('featured');
  const [viewMode,      setViewMode]      = useState<'grid' | 'list'>('grid');
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [openFilters,   setOpenFilters]   = useState({ category: false, price: false, material: false, style: false });
  const [selCategories, setSelCategories] = useState<string[]>([]);
  const [selMaterials,  setSelMaterials]  = useState<string[]>([]);
  const [selStyles,     setSelStyles]     = useState<string[]>([]);
  const [priceMin,      setPriceMin]      = useState(0);
  const [priceMax,      setPriceMax]      = useState(MAX_PRICE);

  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const totalActive =
    selCategories.length + selMaterials.length + selStyles.length +
    (priceMin > 0 || priceMax < MAX_PRICE ? 1 : 0);

  const clearAll = () => {
    setSelCategories([]); setSelMaterials([]); setSelStyles([]);
    setPriceMin(0); setPriceMax(MAX_PRICE);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter(p => {
      if (selCategories.length && !selCategories.includes(p.type))     return false;
      if (selMaterials.length  && !selMaterials.includes(p.material))  return false;
      if (selStyles.length     && !selStyles.includes(p.style))        return false;
      if (p.price < priceMin   || p.price > priceMax)                  return false;
      return true;
    });
    if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [selCategories, selMaterials, selStyles, priceMin, priceMax, sort]);

  const SidebarContent = (
    <>
      <div className="nf-sidebar-head">
        <span className="nf-sidebar-title">Filters</span>
        {totalActive > 0 && <button className="nf-clear-all" onClick={clearAll}>Clear all ({totalActive})</button>}
      </div>

      <FilterSection label={selCategories.length ? `Category (${selCategories.length})` : 'Category'}
        isOpen={openFilters.category} onToggle={() => setOpenFilters(p => ({ ...p, category: !p.category }))}>
        {CATEGORIES.map(c => (
          <CheckOption key={c} label={c} checked={selCategories.includes(c)}
            onChange={() => setSelCategories(toggle(selCategories, c))}
            count={ALL_PRODUCTS.filter(p => p.type === c).length}/>
        ))}
      </FilterSection>

      <FilterSection label={priceMin > 0 || priceMax < MAX_PRICE ? 'Price (Active)' : 'Price'}
        isOpen={openFilters.price} onToggle={() => setOpenFilters(p => ({ ...p, price: !p.price }))}>
        <div style={{ padding: '4px 0 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
            <span>₹{priceMin.toLocaleString()}</span>
            <span>₹{priceMax.toLocaleString()}</span>
          </div>
          <input type="range" min={0} max={MAX_PRICE} value={priceMax} aria-label="Maximum price"
            style={{ width: '100%', accentColor: '#1a8a6e' }}
            onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}/>
        </div>
      </FilterSection>

      <FilterSection label={selMaterials.length ? `Material (${selMaterials.length})` : 'Material'}
        isOpen={openFilters.material} onToggle={() => setOpenFilters(p => ({ ...p, material: !p.material }))}>
        {MATERIALS.map(m => (
          <CheckOption key={m} label={m} checked={selMaterials.includes(m)}
            onChange={() => setSelMaterials(toggle(selMaterials, m))}
            count={ALL_PRODUCTS.filter(p => p.material === m).length}/>
        ))}
      </FilterSection>

      <FilterSection label={selStyles.length ? `Style (${selStyles.length})` : 'Style'}
        isOpen={openFilters.style} onToggle={() => setOpenFilters(p => ({ ...p, style: !p.style }))}>
        {STYLES.map(s => (
          <CheckOption key={s} label={s} checked={selStyles.includes(s)}
            onChange={() => setSelStyles(toggle(selStyles, s))}
            count={ALL_PRODUCTS.filter(p => p.style === s).length}/>
        ))}
      </FilterSection>
    </>
  );

  return (
    <>
      <Header/>
      <nav className="csp-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="csp-bsep" aria-hidden="true">&gt;</span>
        <span aria-current="page">Glassware</span>
      </nav>

      <div className="csp-body">
        <aside className="csp-sidebar" aria-label="Product filters">{SidebarContent}</aside>

        {sidebarOpen && <div className="csp-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true"/>}
        <div className={`csp-sidebar-drawer${sidebarOpen ? ' open' : ''}`}
          role="dialog" aria-modal="true" aria-label="Product filters" aria-hidden={!sidebarOpen}>
          <div className="csp-drawer-head">
            <span className="csp-drawer-title">Filters</span>
            <button className="csp-drawer-close" onClick={() => setSidebarOpen(false)} aria-label="Close filters">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="16" y2="16"/><line x1="16" y1="2" x2="2" y2="16"/>
              </svg>
            </button>
          </div>
          <div className="csp-drawer-body">{SidebarContent}</div>
          <div className="csp-drawer-foot">
            <button className="csp-apply-btn" onClick={() => setSidebarOpen(false)}>
              View {filtered.length} Result{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>

        <main className="csp-main">
          <div className="csp-toolbar">
            <div className="csp-toolbar-left">
              <button className="csp-filter-toggle" onClick={() => setSidebarOpen(true)}
                aria-label={`Open filters${totalActive > 0 ? `, ${totalActive} active` : ''}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
                Filters
                {totalActive > 0 && <span className="csp-filter-badge">{totalActive}</span>}
              </button>
              <span className="csp-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="csp-toolbar-right">
              <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"
                style={{ height:34, padding:'0 10px', border:'1px solid #e5e7eb', borderRadius:6, fontSize:13, color:'#374151', background:'#fff', cursor:'pointer' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="csp-view-toggle" role="group" aria-label="View mode">
                <button className={`csp-view-btn${viewMode === 'grid' ? ' active' : ''}`}
                  onClick={() => setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode === 'grid'}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/>
                    <rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/>
                  </svg>
                </button>
                <button className={`csp-view-btn${viewMode === 'list' ? ' active' : ''}`}
                  onClick={() => setViewMode('list')} aria-label="List view" aria-pressed={viewMode === 'list'}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="1" width="16" height="3" rx="1"/><rect x="0" y="7" width="16" height="3" rx="1"/>
                    <rect x="0" y="13" width="16" height="3" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {totalActive > 0 && (
            <div className="csp-chips-bar" role="group" aria-label="Active filters">
              <button className="csp-chips-clear" onClick={clearAll}>Clear all</button>
              {selCategories.map(c => (
                <span key={c} className="csp-chip">{c}
                  <button className="csp-chip-x" onClick={() => setSelCategories(toggle(selCategories, c))} aria-label={`Remove ${c}`}>x</button>
                </span>
              ))}
              {selMaterials.map(m => (
                <span key={m} className="csp-chip">{m}
                  <button className="csp-chip-x" onClick={() => setSelMaterials(toggle(selMaterials, m))} aria-label={`Remove ${m}`}>x</button>
                </span>
              ))}
              {selStyles.map(s => (
                <span key={s} className="csp-chip">{s}
                  <button className="csp-chip-x" onClick={() => setSelStyles(toggle(selStyles, s))} aria-label={`Remove ${s}`}>x</button>
                </span>
              ))}
              {(priceMin > 0 || priceMax < MAX_PRICE) && (
                <span className="csp-chip">₹{priceMin}–₹{priceMax}
                  <button className="csp-chip-x" onClick={() => { setPriceMin(0); setPriceMax(MAX_PRICE); }} aria-label="Remove price filter">x</button>
                </span>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="csp-state-wrap">
              <svg width="52" height="52" fill="none" stroke="#ccc" strokeWidth="1.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <p className="csp-state-text">No products match your filters</p>
              <button className="csp-clear-btn" onClick={clearAll}>Clear all filters</button>
            </div>
          ) : (
            <div className={`csp-grid${viewMode === 'list' ? ' list-mode' : ''}`} aria-label="Glassware products">
              {filtered.map((p, i) => <ProductCard key={p.id} p={p} idx={i}/>)}
            </div>
          )}
        </main>
      </div>
      <Footer/>
    </>
  );
}
