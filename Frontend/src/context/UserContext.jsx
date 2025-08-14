import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('name');
    return storedUser ? storedUser : null;
  });

  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem('role');
    return storedRole ? storedRole : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('name', user);
      localStorage.setItem('role', role)
    }
  }, [user, role]);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

