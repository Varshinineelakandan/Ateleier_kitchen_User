import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import logo from '../logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const updateQty = (index, change) => {
    const updated = [...cart];
    updated[index].qty += change;

    if (updated[index].qty <= 0) {
      updated.splice(index, 1);
    }

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.amount * item.qty,
    0
  );


  return (
    <div className="cart-wrapper">
      <div className="cart-left">
        <h2>Your Order</h2>

        {cart.length === 0 ? (
          <>
            <p className="empty">Your cart feels lonely 😢</p>
            <button className="backtomenu-btn" onClick={() => navigate("/Recommendations")}>Back to menu</button>
          </>
        ) : (
          cart.map((item, i) => (
            <div key={i} className="cart-item">
              <button
                className="remove-btn"
                onClick={() => updateQty(i, -item.qty)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <img src={item.image} alt={item.food_name} />

              <div className="details">
                <h3>{item.food_name}</h3>
                <p className="price">₹{item.amount}</p>

                <div className="qty">
                  <button onClick={() => updateQty(i, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(i, 1)}>+</button>
                </div>
              </div>


              <div className="item-total">
                ₹{item.amount * item.qty}
              </div>

            </div>

          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-right">
          <div className="header">
            <img src={logo} className='logo-design' alt='Logo'/>
            <h1 className="firstname">ATELIER <span className='heading'>KITCHEN</span></h1>

          </div>
          <h3>Bill Summary</h3>
          <div className="bill-items">
            {cart.map((item, i) => (
              <div key={i} className="bill-item">
                <span>
                  {item.food_name} × {item.qty}
                </span>
                <span>₹{item.amount * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="bill-row">
            <span>Delivery</span>
            <span>₹40</span>
          </div>

          <div className="bill-row total-row">
            <span>Total</span>
            <span>₹{total + 40}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => {
              localStorage.setItem("currentOrder", JSON.stringify(cart));
              navigate("/payment");
            }}
          >
            Checkout →
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;