import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Add from './pages/Add';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';

function App() {


  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path = "/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
