import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import { CurrentUserContext } from '../constexts/CurrentUserContext';
import Login from './Login';
import Register from './Register';
import Page from './Page';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';

function App() {
  // State currentUser, который будет хранить информацию о пользователе
  const [currentUser, setCurrentUser] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('is-login')) {
      api.userInfo()
        .then((userInfo) => {
          setCurrentUser({
            ...userInfo,
          });
          setIsAuthenticated(true);
          navigate('/page');
        })
        .catch((error) => {
          if (error.includes(401)) {
            navigate('/sign-in');
          }
          console.error('Ошибка получение информации о пользователе:', error);
        });
    } else {
      navigate('/sign-in');
    }

  }, []);

  const ProtectedPage = (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      element={Page}
      setCurrentUser={setCurrentUser}
    />
  );

  const LoginPage = (
    <Login
      setIsSuccess={setIsSuccess}
      setIsPopupOpen={setIsPopupOpen}
      setIsAuthenticated={setIsAuthenticated}
    />
  );

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        email={currentUser.email}
        setIsAuthenticated={setIsAuthenticated}
        isAuthenticated={isAuthenticated}
      />
      <Routes>
        {/* Роут для страницы регистрации */}
        <Route
          path="/sign-up"
          element={<Register setIsSuccess={setIsSuccess} setIsPopupOpen={setIsPopupOpen}/>}
        />
        {/* Роут для страницы входа */}
        <Route path="/sign-in" element={LoginPage}/>
        {/* Роут для авторизованных пользователей */}
        <Route
          path="/page"
          element={ProtectedPage}
        />
      </Routes>
      {/* Попап InfoTooltip */}
      <InfoTooltip isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}
                   isSuccess={isSuccess}/>
    </CurrentUserContext.Provider>
  );
}

export default App;
