
import React, { useState, useCallback } from 'react';
import PasswordGate from './components/PasswordGate';
import AlbumPage from './components/AlbumPage';
import { CORRECT_PASSWORD } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  return (
    <div className="bg-brand-light font-sans text-brand-dark">
      {isAuthenticated ? (
        <AlbumPage />
      ) : (
        <PasswordGate 
          correctPassword={CORRECT_PASSWORD} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
    </div>
  );
};

export default App;
