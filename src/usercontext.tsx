import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface UserContextObject {
  user: any;
  username: string | null;
  userPhoto: string | null;
  userRole: string | null;
}

const AuthContext = createContext({} as UserContextObject);

export const useUserContext = () => {
  return useContext(AuthContext);
};

export const UserContext = ({ children }: any) => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
      setUser(JSON.parse(localStorage.getItem('user_info') || ''))
      setUsername(localStorage.getItem('user_name'));
      setUserPhoto(localStorage.getItem('user_picture'));
      setUserRole(localStorage.getItem('role'));
  },[location]);


  const value = {
    user,
    username,
    userPhoto,
    userRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
