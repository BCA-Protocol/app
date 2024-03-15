// components/AuthRoute.js
"use client"
import { useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { useRouter } from 'next/router';

const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/signin');
    }
  }, [user, router]);

  return <>{children}</>;
};

export default AuthRoute;
