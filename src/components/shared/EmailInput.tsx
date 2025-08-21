import React, { useState } from 'react';

interface EmailInputProps {
  isVisible: boolean;
  onSubmit: (email: string) => boolean;
  onCancel: () => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  isVisible,
  onSubmit,
  onCancel
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const success = onSubmit(email);
    if (!success) {
      setError('Please enter a valid email address');
    } else {
      setEmail('');
      setError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Enter Your Email
        </h3>
        <p className="text-center mb-6 text-gray-600">
          Please enter your email address to play and claim your prize!
        </p>
        <input
          type="email"
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          onKeyPress={handleKeyPress}
        />
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
