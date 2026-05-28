import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const API = "http://localhost:5000/api/orders";

  const sendOrder = async () => {
    const cart        = JSON.parse(localStorage.getItem("cart")) || [];
    const tableNumber = localStorage.getItem("tableNumber");

    console.log("Cart data:", cart);

    const total = cart.reduce((sum, item) => sum + item.amount * item.qty, 0);

    const orderData = {
      tableNumber:   tableNumber,
      items:         cart.map((i) => ({
        food_name: i.food_name,
        amount:    i.amount,
        qty:       i.qty,
      })),
      totalAmount:   total + 40,
      paymentMethod: method === "online" ? "Online" : "COD",
    };

    try {
      const res = await fetch(API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(orderData),
      });

      // ── Check HTTP status before parsing ──────────────────────────
      if (!res.ok) {
        const errText = await res.text();
        console.error("Order API error:", res.status, errText);
        alert("Failed to place order. Please try again.");
        return false;
      }

      const data = await res.json();
      console.log("Order response:", data);

      // ── Validate that we got a real MongoDB _id back ───────────────
      if (!data._id) {
        console.error("No _id in response:", data);
        alert("Order placed but tracking unavailable. Contact staff.");
        return false;
      }

      // ── Save for OrderTracking to poll ─────────────────────────────
      localStorage.setItem("currentOrderId", data._id);
      localStorage.setItem("currentOrder",   JSON.stringify(cart));

      console.log("✅ Saved currentOrderId:", data._id);
      return true;

    } catch (err) {
      console.error("Network error sending order:", err);
      alert("Network error. Please check your connection.");
      return false;
    }
  };

  const location = useLocation();
  const navigate  = useNavigate();

  const [step,   setStep]   = useState(1);
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");
  const navAmount = location.state?.amount;
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const cart  = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.amount * item.qty, 0);
    setAmount(navAmount ?? total + 40);
  }, [navAmount]);

  const upiQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=restaurant@upi&pn=FoodCart&am=${amount}&cu=INR`;

  const handleCODOrder = async () => {
    const success = await sendOrder();
    if (!success) return;               // stop if order failed
    localStorage.removeItem("cart");
    setStep(3);
    setStatus("Order Placed Successfully! Cash on Delivery");
  };

  const handleOnlinePaid = async () => {
    const success = await sendOrder();
    if (!success) return;               // stop if order failed
    localStorage.removeItem("cart");
    setStep(3);
    setStatus("Payment Successful! Order Placed");
  };

  const handleTrack = () => {
    navigate("/track");
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>🛒 Checkout</h2>

        <div className="amount-box">
          <p>Total Amount</p>
          <h1>₹{amount}</h1>
        </div>

        {/* STEP 1 — choose method */}
        {step === 1 && (
          <div className="choice-box">
            <button onClick={() => { setMethod("online"); setStep(2); }}>
              Online Payment
            </button>
            <button onClick={() => { setMethod("cod"); setStep(2); }}>
              Cash on Delivery
            </button>
          </div>
        )}

        {/* STEP 2 — online */}
        {step === 2 && method === "online" && (
          <div className="qr-section">
            <p>Scan &amp; Pay</p>
            <img src={upiQR} alt="QR Code" />
            <button className="placeorder-btn" onClick={handleOnlinePaid}>
              I Have Paid
            </button>
          </div>
        )}

        {/* STEP 2 — COD */}
        {step === 2 && method === "cod" && (
          <button className="placeorder-btn" onClick={handleCODOrder}>
            Place Order (COD)
          </button>
        )}

        {/* STEP 3 — success */}
        {step === 3 && (
          <div className="delivery-box">
            <p>{status}</p>
            <p>Preparing your food...</p>
            <p>Delivery: 30 - 45 minutes</p>
            <button className="placeorder-btn" onClick={handleTrack}>
              Track Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}