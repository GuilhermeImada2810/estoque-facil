import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { AuthContext } from './authContextDef';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(isFirebaseConfigured && auth));

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('O Firebase ainda não foi configurado com as credenciais do projeto.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
      setCurrentUser({ ...userCredential.user, displayName });
    }
    return userCredential.user;
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('O Firebase ainda não foi configurado com as credenciais do projeto.');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      setCurrentUser(null);
      return;
    }
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('O Firebase ainda não foi configurado com as credenciais do projeto.');
    }
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    loading,
    isConfigured: isFirebaseConfigured,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
