import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Navbar } from './components/Navbar';
import { useAuth } from './context/AuthContext';
import LocationsList from './pages/List';
import Location from './pages/Locations';

function App() {

  const { user } = useAuth();

  return (
    <>

      <BrowserRouter>
        {user === null ? null : <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={user === null ? <Login /> : <Home />} />
          <Route path="/list" element={user === null ? <Login /> : <LocationsList />} />
          <Route path="/location/:id" element={user === null ? <Login /> : <Location />} />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
