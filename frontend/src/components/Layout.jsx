import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Target, Map, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Chatboard } from './Chatboard';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { user } = useUser();
  const isPremium = user?.unsafeMetadata?.isPremium || user?.publicMetadata?.isPremium || false;

  const isActive = (route) => path === route;

  const getStyle = (route) => {
    return isActive(route) ? { 
      background: 'var(--sidebar-active-bg)', 
      color: 'var(--sidebar-active-text)', 
      borderLeft: '4px solid var(--primary-color)' 
    } : {
      color: 'var(--text-secondary)',
      borderLeft: '4px solid transparent'
    };
  };

  return (
    <>
      <div 
        className={`mobile-sidebar-overlay ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ zIndex: 50 }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '3rem' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          SkillGap AI
        </div>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
          The Intelligent Curator
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/dashboard') }}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/upload" onClick={() => setIsOpen(false)} className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/upload') }}>
          <FileText size={18} /> Resume Analysis
        </Link>
        <Link to="/analysis" onClick={() => setIsOpen(false)} className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/analysis') }}>
          <Target size={18} /> Job Gap
        </Link>
        <Link to="/roadmap" onClick={() => setIsOpen(false)} className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/roadmap') }}>
          <Map size={18} /> Roadmap
        </Link>
        <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/settings') }}>
          <Settings size={18} /> Settings
        </Link>
      </nav>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isPremium && (
          <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Upgrade to Pro</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Unlock advanced AI skills forecasting.</div>
            <button 
              onClick={() => { setIsOpen(false); navigate('/roadmap'); }}
              style={{ background: 'white', color: 'var(--primary-color)', border: 'none', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer' }}
            >
              Upgrade Now
            </button>
          </div>
        )}
        <Link to="/help" onClick={() => setIsOpen(false)} className="flex items-center gap-3" style={{ padding: '0.5rem', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
          <HelpCircle size={18} /> Help Center
        </Link>
      </div>
    </aside>
    </>
  );
};

export const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest';
  const isPremium = user?.unsafeMetadata?.isPremium || user?.publicMetadata?.isPremium || false;

  return (
    <div className="flex layout-container" style={{ height: '100vh', background: 'var(--bg-color)', overflow: 'hidden' }}>
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
        {/* Universal Top Header for Authenticated Routes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <div className="mobile-header-toggle">
             <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
               <Menu size={24} />
             </button>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
             <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
               {fullName}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserButton appearance={{ elements: { avatarBox: { width: '40px', height: '40px' } } }} />
             </div>
           </div>
        </div>
        {children}
      </main>
      <Chatboard />
    </div>
  );
};
