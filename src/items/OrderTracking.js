import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderTracking.css";
import logo from "./logo.png";

export default function OrderTracking() {
  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("currentOrder")) || [];
    setOrderItems(data);
  }, []);

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.amount * (item.qty || 1),
    0
  );

  const delivery = 40;
  const total = subtotal + delivery;

  return (
    <div className="tracking-page">

      {/* HEADER */}
      <div className="tracking-header">
        <div className="tracking-brand">
          <img src={logo} className="tracking-logo" alt="logo" />

          <h1 className="tracking-brand-name">
            ATELIER <span className="brand-accent">KITCHEN</span>
          </h1>
        </div>

        <h2 className="tracking-title">ORDER SUMMARY</h2>
      </div>

      {/* ORDER SUMMARY */}
      <div className="summary-card">

        <h2 className="summary-heading">Your Order</h2>

        {orderItems.length === 0 ? (
          <p className="no-order">No order found.</p>
        ) : (
          <>
            <div className="summary-items">

              {orderItems.map((item, i) => (
                <div key={i} className="summary-item">

                  <span className="item-name">
                    {item.food_name}
                    <span className="item-qty">
                      {" "}× {item.qty || 1}
                    </span>
                  </span>

                  <span className="item-price">
                    ₹{item.amount * (item.qty || 1)}
                  </span>

                </div>
              ))}

            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>₹{delivery}</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </>
        )}
      </div>

      {/* BUTTONS */}
      <div className="tracking-actions">

        <button
          className="btn btn-primary"
          onClick={() => navigate("/Preferences")}
        >
          Order Again
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Home
        </button>

      </div>
    </div>
  );
}