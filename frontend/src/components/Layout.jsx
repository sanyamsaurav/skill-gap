import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Target, Map, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Chatboard } from './Chatboard';

const Sidebar = () => {
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
    <aside style={{ width: '260px', borderRight: '1px solid var(--border-light)', height: '100vh', padding: '2rem 0', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-color)' }}>
      <div style={{ padding: '0 1.5rem', marginBottom: '3rem' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          SkillGap AI
        </div>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
          The Intelligent Curator
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link to="/dashboard" className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/dashboard') }}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/upload" className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/upload') }}>
          <FileText size={18} /> Resume Analysis
        </Link>
        <Link to="/analysis" className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/analysis') }}>
          <Target size={18} /> Job Gap
        </Link>
        <Link to="/roadmap" className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/roadmap') }}>
          <Map size={18} /> Roadmap
        </Link>
        <Link to="/settings" className="flex items-center gap-3" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s', ...getStyle('/settings') }}>
          <Settings size={18} /> Settings
        </Link>
      </nav>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isPremium && (
          <div style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Upgrade to Pro</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Unlock advanced AI skills forecasting.</div>
            <button 
              onClick={() => navigate('/roadmap')}
              style={{ background: 'white', color: 'var(--primary-color)', border: 'none', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer' }}
            >
              Upgrade Now
            </button>
          </div>
        )}
        <Link to="/help" className="flex items-center gap-3" style={{ padding: '0.5rem', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
          <HelpCircle size={18} /> Help Center
        </Link>
      </div>
    </aside>
  );
};

export const Layout = ({ children }) => {
  const { user } = useUser();
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest';
  const isPremium = user?.unsafeMetadata?.isPremium || user?.publicMetadata?.isPremium || false;

  return (
    <div className="flex" style={{ height: '100vh', background: 'var(--bg-color)', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
        {/* Universal Top Header for Authenticated Routes */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
