import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Preferences.css";

export default function Preferences() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({
    diet: "",
    spice: "",
    hunger: "",
    budget: ""
  });

  // ✅ DEFINE THIS BEFORE USING
  const stepsData = [
    {
      question: "Veg or non-veg?",
      key: "diet",
      options: ["Vegetarian", "Non-veg", "Vegan", "No preference"]
    },
    {
      question: "Spice preference?",
      key: "spice",
      options: ["No spice", "Mild", "Medium", "Extra hot!"]
    },
    {
      question: "What Type Of Category?",
      key: "hunger",
      options: ["South Indian", "North Indian", "Chinese", "fast food"]
    },
    {
      question: "Budget?",
      key: "budget",
      options: ["Low", "Medium", "High", "Extreme High!"]
    },
    {
      question: "When do you usually eat?",
      key: "meal_time",
      options: ["Breakfast", "Lunch", "Dinner", "Night"]
    },
    
  ];

  const handleSelect = (value) => {
    const key = stepsData[step].key;

    const newPrefs = {
      ...prefs,
      [key]: value
    };

    setPrefs(newPrefs);

    setTimeout(() => {
      if (step < stepsData.length - 1) {
        setStep(step + 1);
      } else {
        // ✅ NAVIGATE WITH DATA
        navigate("/recommendations", { state: newPrefs });
      }
    }, 300);
  };

  return (
    <div className="container">
      <div className="box">
        <h1 className="heading">ADD PREFERENCES</h1>

        <div className="dots-container">
          {stepsData.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === step ? "active" : ""}`}
            ></div>
          ))}
        </div>

        <p>Step {step + 1} of {stepsData.length}</p>
        <h2>{stepsData[step].question}</h2>

        <div className="options">
          {stepsData[step].options.map((item, i) => (
            <button className="option-btn" key={i} onClick={() => handleSelect(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}