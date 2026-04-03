import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Upload, Sparkles, FileText, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

export const UploadResume = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating AI Insights...');
  const [progress, setProgress] = useState(0);
  const [latestReport, setLatestReport] = useState(null);
  
  const tips = [
    "Keywords matter. We scan for over 5,000+ industry-specific competencies.",
    "Simplicity wins. Avoid complex layouts to ensure parsing accuracy.",
    "Quantify your achievements. Metrics validate your experience instantly.",
    "Tailor your summary. Keep it focused on the exact target role.",
    "Be specific. Avoid generic buzzwords; highlight actual tools and frameworks."
  ];
  const [currentTip, setCurrentTip] = useState(tips[0]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUser();

  React.useEffect(() => {
    // Rotate tip every 8 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => {
        const nextIndex = (tips.indexOf(prev) + 1) % tips.length;
        return tips[nextIndex];
      });
    }, 8000);
    return () => clearInterval(tipInterval);
  }, []);

  React.useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:5002/api/reports/${user.id}`)
        .then(res => {
          if (res.data.success && res.data.reports && res.data.reports.length > 0) {
            setLatestReport(res.data.reports[0]);
          }
        })
        .catch(err => console.error("Error fetching latest report", err));
    }
  }, [user]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error('Please upload a PDF resume only.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsHovered(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error('Please upload a PDF resume only.');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload your resume.");
    if (!jobDescription.trim()) return toast.error("Please provide a target job description.");
    if (!user) return toast.error("You must be logged in to analyze your resume.");

    setIsLoading(true);
    setProgress(0);
    setLoadingMessage('Uploading PDF...');

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;
      if (currentProgress > 90) currentProgress = 90;
      setProgress(Math.round(currentProgress));
      
      if (currentProgress < 20) setLoadingMessage('Parsing Resume PDF...');
      else if (currentProgress < 50) setLoadingMessage('Synthesizing skill matrix...');
      else if (currentProgress < 75) setLoadingMessage('Evaluating gaps against target role...');
      else if (currentProgress < 85) setLoadingMessage('Generating custom learning roadmap...');
      else setLoadingMessage('Finalizing insights...');
    }, 1500);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobTitle', jobTitle);
    formData.append('jobDescription', jobDescription);
    if (user && user.id) {
      formData.append('userId', user.id);
    }

    try {
      const response = await axios.post('http://localhost:5002/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      if (response.data.success) {
         clearInterval(progressInterval);
         setProgress(100);
         setLoadingMessage('Analysis complete!');
         toast.success("Analysis complete!");
         
         setTimeout(() => {
            navigate('/analysis', { state: { analysisData: response.data.data, jobDescription, jobTitle } });
         }, 500);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Analysis failed.");
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Upload your professional story.</h1>
          <p style={{ fontSize: '1.125rem' }}>Let our AI curator deconstruct your experience and reveal<br/>the path to your next career milestone.</p>
        </div>
        
        <div className="flex gap-8">
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* The Dropzone */}
            <div 
              style={{ 
                padding: '6rem 2rem', 
                border: isHovered ? '2px dashed var(--primary-color)' : '2px dashed #CBD5E1',
                backgroundColor: isHovered ? 'var(--sidebar-active-bg)' : 'var(--surface-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
<input type="file" ref={fileInputRef} hidden onChange={handleFileSelect} accept=".pdf" />
              
              {!file ? (
                <>
                  <div style={{ background: '#F1F5F9', padding: '1.5rem', borderRadius: '16px', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                    <Upload size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Drag and drop your resume here</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>Supported format: PDF only (Max 5MB)</p>
                  
                  <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="btn btn-primary" style={{ minWidth: '200px', padding: '1rem', fontSize: '1rem', borderRadius: '12px' }}>
                    <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>+</span> Select Files
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div style={{ background: 'var(--sidebar-active-bg)', padding: '1.5rem', borderRadius: '16px', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                    <FileText size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{file.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="btn" style={{ background: '#FEE2E2', color: '#EF4444', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                    Remove File
                  </button>
                </div>
              )}
            </div>

            {/* Target Job Settings & Submission */}
            <div className="card" style={{ padding: '2rem', borderRadius: '24px' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Target Job Verification</h3>
               
               <input 
                 type="text" 
                 placeholder="Target Job Title (e.g. Senior Frontend Engineer)"
                 value={jobTitle}
                 onChange={e => setJobTitle(e.target.value)}
                 style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '1rem', outline: 'none', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}
               />
               
               <textarea 
                 placeholder="Paste the full job description here..."
                 value={jobDescription}
                 onChange={e => setJobDescription(e.target.value)}
                 style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '120px', resize: 'vertical', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}
               />
               <button 
                 onClick={handleAnalyze} 
                 disabled={isLoading || !file || !jobDescription.trim() || !jobTitle.trim()}
                 className={`btn btn-primary flex justify-center items-center gap-2 ${isLoading ? 'relative overflow-hidden' : ''}`} 
                 style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', borderRadius: '12px', opacity: (isLoading || !file || !jobDescription.trim() || !jobTitle.trim()) ? 0.7 : 1, transition: 'all 0.2s ease' }}
               >
                 {isLoading && (
                   <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: 'rgba(255,255,255,0.15)', transition: 'width 0.3s ease' }} />
                 )}
                 <div className="flex items-center gap-2 relative z-10">
                   {isLoading && <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>}
                   {isLoading ? `${loadingMessage} ${progress}%` : 'Analyze Resume'}
                 </div>
               </button>
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="card" style={{ background: '#FAFAFA', border: 'none', padding: '1.5rem', borderRadius: '24px' }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                  <Sparkles size={16} color="var(--primary-color)" /> AI INSIGHTS
                </div>
                {latestReport ? (
                  <>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Last analyzed job:</div>
                    <div style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '0.875rem', marginBottom: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {latestReport.jobTitle || 'Unknown Role'}
                    </div>
                    
                    <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '3px', marginBottom: '0.5rem' }}>
                      <div style={{ width: `${latestReport.matchScore || 0}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '3px' }}></div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Match Score: {latestReport.matchScore || 0}%</div>
                  </>
                ) : (
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No previous analysis found.</div>
                )}
             </div>

             <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', height: '240px', backgroundImage: 'url("/curator_tip_bg.png")', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
               <div style={{ position: 'absolute', inset: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0) 100%)' }}>
                 <div style={{ color: '#60A5FA', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Curator's Tip</div>
                 <div key={currentTip} style={{ color: '#F8FAFC', fontSize: '0.95rem', lineHeight: 1.6, textShadow: '0 2px 4px rgba(0,0,0,0.4)', animation: 'fadeIn 0.5s ease', fontWeight: 500 }}>{currentTip}</div>
               </div>
             </div>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: '4rem', padding: '0 1rem' }}>
           <div className="flex gap-8">
             <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)'}}>
               <span style={{ color: 'var(--primary-color)' }}>✓</span> ATS Optimized
             </div>
             <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)'}}>
               <span style={{ color: 'var(--primary-color)' }}>🔒</span> Private & Encrypted
             </div>
           </div>
           
           <div className="flex items-center" style={{ background: '#EEF2FF', padding: '0.25rem 0.5rem', borderRadius: '24px' }}>
             <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', padding: '0 0.5rem' }}>12K+</span>
           </div>
        </div>

      </div>
    </Layout>
  );
};
