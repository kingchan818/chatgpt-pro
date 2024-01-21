import React, { useEffect } from 'react';
import toaster, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import LoginCard from '../components/LoginCard';

function Login() {
  const { error } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toaster.error(error.message);
    }
  }, [error]);

  return (
    <div className="h-[100vh] bg-black flex items-center justify-center">
      <LoginCard />
      <Toaster position="bottom-right" reverseOrder />
    </div>
  );
}

export default Login;
