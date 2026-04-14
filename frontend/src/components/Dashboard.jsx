import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import { FileUp, Search, ChevronRight, FileText } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

export const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/reports/${user.id}`)
        .then(res => {
          if (res.data.success) {
            setReports(res.data.reports);
          }
        })
        .catch(err => console.error("Error fetching reports", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);
  return (
    <Layout>
      <div style={{ maxWidth: '1000px' }}>
        
        <div style={{ marginBottom: '2.5rem' }}>
          <h2>Curated Overview</h2>
          <p style={{ fontSize: '1rem' }}>Welcome back. Your professional trajectory is trending upward.</p>
        </div>
        
        <div className="flex flex-col-mobile gap-6" style={{ marginBottom: '3rem' }}>
          
          <div className="card text-center flex-col items-center justify-center" style={{ flex: 1, padding: '2rem' }}>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Current Match Score</div>
            <div style={{ padding: '0.5rem', borderRadius: '50%', border: '8px solid var(--primary-color)', borderRightColor: 'var(--border-light)', width: '140px', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>78%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.25rem' }}>+4% this week</span>
            </div>
            <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your skills align closely with<br/><span style={{fontWeight: 600, color: 'var(--text-primary)'}}>Principal Designer</span> roles in FinTech.</div>
          </div>
          
          <div className="card text-center flex-col justify-center" style={{ flex: 1, padding: '2rem', background: '#F8FAFC' }}>
             <div style={{ color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Total Analyses</div>
             <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '1rem' }}>24</div>
             <p style={{ margin: 0, fontSize: '0.875rem' }}>Comprehensive reports generated<br/>across 8 different industry sectors.</p>
          </div>

          <div className="card flex-col" style={{ flex: 1, padding: '2rem' }}>
             <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
               <div style={{ color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Roadmap Progress</div>
               <span className="pill" style={{ background: 'var(--sidebar-active-bg)', color: 'var(--primary-color)' }}>In Progress</span>
             </div>
             
             <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
               12 <span style={{ fontSize: '1.25rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>/ 18</span>
             </div>

             <div className="flex gap-2" style={{ marginBottom: '1.5rem' }}>
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} style={{ height: '6px', flex: 1, background: i <= 4 ? 'var(--primary-color)' : 'var(--border-light)', borderRadius: '3px' }}></div>
               ))}
             </div>
             
             <p style={{ margin: 0, fontSize: '0.75rem' }}>Next Milestone: <strong style={{color: 'var(--text-primary)'}}>System Architecture Certificate</strong></p>
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Start</h3>
        <div className="flex flex-col-mobile gap-6" style={{ marginBottom: '3rem' }}>
          <Link to="/upload" className="card" style={{ flex: 1, background: '#F1F5F9', border: 'none', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', padding: '2rem', transition: 'transform 0.2s' }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}><FileUp size={24} /></div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Upload New Resume</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Refresh your profile with your latest<br/>achievements and technical skills.</div>
          </Link>
          
          <Link to="/upload" className="card" style={{ flex: 1, background: '#F1F5F9', border: 'none', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', padding: '2rem', transition: 'transform 0.2s' }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}><Search size={24} /></div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Analyze Job Description</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Paste a job posting to see how you measure<br/>up against the requirements.</div>
          </Link>
        </div>

        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Reports</h3>
          <a href="#" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none' }}>View All Analysis</a>
        </div>
        
        <div className="flex-col gap-4">
          {loading ? (
            <div className="card text-center" style={{ padding: '2rem' }}>Loading recent reports...</div>
          ) : reports.length > 0 ? (
            reports.map((item, i) => {
              // Determine tag and styling based on matchScore
              let tag = 'OKAY MATCH';
              let color = '#3B82F6';
              let bg = '#EFF6FF';
              
              if (item.matchScore >= 80) {
                tag = 'HIGH MATCH'; color = '#10B981'; bg = '#ECFDF5';
              } else if (item.matchScore < 60) {
                tag = 'CRITICAL GAPS'; color = '#6B7280'; bg = '#F3F4F6';
              } else if (item.matchScore >= 60 && item.matchScore < 80) {
                tag = 'GAP IDENTIFIED'; color = '#F59E0B'; bg = '#FFFBEB';
              }

              const dateStr = new Date(item.createdAt).toLocaleDateString();

              return (
                <button key={i} onClick={() => navigate('/analysis', { state: { analysisData: item.data || item.analysisPayload, jobDescription: item.jobTitle } })} className="card flex items-center justify-between hover-elevate transition-all" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', width: '100%', textAlign: 'left', border: '1px solid var(--border-light)', background: 'white', cursor: 'pointer' }}>
                   <div className="flex items-center gap-4">
                     <div style={{ padding: '0.75rem', background: 'var(--sidebar-active-bg)', color: 'var(--primary-color)', borderRadius: '8px' }}><FileText size={20}/></div>
                     <div>
                       <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.jobTitle}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Analyzed on {dateStr} • {item.matchScore}% Match</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="pill" style={{ background: bg, color: color, fontSize: '0.65rem', letterSpacing: '0.05em' }}>{tag}</span>
                     <ChevronRight size={18} color="var(--text-tertiary)" />
                   </div>
                </button>
              );
            })
          ) : (
             <div className="card text-center text-gray-500" style={{ padding: '2.5rem' }}>No recent reports found. Start by analyzing a resume!</div>
          )}
        </div>

      </div>
    </Layout>
  );
};
