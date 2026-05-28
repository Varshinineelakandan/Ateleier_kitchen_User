import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TableSelect.css";

export default function TableSelect() {
  const [selected, setSelected] = useState(null);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tables?t=${Date.now()}`)
      .then((res) => setTables(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getStatus = (num) => {
    const table = tables.find((t) => t.tableNumber === num);
    if (table && table.status === "Occupied") return "occupied";
    if (selected === num) return "selected";
    return "available";
  };

  const handleSelect = (num) => {
    const table = tables.find((t) => t.tableNumber === num);
    if (table && table.status === "Occupied") return;

    const newSelection = selected === num ? null : num;
    setSelected(newSelection);

    if (newSelection) {
      localStorage.setItem("tableNumber", newSelection);
    }
  };

  const handleContinue = () => {
    if (!selected) {
      alert("Please select a table");
      return;
    }
    navigate("/Preferences");
  };

  return (
    <div className="wrapper">
      <div className="main-box">
        <div className="headers">
          <h1 className="titles">Select Your Table</h1>
          <p className="subtitles">Choose an available table</p>
        </div>

        {/* ✅ Only one map — 1 to 20, checks DB for occupied */}
        <div className="grid">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
            const status = getStatus(num);
            return (
              <button
                key={num}
                className={`btn ${status}`}
                onClick={() => handleSelect(num)}
                disabled={status === "occupied"}
              >
                <span className="tableLabel">Table</span>
                <br />
                <span className="tableNum">{num}</span>
              </button>
            );
          })}
        </div>

        <div className="statusBar">
          {selected ? (
            <p className="statusText success">
              ✓ Table <strong>{selected}</strong> selected
            </p>
          ) : (
            <p className="statusText">No table selected</p>
          )}
        </div>

        <button className="continueBtn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}