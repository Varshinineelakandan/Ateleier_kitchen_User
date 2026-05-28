import logo from './logo.png';
import './App.css';
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <img src ={logo} className='logo'/>
      <h1>ATELIER <span className='heading'>KITCHEN</span></h1><br/>
      <p className='typing'>A CREATIVE STUDIO WHERE FOOD IS CRAFTED LIKE ART</p>
      <button className='btn-app' onClick={()=>navigate('/TableSelect')}> EXPLORE </button>
    </div>
  );
}

export default App;
