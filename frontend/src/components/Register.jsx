import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export const Register = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-color)', padding: '2rem' }}>
      <SignUp routing="path" path="/register" signInUrl="/login" fallbackRedirectUrl="/dashboard" />
    </div>
  );
};
