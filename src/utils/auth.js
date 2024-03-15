// utils/auth.js
import { useEffect, useState } from 'react';
import { auth } from '../firebase';

export const useAuthentication = (router) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);

      if (!authUser && router.pathname !== '/signin') {
        // If not authenticated and not on the signin page, redirect to signin
        router.replace('/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user };
};
