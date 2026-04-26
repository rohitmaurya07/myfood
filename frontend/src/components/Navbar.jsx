import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./ContextReducer";

// DOne

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  .hn-root {
    font-family: 'DM Sans', sans-serif;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
    padding: 18px 0;
  }
  .hn-root.scrolled {
    background: rgba(255, 252, 242, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 2px 24px rgba(60, 35, 5, 0.1);
    padding: 10px 0;
  }

  .hn-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  /* Brand */
  .hn-brand {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .hn-brand-icon {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, #d97706, #b45309);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(180, 83, 9, 0.35);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hn-brand:hover .hn-brand-icon { transform: rotate(-8deg) scale(1.1); }
  .hn-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.3px;
  }
  .hn-brand-name span { color: #d97706; }

  /* Desktop nav links */
  .hn-links {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0; padding: 0;
  }
  .hn-link {
    position: relative;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    color: white;
    padding: 6px 14px;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
  }
  .hn-link::after {
    content: '';
    position: absolute;
    bottom: 2px; left: 14px; right: 14px;
    height: 2px;
    background: #d97706;
    border-radius: 2px;
    transform: scaleX(0);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hn-link:hover, .hn-link.active {
    color: #b45309;
    background: rgba(217,119,6,0.07);
  }
  .hn-link.active::after,
  .hn-link:hover::after { transform: scaleX(1); }

  /* Actions */
  .hn-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .hn-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    border-radius: 50px;
    padding: 8px 18px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }
  .hn-btn:hover { transform: scale(1.05); }
  .hn-btn:active { transform: scale(0.97); }

  .hn-btn-ghost {
    background: transparent;
    border: 1.5px solid white;
    color: white;
  }
  .hn-btn-ghost:hover { border-color: #d97706; background: rgba(217,119,6,0.06); }

  .hn-btn-solid {
    background: linear-gradient(135deg, #d97706, #b45309);
    color: #fff;
    box-shadow: 0 4px 14px rgba(180,83,9,0.3);
  }
  .hn-btn-solid:hover { box-shadow: 0 6px 20px rgba(180,83,9,0.4); }

  .hn-btn-cart {
    background: rgba(217,119,6,0.1);
    border: 1.5px solid rgba(217,119,6,0.25);
    color: #b45309;
    position: relative;
  }
  .hn-btn-cart:hover { background: rgba(217,119,6,0.18); }
  .hn-cart-badge {
    position: absolute;
    top: -5px; right: -5px;
    width: 17px; height: 17px;
    background: #d97706;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fffdf7;
    animation: hn-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes hn-pop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  .hn-btn-logout {
    background: transparent;
    border: 1.5px solid rgba(180,50,30,0.25);
    color: #c0392b;
  }
  .hn-btn-logout:hover { background: rgba(192,57,43,0.06); border-color: #c0392b; }

  /* Hamburger */
  .hn-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .hn-hamburger:hover { background: rgba(217,119,6,0.1); }
  .hn-hamburger span {
    display: block;
    width: 22px; height: 2px;
    background: #5a3e1b;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: center;
  }
  .hn-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hn-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hn-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile drawer */
  .hn-drawer {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    left: 16px; right: 16px;
    background: rgba(255,252,242,0.97);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(200,160,80,0.2);
    box-shadow: 0 16px 50px rgba(60,35,5,0.15);
    padding: 16px;
    flex-direction: column;
    gap: 4px;
    transform-origin: top center;
    animation: hn-drawer-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes hn-drawer-in {
    from { opacity: 0; transform: scaleY(0.85); }
    to   { opacity: 1; transform: scaleY(1); }
  }
  .hn-drawer.open { display: flex; }
  .hn-drawer-link {
    text-decoration: none;
    font-size: 15px;
    font-weight: 400;
    color: #5a3e1b;
    padding: 10px 14px;
    border-radius: 10px;
    transition: background 0.2s, color 0.2s;
  }
  .hn-drawer-link:hover, .hn-drawer-link.active {
    background: rgba(217,119,6,0.1);
    color: #b45309;
  }
  .hn-drawer-divider {
    height: 1px;
    background: rgba(200,160,80,0.2);
    margin: 8px 0;
  }
  .hn-drawer-actions {
    display: flex;
    gap: 8px;
    padding: 4px 0;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .hn-links, .hn-actions { display: none; }
    .hn-hamburger { display: flex; }
  }
`;

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const cartState = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const allLinks = token ? [...navLinks, { to: "/myorders", label: "My Orders" }] : navLinks;

  return (
    <>
      <style>{styles}</style>
      <nav className={`pt-5  hn-root${scrolled ? ' scrolled' : ''}`}>
        <div className="hn-inner">
          {/* Brand */}
          <Link to="/" className="hn-brand">
            <div className="hn-brand-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a9 9 0 0 1 9 9c0 4.97-9 13-9 13S3 15.97 3 11a9 9 0 0 1 9-9z"/>
                <circle cx="12" cy="11" r="3"/>
              </svg>
            </div>
            <span className="hn-brand-name">my<span>Food</span></span>
          </Link>

          {/* Desktop links */}
          <ul className="hn-links">
            {allLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={`hn-link ${isActive(l.to)}`}>{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hn-actions">
            {!token ? (
              <>
                <Link to="/login" className="hn-btn hn-btn-ghost">Log in</Link>
                <Link to="/signup" className="hn-btn hn-btn-solid">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/cart" className="hn-btn hn-btn-cart">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Cart
                  {cartState.length > 0 && (
                    <span className="hn-cart-badge" key={cartState.length}>{cartState.length}</span>
                  )}
                </Link>
                <button onClick={logout} className="hn-btn hn-btn-logout">Log Out</button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className={`hn-hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`hn-drawer ${menuOpen ? 'open' : ''}`}>
          {allLinks.map(l => (
            <Link key={l.to} to={l.to} className={`hn-drawer-link ${isActive(l.to)}`}>{l.label}</Link>
          ))}
          <div className="hn-drawer-divider" />
          <div className="hn-drawer-actions">
            {!token ? (
              <>
                <Link to="/login" className="hn-btn hn-btn-ghost">Log in</Link>
                <Link to="/signup" className="hn-btn hn-btn-solid">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/cart" className="hn-btn hn-btn-cart">
                  Cart {cartState.length > 0 && `(${cartState.length})`}
                </Link>
                <button onClick={logout} className="hn-btn hn-btn-logout">Log Out</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;