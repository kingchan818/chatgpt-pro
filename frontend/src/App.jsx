import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isNil } from 'lodash';
import Home from './pages/Home';
import Login from './pages/Login';
import { setCurrentUser } from './redux/reducers/user.reducer';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';

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
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename="/">
        <Routes>{isNil(currentUser) ? <Route path="/" Component={Login} /> : <Route path="/" Component={Home} />}</Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
