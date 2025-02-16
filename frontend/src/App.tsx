import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Add from './pages/Add';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';

function App() {

  const { user } = useAuth();

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={user === null ? <Login /> : <Home />} />
          <Route path="/add" element={<Add />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
