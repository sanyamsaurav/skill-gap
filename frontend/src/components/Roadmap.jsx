import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import { useUser } from '@clerk/clerk-react';
import { Check, CheckCircle2, Lock, ExternalLink, RefreshCw, Map, Zap, Target, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Roadmap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const isPremium = user?.unsafeMetadata?.isPremium || user?.publicMetadata?.isPremium || false;
  const [isProcessing, setIsProcessing] = useState(false);
  const [checklistState, setChecklistState] = useState({});

  const isNodeCompleted = (idx) => {
    const state = checklistState[idx] || [false, false, false];
    return state.every(Boolean);
  };

  const isNodeActive = (idx) => {
    if (isNodeCompleted(idx)) return false; 
    if (idx === 0) return true; 
    return isNodeCompleted(idx - 1);
  };

  const toggleChecklist = (nodeIdx, itemIdx) => {
    setChecklistState(prev => {
      const current = prev[nodeIdx] || [false, false, false];
      const updated = [...current];
      updated[itemIdx] = !updated[itemIdx];
      return { ...prev, [nodeIdx]: updated };
    });
  };

  const targetJobTitle = location.state?.jobTitle || "Technical";
  const roadmapData = location.state?.roadmapData || [
    { title: "Python for Data Science", description: "Fundamental data structures, NumPy arrays...", duration: "2 Weeks", courseLinks: ["https://example.com"] },
    { title: "Foundations of Neural Networks", description: "Understanding the brain of AI. We dive into...", duration: "3 Weeks", courseLinks: ["https://example.com"] },
    { title: "Convolutional Neural Networks (CNN)", description: "Unlocking the power of Computer Vision...", duration: "2 Weeks", courseLinks: [] }
  ];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error('Failed to load payment gateway. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: 'rzp_test_SXv1gd5JfNU9an',
      amount: 499 * 100, // Amount in paise
      currency: 'INR',
      name: 'Skill Gap Pro',
      description: 'Unlock personalized AI Roadmaps',
      handler: async function (response) {
        // Frontend-only upgrade
        try {
          await user.update({ unsafeMetadata: { isPremium: true } });
          toast.success('🎉 Welcome to Pro! Roadmap Unlocked!', { duration: 4000 });
          // Note: The UI will automatically re-render because user instance updates.
        } catch (err) {
          toast.error('Payment verified but failed to update profile. Please contact support.');
        } 
      },
      prefill: {
        name: user?.firstName || 'Guest',
        email: user?.primaryEmailAddress?.emailAddress || '',
      },
      theme: { color: '#4F46E5' },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      toast.error('Payment failed: ' + response.error.description);
    });
    rzp.open();
    setIsProcessing(false);
  };

  // For demo, we are skipping the strict gate if they reach here from Analysis.
  if (!isPremium && !location.state?.roadmapData) {
    return (
      <Layout>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'var(--sidebar-active-bg)', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
               <Zap size={32} />
            </div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unlock Your Professional Trajectory</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>You have discovered a skills gap, now bridge it. Upgrade to Pro to access our AI-generated learning syllabus specifically curtailed to your resume weaknesses.</p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
            
            {/* Features Breakdown */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
               <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Why upgrade?</h3>
               
               <div className="flex items-start gap-4">
                  <div style={{ marginTop: '0.25rem', background: '#D1FAE5', color: '#059669', padding: '0.25rem', borderRadius: '50%' }}><Check size={16} strokeWidth={3} /></div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Hyper-Personalized Curriculum</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>A week-by-week timeline focusing ONLY on your exact missing skills. No generic bootcamps, just what you need to land the job.</p>
                  </div>
               </div>

               <div className="flex items-start gap-4" style={{ marginTop: '0.5rem' }}>
                  <div style={{ marginTop: '0.25rem', background: '#D1FAE5', color: '#059669', padding: '0.25rem', borderRadius: '50%' }}><Check size={16} strokeWidth={3} /></div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Curated Resource Vault</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Our AI scrapes the internet to compile the highest-rated tutorials, articles, and documentation so you don't have to search.</p>
                  </div>
               </div>
               
               <div className="flex items-start gap-4" style={{ marginTop: '0.5rem' }}>
                  <div style={{ marginTop: '0.25rem', background: '#D1FAE5', color: '#059669', padding: '0.25rem', borderRadius: '50%' }}><Check size={16} strokeWidth={3} /></div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Adaptive Pacing</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Check off milestones and click recalibrate if you fall behind. The roadmap adjusts its deadlines dynamically alongside your schedule.</p>
                  </div>
               </div>
            </div>

            {/* Pricing Card */}
            <div style={{ flex: '1 1 350px', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '28px', border: '1px solid var(--border-light)' }}>
               <div style={{ background: 'linear-gradient(180deg, white 0%, #FAFAFA 100%)', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid var(--border-color)', boxShadow: '0 12px 24px -10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                 <div style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--primary-color)', marginBottom: '1rem', textTransform: 'uppercase' }}>Lifetime Access</div>
                 <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>
                   ₹499<span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>.00</span>
                 </div>
                 <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>One time payment. Infinite roadmaps.</p>

                 <button 
                   onClick={handleUpgrade}
                   disabled={isProcessing}
                   className="btn flex items-center justify-center gap-2" 
                   style={{ 
                     background: 'var(--primary-color)', 
                     color: 'white', 
                     width: '100%', 
                     padding: '1rem', 
                     fontSize: '1rem', 
                     fontWeight: 600, 
                     borderRadius: '12px',
                     boxShadow: '0 4px 14px rgba(79, 70, 229, 0.39)',
                     transition: 'all 0.2s',
                     opacity: isProcessing ? 0.7 : 1
                   }}
                 >
                   {isProcessing ? 'Connecting...' : 'Upgrade Now'} <ArrowRight size={18} />
                 </button>
                 
                 <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Lock size={12} /> Secure Checkout powered by Razorpay
                 </div>
               </div>
            </div>

          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        
        <div className="flex justify-between items-end" style={{ marginBottom: '4rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>My Paths › <span style={{color: 'var(--primary-color)', fontWeight: 600}}>{targetJobTitle}</span></div>
            <h1 style={{ fontSize: '2.5rem', margin: '0', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>{targetJobTitle.length > 25 ? targetJobTitle.substring(0, 25) + '...' : targetJobTitle} Roadmap</h1>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1rem' }}>Your tailored learning journey to {targetJobTitle} expertise.</p>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Level 1 of {roadmapData.length}</div>
            <div className="flex gap-1">
              {roadmapData.map((_, i) => (
                <div key={i} style={{ width: '16px', height: '6px', borderRadius: '3px', background: i === 0 ? 'var(--primary-color)' : 'var(--border-light)' }}></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', paddingLeft: '4.5rem' }}>
          {/* Vertical Track with Gradient Glow */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '2rem', width: '4px', background: '#E2E8F0', borderRadius: '4px' }}></div>
          <div style={{ position: 'absolute', top: 0, height: '42%', left: '2rem', width: '4px', background: 'linear-gradient(180deg, var(--primary-color) 0%, #A855F7 100%)', borderRadius: '4px', boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)' }}></div>

          {roadmapData.map((node, index) => {
            const isActive = isNodeActive(index);
            const isCompleted = isNodeCompleted(index);
            const isLocked = !isActive && !isCompleted;
            
            if (isActive || isCompleted) {
              return (
                <div key={index} className="roadmap-active-node" style={{ position: 'relative', marginBottom: '4rem', padding: '2.5rem', borderRadius: '24px', background: isCompleted ? 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)' : 'linear-gradient(135deg, #ffffff 0%, #FAFAFF 100%)', border: isCompleted ? '1px solid #D1FAE5' : '1px solid #E0E7FF', borderLeft: isCompleted ? '6px solid #10B981' : '6px solid #A855F7', boxShadow: isCompleted ? '0 20px 40px -15px rgba(16, 185, 129, 0.15)' : '0 20px 40px -15px rgba(168, 85, 247, 0.15)', transform: 'translateY(-2px)', transition: 'all 0.4s ease' }}>
                  <div style={{ position: 'absolute', left: '-4.6rem', top: '2rem', background: isCompleted ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, var(--primary-color) 0%, #A855F7 100%)', color: 'white', width: '4.2rem', height: '4.2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: isCompleted ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px rgba(168, 85, 247, 0.5)', fontWeight: 800, fontSize: '1.25rem', border: '4px solid white', transition: 'all 0.4s ease' }}>
                    {isCompleted ? <CheckCircle2 size={32} /> : `W${index+1}`}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="flex items-center gap-3" style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: isCompleted ? '#059669' : '#A855F7', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{node.duration}</div>
                        <div style={{ height: '1px', width: '40px', background: isCompleted ? '#059669' : '#A855F7', opacity: 0.3 }}></div>
                      </div>
                      <h3 style={{ fontSize: '1.875rem', margin: '0 0 1rem 0', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>{node.title}</h3>
                      <p style={{ maxWidth: '600px', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>{node.description}</p>
                    </div>
                    {isCompleted ? (
                      <span className="pill" style={{ background: 'linear-gradient(135deg, #DCFCE7 0%, #D1FAE5 100%)', color: '#059669', fontWeight: 800, padding: '0.5rem 1rem', border: '1px solid #A7F3D0', boxShadow: '0 4px 10px rgba(5, 150, 105, 0.1)' }}>
                        <span style={{ display: 'inline-block', marginRight: '8px' }}>✓</span> COMPLETED
                      </span>
                    ) : (
                      <span className="pill" style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #E0E7FF 100%)', color: '#7E22CE', fontWeight: 800, padding: '0.5rem 1rem', border: '1px solid #D8B4FE', boxShadow: '0 4px 10px rgba(126, 34, 206, 0.1)' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#9333EA', borderRadius: '50%', marginRight: '8px', animation: 'pulse 2s infinite' }}></span> ACTIVE FOCUS
                      </span>
                    )}
                  </div>

                  <div className="flex gap-8 mt-6" style={{ marginTop: '2.5rem' }}>
                    <div style={{ flex: 1.2 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>CURATED RESOURCES</div>
                      <div className="flex flex-col gap-4">
                        {node.courseLinks && node.courseLinks.length > 0 ? node.courseLinks.map((link, j) => (
                          <a key={j} href={link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                            <div className="resource-card flex items-center justify-between p-4 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.2s', cursor: 'pointer' }}>
                              <div className="flex items-center gap-4">
                                <div style={{ background: j % 2 === 0 ? '#EFF6FF' : '#FEF2F2', padding: '0.75rem', borderRadius: '12px', color: j % 2 === 0 ? '#3B82F6' : '#EF4444' }}>{j % 2 === 0 ? '📄' : '▶'}</div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Recommended Material {j+1}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>External Document</div>
                                </div>
                              </div>
                              <div style={{ background: '#F8FAFC', padding: '0.5rem', borderRadius: '50%' }}>
                                <ExternalLink size={16} color="var(--primary-color)" />
                              </div>
                            </div>
                          </a>
                        )) : (
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No external resources mapped yet.</div>
                        )}
                      </div>
                    </div>

                    <div style={{ flex: 1, background: 'linear-gradient(180deg, #FAFAFA 0%, #F1F5F9 100%)', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         PROGRESS CHECKLIST
                         <span style={{ background: isCompleted ? '#DCFCE7' : '#E0E7FF', color: isCompleted ? '#059669' : 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.65rem', transition: 'all 0.2s' }}>
                           {(checklistState[index] || [false, false, false]).filter(Boolean).length}/3
                         </span>
                      </div>
                      <div className="flex flex-col gap-4">
                        {['Review Fundamentals', 'Complete Assigned Reading', 'Take Mini-Quiz'].map((item, i) => {
                          const isChecked = (checklistState[index] || [false, false, false])[i];
                          return (
                            <div key={i} className="flex items-center gap-3" style={{ opacity: isChecked ? 0.6 : 1, transition: 'all 0.2s' }}>
                              <div 
                                onClick={() => toggleChecklist(index, i)}
                                style={{ width: '24px', height: '24px', borderRadius: '6px', background: isChecked ? 'var(--primary-color)' : 'white', border: isChecked ? 'none' : '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s' }}
                              >
                                {isChecked && <Check size={14} color="white" strokeWidth={3} />}
                              </div>
                              <span style={{ fontSize: '0.9rem', fontWeight: isChecked ? 400 : 500, textDecoration: isChecked ? 'line-through' : 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => toggleChecklist(index, i)}>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} style={{ position: 'relative', opacity: 0.6, paddingLeft: '1rem', marginBottom: '4rem' }}>
                <div style={{ position: 'absolute', left: '-4.6rem', top: '0.5rem', background: '#F1F5F9', color: '#94A3B8', width: '3.5rem', height: '3.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#94A3B8', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{node.duration}</div>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'capitalize' }}>{node.title}</h3>
                  <p style={{ maxWidth: '600px', color: '#94A3B8', fontSize: '1rem' }}>{node.description}</p>
                  <div className="flex gap-3" style={{ marginTop: '1.5rem', opacity: 0.5 }}>
                    <div style={{ height: '6px', width: '80px', background: '#CBD5E1', borderRadius: '3px' }}></div>
                    <div style={{ height: '6px', width: '80px', background: '#CBD5E1', borderRadius: '3px' }}></div>
                    <div style={{ height: '6px', width: '80px', background: '#CBD5E1', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Global Bottom Element */}
        <div style={{ background: '#FAFAFA', borderRadius: '24px', padding: '3rem', marginTop: '6rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <Sparkles color="var(--primary-color)" size={32} style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>Feeling overwhelmed?</h2>
          <p style={{ maxWidth: '400px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>Our AI can adjust your pace based on your recent activity and quiz scores. Recalibrate to find your optimal learning flow.</p>
          <button 
            onClick={() => {
              toast('Taking you back to refresh your profile details...', { icon: '🔄' });
              setTimeout(() => navigate('/upload'), 1000);
            }} 
            className="btn btn-primary flex gap-2 items-center" 
            style={{ margin: '0 auto', fontSize: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <RefreshCw size={18} /> Recalibrate My Journey
          </button>
        </div>

      </div>
    </Layout>
  );
};

const Sparkles = ({size, color, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M12 22C12 22 12 14 20 12C12 10 12 2 12 2C12 2 12 10 4 12C12 14 12 22 12 22Z" fill={color}/>
    <path d="M5 6C5 6 5 4 8 3C5 2 5 0 5 0C5 0 5 2 2 3C5 4 5 6 5 6Z" fill={color}/>
    <path d="M19 8C19 8 19 6 22 5C19 4 19 2 19 2C19 2 19 4 16 5C19 6 19 8 19 8Z" fill={color}/>
  </svg>
)
