import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface UserContextObject {
  user: any;
  username?: string;
  userPhoto?: string;
  userRole?: string;
}

const UserContext = createContext({} as UserContextObject);

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserContextProvider = ({ children }: any) => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user_info') || '{}'))
    setUsername(localStorage.getItem('user_name') || undefined);
    setUserPhoto(localStorage.getItem('user_picture') || undefined);
    setUserRole(localStorage.getItem('role') || undefined);
  },[location]);


  const value = {
    user,
    username,
    userPhoto,
    userRole
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
