import React from 'react';
import { UserProfile, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Bell, Shield, Wallet } from 'lucide-react';

export const Settings = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const isPremium = user?.unsafeMetadata?.isPremium || user?.publicMetadata?.isPremium || false;

  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-primary)' }}>Account Settings</h1>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Clerk Profile Component */}
          <div style={{ flex: '1 1 600px' }}>
             <UserProfile 
               appearance={{
                 elements: {
                   rootBox: {
                     width: '100%',
                     boxShadow: 'var(--shadow-md)',
                     borderRadius: 'var(--radius-lg)'
                   },
                   card: {
                     boxShadow: 'none',
                     border: '1px solid var(--border-light)'
                   }
                 }
               }}
             />
          </div>

          {/* App Specific Settings */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
               <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Wallet size={18} color="var(--primary-color)" /> Subscription
               </h2>
               <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                 You are currently on the <strong>{isPremium ? 'Pro Plan' : 'Free Plan'}</strong>.
                 {!isPremium && ' Upgrade to unlock unlimited AI analysis and real-time gap tracking.'}
               </div>
               {!isPremium ? (
                 <button onClick={() => navigate('/roadmap')} className="btn btn-primary" style={{ width: '100%' }}>Upgrade to Pro</button>
               ) : (
                 <button disabled className="btn" style={{ width: '100%', background: 'var(--success-bg)', color: 'var(--success-text)', border: 'none' }}>Pro Active ✓</button>
               )}
            </div>

            <div className="card" style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
               <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Bell size={18} color="var(--primary-color)" /> Notifications
               </h2>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                 <div style={{ fontSize: '0.875rem' }}>Email Updates</div>
                 <input type="checkbox" defaultChecked />
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                 <div style={{ fontSize: '0.875rem' }}>Job Recommendations</div>
                 <input type="checkbox" defaultChecked />
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
