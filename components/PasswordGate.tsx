
import React, { useState, FormEvent } from 'react';

interface PasswordGateProps {
  correctPassword?: string;
  onLoginSuccess: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ correctPassword = 'password123', onLoginSuccess }) => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === correctPassword) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/1920/1080?grayscale&blur=5)` }}>
      <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-2xl text-center max-w-sm w-full mx-4">
        <h1 className="font-serif text-2xl md:text-3xl text-brand-dark mb-2">Private Album</h1>
        <p className="text-brand-dark/70 mb-6 font-sans">Please enter the password to view this gallery.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 text-center border-b-2 border-brand-gold/50 bg-transparent focus:outline-none focus:border-brand-gold transition-colors"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-brand-gold text-white font-semibold py-3 rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Unlock Memories
          </button>
        </form>
        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordGate;
