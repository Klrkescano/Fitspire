import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a TypeScript type for the user
interface User {
  name: string;
  email: string;
  avatar: string | null;
  initials: string | null;
}

// Define the context type
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

// Create the context with an initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the UserProvider component to wrap around your app
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    avatar: null,
    initials: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to access the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; // Ensure the default export is there
