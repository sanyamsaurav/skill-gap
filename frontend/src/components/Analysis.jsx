import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './Layout';
import { useUser } from '@clerk/clerk-react';
import { GoPro } from './GoPro';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

export const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const isPro = user?.publicMetadata?.isPremium || false;

  // Read the AI payload from the URL state router
  const analysisData = location.state?.analysisData || null;
  const jobTitle = location.state?.jobTitle || 'Target Job Profile';

  // Fallback defaults in case they arrive without state
  const radarData = analysisData?.gapAnalysisMatrix || [
    { subject: 'Leadership', A: 85, fullMark: 100 },
    { subject: 'Technical', A: 45, fullMark: 100 },
    { subject: 'Strategy', A: 75, fullMark: 100 },
    { subject: 'Data Viz', A: 60, fullMark: 100 },
    { subject: 'Soft Skills', A: 90, fullMark: 100 },
  ];
  const matchScore = analysisData?.matchScore || 65;
  const matchedSkills = analysisData?.skillInventory?.matched || ['Team Leadership', 'SQL', 'Tableau'];
  const missingSkills = analysisData?.skillInventory?.missing || ['Python', 'Cloud Architecture'];
  const recommendation = analysisData?.aiRecommendation || "Focus on improving technical backend competencies to raise your score.";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Skill Gap Analysis: ${jobTitle}`,
        text: `Check out my skill gap analysis for the ${jobTitle} role! I got a match score of ${matchScore}%.`,
        url: window.location.href,
      }).catch((err) => {
        console.error("Share failed:", err);
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleExportPdf = () => {
    window.print();
  };


  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div className="flex justify-between items-end" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Job Analysis › <span style={{color: 'var(--primary-color)', fontWeight: 600}}>Analysis Results</span></div>
            <h1 style={{ fontSize: '2.5rem', margin: '0', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>{jobTitle.length > 30 ? jobTitle.substring(0, 30) + '...' : jobTitle}</h1>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1rem' }}>Detailed skill variance for your target role based on your uploaded resume.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleShare} className="btn" style={{ background: '#F1F5F9', color: 'var(--text-primary)' }}>Share Report</button>
            <button onClick={handleExportPdf} className="btn" style={{ background: '#F1F5F9', color: 'var(--text-primary)' }}>Export PDF</button>
          </div>
        </div>

        <div className="flex gap-6">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card text-center flex-col items-center justify-center" style={{ padding: '2rem' }}>
              <div className="flex justify-between items-center w-100" style={{ width: '100%', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Match Score</h3>
                <span className="pill" style={{ background: matchScore > 75 ? '#D1FAE5' : (matchScore > 50 ? '#FEF3C7' : '#FEE2E2'), color: matchScore > 75 ? '#059669' : (matchScore > 50 ? '#D97706' : '#DC2626'), fontSize: '0.65rem' }}>
                  {matchScore > 75 ? 'STRONG' : (matchScore > 50 ? 'MODERATE' : 'WEAK')}
                </span>
              </div>
              <p style={{ textAlign: 'left', width: '100%', margin: 0, fontSize: '0.875rem' }}>Probability of interview based on current profile.</p>

              <div style={{ margin: '2rem 0', padding: '0.5rem', borderRadius: '50%', border: `12px solid ${matchScore > 75 ? '#10B981' : (matchScore > 50 ? '#F59E0B' : '#EF4444')}`, borderRightColor: 'var(--border-light)', borderBottomColor: '#E0E7FF', width: '160px', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{matchScore}<span style={{fontSize: '1.5rem'}}>%</span></span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-primary)', letterSpacing: '0.05em', fontWeight: 700, marginTop: '0.25rem' }}>ALIGNMENT</span>
              </div>

              <div className="flex gap-4 w-100" style={{ width: '100%' }}>
                <div style={{ flex: 1, background: '#F8FAFC', padding: '1rem', borderRadius: '12px', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Peer Percentile</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>Top {Math.max(1, 100 - matchScore)}%</div>
                </div>
                <div style={{ flex: 1, background: '#F8FAFC', padding: '1rem', borderRadius: '12px', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Demand Rating</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#EF4444' }}>High</div>
                </div>
              </div>
            </div>

            <div className="card text-center" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', textAlign: 'left', marginBottom: '1rem' }}>Gap Analysis Matrix</h3>
              <div style={{ height: '280px', width: '100%', margin: '0 auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                    <PolarGrid gridType="polygon" stroke="var(--border-light)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skills" dataKey="A" stroke="var(--primary-color)" strokeWidth={2} fill="var(--sidebar-active-bg)" fillOpacity={0.8} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '2rem', flex: 1 }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Skill Inventory</h3>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  <span style={{ color: 'var(--success-text)', marginRight: '0.5rem' }}>●</span> MATCHED SKILLS ({matchedSkills.length})
                </div>
                <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                  {matchedSkills.map(s => (
                    <span key={s} style={{ background: 'var(--success-bg)', color: '#059669', padding: '0.5rem 1rem', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 500 }}>
                      <span style={{marginRight: '0.25rem'}}>✓</span> {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  <span style={{ color: 'var(--danger-text)', marginRight: '0.5rem' }}>●</span> MISSING SKILLS ({missingSkills.length})
                </div>
                <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                  {missingSkills.map(s => (
                    <span key={s} style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.5rem 1rem', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 500 }}>
                      <span style={{marginRight: '0.25rem'}}>!</span> {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--primary-color)' }}>
                <div className="flex items-start gap-4">
                   <div style={{ background: '#E0E7FF', color: 'var(--primary-color)', padding: '0.5rem', borderRadius: '8px' }}>🧠</div>
                   <div>
                     <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>AI Recommendation</div>
                     <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{recommendation}</div>
                   </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Global Bottom Gateway Action Bar */}
        <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)', borderRadius: '24px', padding: '3rem', color: 'white', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Ready to bridge the gap?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem' }}>We've identified a clear 30-day path to master the {missingSkills.length} critical missing technical skills for {jobTitle}.</p>
          </div>
          
          {isPro ? (
             <button onClick={() => navigate('/roadmap', { state: { roadmapData: analysisData?.learningRoadmap, jobTitle } })} className="btn" style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2rem', fontSize: '1.125rem', fontWeight: 700 }}>Generate Learning Roadmap →</button>
          ) : (
             <GoPro 
               text="Unlock Learning Roadmap →" 
               customStyle={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2rem', fontSize: '1.125rem', fontWeight: 700 }}
               className="btn"
               onSuccess={() => navigate('/roadmap', { state: { roadmapData: analysisData?.learningRoadmap, jobTitle } })}
             />
          )}
        </div>

      </div>
    </Layout>
  );
};
