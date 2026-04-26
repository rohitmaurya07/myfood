import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useDispatchCart } from './ContextReducer';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap');

  .food-card {
    font-family: 'DM Sans', sans-serif;
    width: 300px;
    border-radius: 24px;
    overflow: hidden;
    background: #fffdf7;
    box-shadow:
      0 4px 6px rgba(60, 40, 10, 0.06),
      0 12px 40px rgba(60, 40, 10, 0.1);
    position: relative;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
    border: 1px solid rgba(200, 170, 100, 0.2);
  }
  .food-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 8px 12px rgba(60, 40, 10, 0.08),
      0 24px 60px rgba(60, 40, 10, 0.15);
  }

  /* Image area */
  .food-card__img-wrap {
    position: relative;
    height: 210px;
    overflow: hidden;
    background: #f5ede0;
  }
  .food-card__img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .food-card:hover .food-card__img-wrap img {
    transform: scale(1.06);
  }
  .food-card__badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(6px);
    border-radius: 50px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;
    color: #5a3e1b;
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid rgba(200, 160, 80, 0.25);
  }
  .food-card__badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e8a020;
  }
  .food-card__leaf {
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }
  .food-card__leaf svg {
    display: block;
  }

  /* Body */
  .food-card__body {
    padding: 20px 22px 22px;
  }
  .food-card__name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #2d1f0e;
    margin: 0 0 14px;
    line-height: 1.2;
    text-decoration: none;
    display: block;
    transition: color 0.2s;
  }
  .food-card__name:hover { color: #b86b0a; }

  .food-card__controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 18px;
  }
  .food-card__label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9a7a55;
    margin-bottom: 5px;
  }
  .food-card__select,
  .food-card__input {
    width: 100%;
    border: 1.5px solid #e5d5bb;
    border-radius: 10px;
    padding: 8px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #2d1f0e;
    background: #fdf8f0;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }
  .food-card__select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b86b0a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
  }
  .food-card__select:focus,
  .food-card__input:focus {
    border-color: #c8860a;
    box-shadow: 0 0 0 3px rgba(200, 134, 10, 0.12);
  }

  .food-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px dashed rgba(180, 150, 80, 0.3);
  }
  .food-card__price-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9a7a55;
    margin-bottom: 1px;
  }
  .food-card__price {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #2d1f0e;
    line-height: 1;
  }
  .food-card__btn {
    display: flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, #d97706, #b45309);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 10px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(180, 83, 9, 0.35);
  }
  .food-card__btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(180, 83, 9, 0.45);
  }
  .food-card__btn:active { transform: scale(0.97); }
  .food-card__btn svg { flex-shrink: 0; }
`;

function Card(props) {
  const [foodSize, setFoodSize] = useState();
  const [qty, setQty] = useState(1);
  let price = props.options;
  let finalPrice = price[foodSize] * qty;
  let priceRef = useRef();
  let dispatch = useDispatchCart();
  let cartState = useCart();

  let addCart = async () => {
    let checkToken = localStorage.getItem("authToken");
    if (!checkToken) {
      alert("Please Login To Add To Cart");
      return;
    }
    await dispatch({
      type: "ADD",
      id: props.foodData._id,
      name: props.foodData.name,
      price: finalPrice,
      img: props.foodData.img,
      qty: qty
    });
  };

  let size = Object.keys(props.options);

  useEffect(() => {
    setFoodSize(priceRef.current.value);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="food-card">
        {/* Image */}
        <Link to="/" className="food-card__img-wrap">
          <img src={props.foodData.img} alt={props.foodData.name} />
          <div className="food-card__badge">
            <span className="food-card__badge-dot" />
            5.0 ★
          </div>
          {/* Leaf wave divider */}
          <div className="food-card__leaf">
            <svg viewBox="0 0 300 28" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,14 C50,28 100,0 150,14 C200,28 250,0 300,14 L300,28 L0,28 Z" fill="#fffdf7" />
            </svg>
          </div>
        </Link>

        {/* Body */}
        <div className="food-card__body">
          <Link to="/" className="food-card__name">{props.foodData.name}</Link>

          <div className="food-card__controls">
            {/* Quantity */}
            <div>
              <div className="food-card__label">Qty</div>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="food-card__input"
              />
            </div>

            {/* Size */}
            <div>
              <div className="food-card__label">Size</div>
              <select
                ref={priceRef}
                value={foodSize}
                onChange={(e) => setFoodSize(e.target.value)}
                className="food-card__select"
              >
                {!size.length ? (
                  <option>None</option>
                ) : (
                  size.map((data, index) => (
                    <option key={index} value={data}>{data}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="food-card__footer">
            <div>
              <div className="food-card__price-label">Total</div>
              <div className="food-card__price">₹{finalPrice || 0}</div>
            </div>
            <button onClick={addCart} className="food-card__btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;