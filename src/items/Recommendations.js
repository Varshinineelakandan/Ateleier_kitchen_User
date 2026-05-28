import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import foodData from "../items/data/foodData";
import { recommendDishes, recommendDesserts, recommendJuices } from "../items/recommend";
import "./Recommendations.css";


const DishCard = ({ dish, onOrder, toast, count, navigate }) => (
  <div className="card">
    <img src={dish.image} alt={dish.food_name} />
    <div className="card-body">
      <h3>{dish.food_name}</h3>
      <p className="desc">{dish.description}</p>
      <p className="rating">⭐ {dish.rating}</p>
      <p className="price">₹{dish.amount}</p>
      <button className="btn-recommend" onClick={() => onOrder(dish)}>
        Add to cart
      </button>
      
      {toast.show && toast.id === dish.food_id && (
        <div className="toast">{toast.message}</div>
      )}
    </div>
    <div className="floating-cart" onClick={() => navigate("/cart")}>
      🛒
      {count > 0 && <span className="cart-badge">{count}</span>}
    </div>
  </div>
);

function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPrefs = location.state;

  const [results, setResults] = useState([]);
  const [dessertResults, setDessertResults] = useState([]);
  const [juiceList, setJuiceList] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", id: null });
  const [count, setCount] = useState(0);

  
  useEffect(() => {
    const mainDishes = recommendDishes(foodData, selectedPrefs);
    setResults(mainDishes);

    const desserts = recommendDesserts(foodData, selectedPrefs);
    setDessertResults(desserts);

    const juices = recommendJuices(foodData, selectedPrefs);
    setJuiceList(juices);
  }, [selectedPrefs]);

  
  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCount(total);
  };

  useEffect(() => {
    loadCartCount();
    window.addEventListener("storage", loadCartCount);
    return () => window.removeEventListener("storage", loadCartCount);
  }, []);

  const handleOrder = (dish) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const already = existingCart.find((item) => item.food_name === dish.food_name);
    if (already) {
      already.qty = (already.qty || 1) + 1;
    } else {
      existingCart.push({ ...dish, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setToast({ show: true, message: `${dish.food_name} added to cart!`, id: dish.food_id });
    loadCartCount();
    setTimeout(() => setToast({ show: false, message: "", id: null }), 2000);
  };

  return (
    <div className="recommendations">

      
      <h2>MAIN COURSE DISHES</h2>
      <div className="grid-recommend">
        {results.map((dish) => (
          <DishCard
            key={dish.food_id}
            dish={dish}
            onOrder={handleOrder}
            toast={toast}
            count={count}
            navigate={navigate}
          />
        ))}
      </div>

      
      {dessertResults.length > 0 && (
        <>
          <h2>DESSERTS</h2>
          <div className="grid-recommend">
            {dessertResults.map((dish) => (
              <DishCard
                key={dish.food_id}
                dish={dish}
                onOrder={handleOrder}
                toast={toast}
                count={count}
                navigate={navigate}
              />
            ))}
          </div>
        </>
      )}

      
      {juiceList.length > 0 && (
        <>
          <h2>JUICES</h2>
          <div className="grid-recommend">
            {juiceList.map((dish) => (
              <DishCard
                key={dish.food_id}
                dish={dish}
                onOrder={handleOrder}
                toast={toast}
                count={count}
                navigate={navigate}
              />
            ))}
          </div>
        </>
      )}

      <button className="other-btn" onClick={() => navigate("/Preferences")}>
        OTHER PREFERENCES
      </button>
    </div>
  );
}

export default Recommendations;