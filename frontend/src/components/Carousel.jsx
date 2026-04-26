import React, { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    img: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2070&auto=format&fit=crop",
    tag: "Street Bites",
    title: "Bold Flavours,\nFresh Beginnings",
    sub: "Crafted with care, served with soul"
  },
  {
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    tag: "Wood-fired",
    title: "Slice Into\nSomething Warm",
    sub: "Hot from the oven, straight to your heart"
  },
  {
    img: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?q=80&w=2070&auto=format&fit=crop",
    tag: "Garden Fresh",
    title: "Nature on\nYour Plate",
    sub: "Seasonal ingredients, timeless taste"
  }
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  .hc-root {
    font-family: 'DM Sans', sans-serif;
    position: relative;
    width: 100%;
    height: 480px;
    border-radius: 28px;
    overflow: hidden;
    background: #1a0f05;
    box-shadow: 0 24px 80px rgba(30, 15, 0, 0.35);
  }

  /* Slides */
  .hc-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }
  .hc-slide.active {
    opacity: 1;
    pointer-events: auto;
  }
  .hc-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 6s ease;
    transform: scale(1.06);
  }
  .hc-slide.active img {
    transform: scale(1);
  }

  /* Gradient overlay */
  .hc-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(15, 8, 2, 0.82) 0%,
      rgba(15, 8, 2, 0.45) 55%,
      rgba(15, 8, 2, 0.1) 100%
    );
  }

  /* Leaf texture top-right */
  .hc-deco {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 200px;
    height: 200px;
    opacity: 0.12;
    pointer-events: none;
  }

  /* Text content */
  .hc-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 52px;
    pointer-events: none;
  }
  .hc-tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(217, 119, 6, 0.18);
    border: 1px solid rgba(217, 119, 6, 0.4);
    color: #fbbf24;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 13px;
    border-radius: 50px;
    margin-bottom: 18px;
    width: fit-content;
    backdrop-filter: blur(4px);
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.6s 0.2s ease, transform 0.6s 0.2s ease;
  }
  .hc-tag-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f59e0b;
  }
  .hc-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700;
    color: #fffdf7;
    line-height: 1.15;
    white-space: pre-line;
    margin: 0 0 14px;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.65s 0.35s ease, transform 0.65s 0.35s ease;
  }
  .hc-sub {
    font-size: 14px;
    font-weight: 300;
    color: rgba(255, 245, 220, 0.7);
    letter-spacing: 0.02em;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.6s 0.5s ease, transform 0.6s 0.5s ease;
  }
  .hc-slide.active .hc-tag,
  .hc-slide.active .hc-title,
  .hc-slide.active .hc-sub {
    opacity: 1;
    transform: translateY(0);
  }

  /* Bottom wave */
  .hc-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
  }

  /* Dots */
  .hc-dots {
    position: absolute;
    bottom: 26px;
    left: 52px;
    display: flex;
    gap: 8px;
    z-index: 10;
  }
  .hc-dot {
    width: 8px;
    height: 8px;
    border-radius: 50px;
    background: rgba(255,245,220,0.35);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s;
  }
  .hc-dot.active {
    width: 28px;
    background: #f59e0b;
  }

  /* Arrow buttons */
  .hc-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid rgba(255,245,220,0.2);
    background: rgba(255,245,220,0.08);
    backdrop-filter: blur(8px);
    color: #fffdf7;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.25s, border-color 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hc-arrow:hover {
    background: rgba(245, 158, 11, 0.25);
    border-color: rgba(245, 158, 11, 0.5);
    transform: translateY(-50%) scale(1.1);
  }
  .hc-arrow-prev { left: 18px; }
  .hc-arrow-next { right: 18px; }

  /* Progress bar */
  .hc-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #d97706, #f59e0b);
    border-radius: 0 2px 0 0;
    z-index: 10;
    animation: hcProgress 4s linear infinite;
  }
  @keyframes hcProgress {
    from { width: 0%; }
    to   { width: 100%; }
`;

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
    setKey(k => k + 1);
  }, []);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const t = setTimeout(() => goTo((current + 1) % slides.length), 4000);
    return () => clearTimeout(t);
  }, [current, goTo]);

  return (
    <>
      <style>{styles}</style>
      <div className="hc-root">
        {/* Deco leaf */}
        <svg className="hc-deco" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10 C160 10 190 60 190 100 C190 160 140 190 100 190 C40 190 10 150 10 100 C10 50 40 10 100 10Z" fill="#f59e0b"/>
          <path d="M100 10 L100 190 M10 100 L190 100 M30 40 L170 160 M170 40 L30 160" stroke="#1a0f05" strokeWidth="1.5"/>
        </svg>

        {slides.map((slide, i) => (
          <div key={i} className={`hc-slide ${i === current ? 'active' : ''}`}>
            <img src={slide.img} alt={slide.tag} />
            <div className="hc-overlay" />
            <div className="hc-content">
              <div className="hc-tag">
                <span className="hc-tag-dot" />
                {slide.tag}
              </div>
              <h2 className="hc-title">{slide.title}</h2>
              <p className="hc-sub">{slide.sub}</p>
            </div>
          </div>
        ))}

        {/* Bottom leaf wave */}
        <div className="hc-wave">
          <svg viewBox="0 0 800 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{display:'block'}}>
            <path d="M0,30 C133,60 266,0 400,30 C533,60 666,0 800,30 L800,60 L0,60 Z" fill="rgba(15,8,2,0.45)"/>
          </svg>
        </div>

        {/* Dots */}
        <div className="hc-dots">
          {slides.map((_, i) => (
            <button key={i} className={`hc-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />
          ))}
        </div>

        {/* Arrows */}
        <button className="hc-arrow hc-arrow-prev" onClick={prev} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button className="hc-arrow hc-arrow-next" onClick={next} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Progress bar */}
        <div className="hc-progress" key={key} />
      </div>
    </>
  );
};

export default Carousel;