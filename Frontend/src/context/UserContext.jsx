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



// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { id, name, role }
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/verify-token', {
//           withCredentials: true,
//         });

//         if (res.data.valid) {
//           setUser(res.data.user); // { id, name, role }
//         } else {
//           setUser(null);
//         }
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
