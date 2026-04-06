'use client';

import { useState, useMemo } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const ALL_PRODUCTS = [
  { id:1,  name:'Crystal Clear Wine Glass Set (6 Pcs)',       price:1299, oldPrice:1799, rating:4.5, reviews:2103,  type:'Wine Glass',    material:'Crystal',      pieces:6,  image:'https://icmedianew.gumlet.io/pub/media/catalog/product/cache/7c90eecf75182456ca0a208cc3917af8/i/n/india-circus-by-krsnaa-mehta-green-champagne-glass-52152102sd00638-2_1.jpg' },
  { id:2,  name:'Borosilicate Water Glass Set (6 Pcs)',        price:899,  oldPrice:1299, rating:4.3, reviews:1654, type:'Water Glass',   material:'Borosilicate', pieces:6,  image:'https://nestasia.in/cdn/shop/files/all-purpose-glass-tumblers_1_c7ea42b0-36ab-43bf-8e3b-efe32737db6b.jpg?v=1736163177&width=2000' },
  { id:3,  name:'Premium Whiskey Tumbler Set (4 Pcs)',         price:2499, oldPrice:null, rating:4.7, reviews:987,  type:'Tumbler',       material:'Crystal',      pieces:4,  image:'https://nestasia.in/cdn/shop/files/glassware_3_8156bc58-606d-44b6-bbc3-f673756a90ea.jpg?v=1741268631&width=2000' },
  { id:4,  name:'Champagne Flute Set (6 Pcs)',                 price:1599, oldPrice:2199, rating:4.4, reviews:765,  type:'Champagne',     material:'Crystal',      pieces:6,  image:'https://nestasia.in/cdn/shop/files/CocktailTumbler_6_e1eaefbb-cf3c-423e-a556-47ee3d16832e.jpg?v=1739024739&width=2000' },
  { id:5,  name:'Juice Glass Set with Jug (7 Pcs)',            price:1199, oldPrice:null, rating:4.2, reviews:543,  type:'Juice Glass',   material:'Borosilicate', pieces:7,  image:'https://nestasia.in/cdn/shop/files/Crystal_Fairy_Core_Butterfly_Tumbler_With_Lid_And_Straw_450ml_Set_Of_2_Purple1.jpg?v=1771073830&width=2000' },
  { id:6,  name:'Beer Mug Set (4 Pcs)',                        price:999,  oldPrice:1399, rating:4.1, reviews:432,  type:'Beer Mug',      material:'Borosilicate', pieces:4,  image:'https://nestasia.in/cdn/shop/files/Vintage-Thick-Stem-Dessert-Bowls-Set-Of-6-120ml_4.jpg?v=1759489841&width=2000' },
  { id:7,  name:'Cocktail Glass Set (6 Pcs)',                  price:1899, oldPrice:null, rating:4.5, reviews:876,  type:'Cocktail',      material:'Crystal',      pieces:6,  image:'https://nestasia.in/cdn/shop/files/Cov_5.jpg?v=1773466046&width=2000' },
  { id:8,  name:'Shot Glass Set (6 Pcs)',                      price:599,  oldPrice:899,  rating:4.0, reviews:321,  badge:'Sale',       type:'Shot Glass',    material:'Borosilicate', pieces:6,  image:'https://nestasia.in/cdn/shop/files/bubble-base-martini-glass-set-of-2-220ml-blue_2.jpg?v=1773224570&width=2000' },
  { id:9,  name:'Highball Glass Set (6 Pcs)',                  price:1499, oldPrice:null, rating:4.6, reviews:1098, badge:'New',        type:'Highball',      material:'Crystal',      pieces:6,  image:'https://nestasia.in/cdn/shop/files/LuxeChampagneGlassSetOf2200ml.jpg?v=1773223955&width=2000' },
];

const TYPES     = ['Wine Glass','Water Glass','Tumbler','Champagne','Juice Glass','Beer Mug','Cocktail','Shot Glass','Highball'];
const MATERIALS = ['Crystal','Borosilicate'];
const PIECES    = [4,6,7];
const SORT_OPTIONS = [
  { label:'Featured',           value:'featured'   },
  { label:'Price: Low to High', value:'price-asc'  },
  { label:'Price: High to Low', value:'price-desc' },
  { label:'Top Rated',          value:'rating'     },
];

function MiniStars({ rating = 4 }: { rating?: number }) {
  return (
    <span className="csp-stars" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true"
          fill={s <= rating ? '#e8a020' : '#ddd'}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

function FilterSection({ label, open, onToggle, children }: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="nf-section">
      <button className="nf-section-btn" onClick={onToggle}>
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="nf-section-body">{children}</div>}
    </div>
  );
}

function ProductCard({ p, idx }: { p: typeof ALL_PRODUCTS[0]; idx: number }) {
  const [hovered,    setHovered]    = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const isOnSale = !!p.oldPrice;
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

  return (
    <div className="csp-card" style={{ animationDelay:`${Math.min(idx*40,400)}ms` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)} onTouchEnd={() => setTimeout(() => setHovered(false), 600)}>
      <div className="csp-img-wrap">
        <Link href="/shop" tabIndex={-1} aria-hidden="true">
          <img src={p.image} alt={p.name} className={`csp-img${hovered?' zoomed':''}`}
            loading={idx < 8 ? 'eager' : 'lazy'} />
        </Link>
        <div className="csp-badges">
          {isOnSale && <span className="csp-badge sale">Sale</span>}
          {p.badge && p.badge !== 'Sale' && (
            <span className="csp-badge" style={{
              background: p.badge==='New' ? '#1a8a6e' : p.badge==='Top Rated' ? '#7c3aed' : '#d97706'
            }}>{p.badge}</span>
          )}
        </div>
        <button className={`csp-wishlist${wishlisted?' active':''}`}
          aria-label={`${wishlisted?'Remove':'Add'} ${p.name} ${wishlisted?'from':'to'} wishlist`}
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"
            fill={wishlisted ? '#e74c3c' : 'none'}
            stroke={wishlisted ? '#e74c3c' : 'currentColor'} strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className={`csp-overlay${hovered?' show':''}`} aria-hidden={!hovered}>
          <Link href="/shop" className="csp-quick-view">Quick View</Link>
        </div>
      </div>
      <div className="csp-info">
        <Link href="/shop" className="csp-name">{p.name}</Link>
        <MiniStars rating={p.rating} />
        <div className="csp-price-row">
          {isOnSale && p.oldPrice && <span className="csp-old-price">₹{p.oldPrice.toLocaleString()}</span>}
          <span className={`csp-price${isOnSale?' sale':''}`}>
            ₹{p.price.toLocaleString()}
            {isOnSale && discount && <span style={{ fontSize:11, fontWeight:600, color:'#e74c3c', marginLeft:6 }}>{discount}% off</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GlasswarePage() {
  const [sort,        setSort]        = useState('featured');
  const [viewMode,    setViewMode]    = useState<'grid'|'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState({ price:true, type:true, material:false, pieces:false });
  const [selTypes,     setSelTypes]     = useState<string[]>([]);
  const [selMaterials, setSelMaterials] = useState<string[]>([]);
  const [selPieces,    setSelPieces]    = useState<number[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(5000);

  const toggleStr = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x=>x!==v) : [...arr,v];
  const toggleNum = (arr: number[], v: number) => arr.includes(v) ? arr.filter(x=>x!==v) : [...arr,v];

  const totalActive = selTypes.length + selMaterials.length + selPieces.length +
    (priceMin > 0 || priceMax < 5000 ? 1 : 0);

  const clearAll = () => {
    setSelTypes([]); setSelMaterials([]); setSelPieces([]);
    setPriceMin(0); setPriceMax(5000);
  };

  const filtered = useMemo(() => ALL_PRODUCTS.filter(p => {
    if (selTypes.length     && !selTypes.includes(p.type))         return false;
    if (selMaterials.length && !selMaterials.includes(p.material)) return false;
    if (selPieces.length    && !selPieces.includes(p.pieces))      return false;
    if (p.price < priceMin  || p.price > priceMax)                 return false;
    return true;
  }), [selTypes, selMaterials, selPieces, priceMin, priceMax]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort==='price-asc')  arr.sort((a,b)=>a.price-b.price);
    if (sort==='price-desc') arr.sort((a,b)=>b.price-a.price);
    if (sort==='rating')     arr.sort((a,b)=>b.rating-a.rating);
    return arr;
  }, [filtered, sort]);

  const SidebarContent = (
    <div className="nf-sidebar-inner">
      <div className="nf-sidebar-head">
        <span className="nf-sidebar-title">Filters</span>
        {totalActive > 0 && <button className="nf-clear-all" onClick={clearAll}>Clear all ({totalActive})</button>}
      </div>

      <FilterSection label="Price Range" open={openFilters.price}
        onToggle={() => setOpenFilters(p=>({...p,price:!p.price}))}>
        <div className="nf-price-inputs">
          <div className="nf-price-field"><label>Min ₹</label>
            <input type="number" value={priceMin} min={0} max={priceMax} onChange={e=>setPriceMin(Number(e.target.value))} />
          </div>
          <div className="nf-price-field"><label>Max ₹</label>
            <input type="number" value={priceMax} min={priceMin} max={5000} onChange={e=>setPriceMax(Number(e.target.value))} />
          </div>
        </div>
        <div className="nf-price-range">₹{priceMin.toLocaleString()} – ₹{priceMax.toLocaleString()}</div>
      </FilterSection>

      <FilterSection label="Type" open={openFilters.type}
        onToggle={() => setOpenFilters(p=>({...p,type:!p.type}))}>
        {TYPES.map(t => (
          <label key={t} className="nf-check-label">
            <input type="checkbox" checked={selTypes.includes(t)} onChange={()=>setSelTypes(toggleStr(selTypes,t))} />
            <span>{t}</span>
            <span className="nf-check-count">({ALL_PRODUCTS.filter(p=>p.type===t).length})</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection label="Material" open={openFilters.material}
        onToggle={() => setOpenFilters(p=>({...p,material:!p.material}))}>
        {MATERIALS.map(m => (
          <label key={m} className="nf-check-label">
            <input type="checkbox" checked={selMaterials.includes(m)} onChange={()=>setSelMaterials(toggleStr(selMaterials,m))} />
            <span>{m}</span>
            <span className="nf-check-count">({ALL_PRODUCTS.filter(p=>p.material===m).length})</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection label="Pieces" open={openFilters.pieces}
        onToggle={() => setOpenFilters(p=>({...p,pieces:!p.pieces}))}>
        {PIECES.map(n => (
          <label key={n} className="nf-check-label">
            <input type="checkbox" checked={selPieces.includes(n)} onChange={()=>setSelPieces(toggleNum(selPieces,n))} />
            <span>{n} Pcs</span>
            <span className="nf-check-count">({ALL_PRODUCTS.filter(p=>p.pieces===n).length})</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <>
      <Header />
      <style>{`
        .nf-sidebar-inner{display:flex;flex-direction:column;gap:0}
        .nf-sidebar-head{display:flex;align-items:center;justify-content:space-between;padding:0 0 16px;border-bottom:1px solid #ececec;margin-bottom:4px}
        .nf-sidebar-title{font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#111}
        .nf-clear-all{border:none;background:none;font-size:12px;color:#888;cursor:pointer;text-decoration:underline;padding:0}
        .nf-clear-all:hover{color:#111}
        .nf-section{border-bottom:1px solid #ececec}
        .nf-section-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:14px 0;border:none;background:none;font-size:13px;font-weight:600;color:#111;cursor:pointer;text-align:left}
        .nf-section-body{padding:0 0 14px;display:flex;flex-direction:column;gap:8px}
        .nf-check-label{display:flex;align-items:center;gap:8px;font-size:13px;color:#444;cursor:pointer}
        .nf-check-label input{width:15px;height:15px;cursor:pointer;accent-color:#111}
        .nf-check-count{margin-left:auto;font-size:12px;color:#aaa}
        .nf-price-inputs{display:flex;gap:10px;margin-bottom:8px}
        .nf-price-field{display:flex;flex-direction:column;gap:4px;flex:1}
        .nf-price-field label{font-size:11px;color:#888;font-weight:600}
        .nf-price-field input{padding:6px 8px;border:1px solid #ddd;border-radius:4px;font-size:13px;width:100%;outline:none}
        .nf-price-field input:focus{border-color:#111}
        .nf-price-range{font-size:12px;color:#888;text-align:center}
        .ccs-breadcrumb{padding:13px 48px;font-size:13px;color:#888;display:flex;gap:6px;align-items:center;border-bottom:1px solid #ececec;background:#fff}
        .ccs-breadcrumb a{color:#888;text-decoration:none}.ccs-breadcrumb a:hover{color:#111}
        .ccs-page-header{text-align:center;padding:40px 24px 28px;border-bottom:1px solid #ececec}
        .ccs-page-title{font-size:28px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#111;margin:0 0 8px}
        .ccs-page-sub{font-size:14px;color:#888;margin:0}
        .ccs-body{display:grid;grid-template-columns:260px 1fr;max-width:1360px;margin:0 auto;padding:0 24px;gap:32px;align-items:start}
        .ccs-sidebar{padding:24px 0}
        .ccs-main{min-width:0;padding:24px 0 80px}
        .ccs-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}
        .ccs-toolbar-left{display:flex;align-items:center;gap:12px}
        .ccs-filter-toggle{display:none;align-items:center;gap:6px;padding:8px 14px;border:1px solid #ddd;border-radius:4px;background:#fff;font-size:13px;font-weight:600;cursor:pointer}
        .ccs-count{font-size:13px;color:#888}
        .ccs-toolbar-right{display:flex;align-items:center;gap:10px}
        .ccs-sort{padding:8px 12px;border:1px solid #ddd;border-radius:4px;font-size:13px;color:#111;background:#fff;cursor:pointer;outline:none}
        .ccs-view-btns{display:flex;gap:4px}
        .ccs-view-btn{width:32px;height:32px;border:1px solid #ddd;border-radius:4px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#888;transition:all 0.15s}
        .ccs-view-btn.active{border-color:#111;color:#111;background:#f5f5f5}
        .ccs-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
        .ccs-chip{display:flex;align-items:center;gap:6px;padding:4px 10px;background:#f5f5f5;border-radius:20px;font-size:12px;color:#444}
        .ccs-chip-x{border:none;background:none;cursor:pointer;font-size:14px;color:#888;padding:0;line-height:1}
        .ccs-empty{padding:48px 0;text-align:center;color:#888;font-size:14px}
        .ccs-drawer-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1100}
        .ccs-drawer-overlay.open{display:block}
        .ccs-drawer{position:fixed;top:0;left:0;bottom:0;width:min(300px,90vw);background:#fff;z-index:1200;transform:translateX(-100%);transition:transform 0.25s;display:flex;flex-direction:column;padding:20px;overflow-y:auto}
        .ccs-drawer.open{transform:translateX(0)}
        .ccs-drawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .ccs-drawer-close{border:none;background:none;font-size:22px;cursor:pointer;color:#888;line-height:1}
        .ccs-drawer-foot{padding-top:16px;margin-top:auto}
        .ccs-apply-btn{width:100%;padding:14px;background:#111;color:#fff;border:none;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer}
        @media(max-width:900px){.ccs-body{grid-template-columns:1fr;padding:0 16px}.ccs-sidebar{display:none}.ccs-filter-toggle{display:flex}}
        @media(max-width:600px){.ccs-breadcrumb{padding:12px 16px}}
        /* Force 3-column grid matching shop page */
        .ccs-main .csp-grid{grid-template-columns:repeat(3,1fr)}
        @media(max-width:900px){.ccs-main .csp-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:600px){.ccs-main .csp-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <nav className="ccs-breadcrumb">
        <Link href="/">Home</Link><span>›</span>
        <Link href="/collection">Collections</Link><span>›</span>
        <span>Glassware</span>
      </nav>

      <div className="ccs-page-header">
        <h1 className="ccs-page-title">Glassware</h1>
        <p className="ccs-page-sub">Elegant glassware for every occasion — wine, cocktails, everyday sipping and more.</p>
      </div>

      <div className="ccs-body">
        <aside className="ccs-sidebar">{SidebarContent}</aside>

        <div className={`ccs-drawer-overlay${sidebarOpen?' open':''}`} onClick={()=>setSidebarOpen(false)} />
        <div className={`ccs-drawer${sidebarOpen?' open':''}`}>
          <div className="ccs-drawer-head">
            <span style={{fontWeight:700,fontSize:14}}>Filters</span>
            <button className="ccs-drawer-close" onClick={()=>setSidebarOpen(false)}>×</button>
          </div>
          {SidebarContent}
          <div className="ccs-drawer-foot">
            <button className="ccs-apply-btn" onClick={()=>setSidebarOpen(false)}>
              View {sorted.length} Result{sorted.length!==1?'s':''}
            </button>
          </div>
        </div>

        <main className="ccs-main">
          <div className="ccs-toolbar">
            <div className="ccs-toolbar-left">
              <button className="ccs-filter-toggle" onClick={()=>setSidebarOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
                Filters{totalActive>0?` (${totalActive})`:''}
              </button>
              <span className="ccs-count">{sorted.length} product{sorted.length!==1?'s':''}</span>
            </div>
            <div className="ccs-toolbar-right">
              <select className="ccs-sort" value={sort} onChange={e=>setSort(e.target.value)}>
                {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="ccs-view-btns">
                <button className={`ccs-view-btn${viewMode==='grid'?' active':''}`} onClick={()=>setViewMode('grid')} title="Grid">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="0" width="6" height="6"/><rect x="10" y="0" width="6" height="6"/>
                    <rect x="0" y="10" width="6" height="6"/><rect x="10" y="10" width="6" height="6"/>
                  </svg>
                </button>
                <button className={`ccs-view-btn${viewMode==='list'?' active':''}`} onClick={()=>setViewMode('list')} title="List">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="0" y="1" width="16" height="3"/><rect x="0" y="7" width="16" height="3"/><rect x="0" y="13" width="16" height="3"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {totalActive > 0 && (
            <div className="ccs-chips">
              <button className="ccs-chip" onClick={clearAll} style={{background:'#111',color:'#fff'}}>Clear all</button>
              {selTypes.map(t=>(
                <span key={t} className="ccs-chip">{t}
                  <button className="ccs-chip-x" onClick={()=>setSelTypes(toggleStr(selTypes,t))}>×</button>
                </span>
              ))}
              {selMaterials.map(m=>(
                <span key={m} className="ccs-chip">{m}
                  <button className="ccs-chip-x" onClick={()=>setSelMaterials(toggleStr(selMaterials,m))}>×</button>
                </span>
              ))}
              {selPieces.map(n=>(
                <span key={n} className="ccs-chip">{n} Pcs
                  <button className="ccs-chip-x" onClick={()=>setSelPieces(toggleNum(selPieces,n))}>×</button>
                </span>
              ))}
              {(priceMin>0||priceMax<5000)&&(
                <span className="ccs-chip">₹{priceMin.toLocaleString()}–₹{priceMax.toLocaleString()}
                  <button className="ccs-chip-x" onClick={()=>{setPriceMin(0);setPriceMax(5000);}}>×</button>
                </span>
              )}
            </div>
          )}

          {sorted.length === 0 ? (
            <div className="ccs-empty">
              No products match your filters.{' '}
              <button onClick={clearAll} style={{color:'#111',fontWeight:700,background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`csp-grid${viewMode==='list'?' list-mode':''}`}>
              {sorted.map((p,i) => <ProductCard key={p.id} p={p} idx={i} />)}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
