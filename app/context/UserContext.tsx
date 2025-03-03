import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the User Type with additional fields
interface User {
  name: string;
  email: string;
  avatar: string | null;
  initials: string | null;
  height?: string;
  weight?: string;
  age?: string;
}

// Define the context type
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    avatar: null,
    initials: null,
    height: '',
    weight: '',
    age: '',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to access the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
