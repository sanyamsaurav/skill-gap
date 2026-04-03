import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { UploadResume } from './components/UploadResume';
import { Analysis } from './components/Analysis';
import { Roadmap } from './components/Roadmap';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { Guides } from './components/Guides';

function LandingPage() {
  return (
    <div className="container">
      <header className="flex justify-between items-center py-6">
        <div className="font-bold text-xl" style={{ color: 'var(--primary-color)', fontWeight: 800 }}>SkillGap AI</div>
        <nav className="flex gap-6">
          <Link to="#" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Features</Link>
          <Link to="#" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Pricing</Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      <main style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '4rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1rem' }}>AI-Powered Career Intelligence</div>
          <h1>Bridge the Gap Between Your Resume and Your Dream Job.</h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Stop guessing what skills you lack. Our AI analyzes your skills, detects critical gaps, and builds a custom learning roadmap to get you hired.</p>
          <div className="flex gap-4">
            <Link to="/register" className="btn btn-primary">Start for Free</Link>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#1F2937', padding: '2rem', borderRadius: 'var(--radius-xl)', color: 'white', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
             <div style={{ marginBottom: '1rem', opacity: 0.8 }}>Resume Match</div>
             <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary-color)' }}>78%</div>
             <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '80%', height: '100%', background: 'var(--primary-color)' }}></div></div>
                 <div style={{ height: '8px', background: '#374151', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '60%', height: '100%', background: 'var(--primary-color)' }}></div></div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Protected Route Component
const RequireAuth = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/upload" element={<RequireAuth><UploadResume /></RequireAuth>} />
        <Route path="/analysis" element={<RequireAuth><Analysis /></RequireAuth>} />
        <Route path="/roadmap" element={<RequireAuth><Roadmap /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/help" element={<RequireAuth><Help /></RequireAuth>} />
        <Route path="/guides" element={<RequireAuth><Guides /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;
