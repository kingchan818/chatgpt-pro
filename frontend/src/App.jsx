import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isNil, isEmpty } from 'lodash';
import Home from './pages/Home';
import Login from './pages/Login';
import { setCurrentUser } from './redux/reducers/user.reducer';

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const userApiKey = localStorage.getItem('apiKey');
    if (!isEmpty(userApiKey)) {
      dispatch(setCurrentUser({ apiKey: userApiKey }));
    }
  }, [dispatch]);

  return (
    <BrowserRouter basename="/">
      <Routes>{isNil(currentUser) ? <Route path="/" Component={Login} /> : <Route path="/" Component={Home} />}</Routes>
    </BrowserRouter>
  );
}

export default App;
