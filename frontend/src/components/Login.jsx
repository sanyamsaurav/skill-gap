import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const Login = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)' }}>
      <SignIn routing="path" path="/login" signUpUrl="/register" fallbackRedirectUrl="/dashboard" />
    </div>
  );
};
