import React from 'react';
import { Layout } from './Layout';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Guides = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Help Center
        </button>

        <div className="card" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem', borderRadius: '12px' }}>
              <BookOpen size={28} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--primary-color)' }}>Documentation</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>How to Optimize Your Resume for ATS</h1>
            </div>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Applicant Tracking Systems (ATS) are software applications that handle the recruitment process. They filter and rank applications based on keywords, skills, and formatting. Here is how you can ensure your resume passes the bot and reaches a human recruiter.
            </p>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Keep Formatting Simple</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Avoid complex layouts, tables, columns, headers, and footers. The ATS might scramble your content if it cannot read the structure properly. Stick to a standard, single-column chronological format.
            </p>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Use Standard Section Headings</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              ATS bots look for recognized section headings to parse your data correctly. Use conventional titles like <strong>"Work Experience"</strong>, <strong>"Education"</strong>, and <strong>"Skills"</strong> rather than creative alternatives like "My Journey".
            </p>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Exact Keyword Matches</h3>
            <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}><CheckCircle size={18} color="var(--primary-color)" /> Look deeply at the Job Description.</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}><CheckCircle size={18} color="var(--primary-color)" /> If they ask for "JavaScript", do not just write "JS". Use the exact terms.</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}><CheckCircle size={18} color="var(--primary-color)" /> Use our SkillGap AI tool to automatically find these missing keywords.</li>
            </ul>

            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
              <strong>Tip:</strong> Always save and upload your resume as a standard PDF or Word Document (.docx). Our application natively parses PDFs to give you the most accurate ATS simulation!
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
