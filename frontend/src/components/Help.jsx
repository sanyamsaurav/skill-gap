import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Layout } from './Layout';
import { Mail, MessageCircle, FileText, ChevronDown, HelpCircle, PhoneCall, X } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}
      >
        {question}
        <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-tertiary)' }} />
      </button>
      {isOpen && (
        <div style={{ padding: '0.5rem 0 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, animation: 'fadeIn 0.2s ease-in-out' }}>
          {answer}
        </div>
      )}
    </div>
  );
};

export const Help = () => {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const faqs = [
    {
      question: "How does the AI analyze my resume?",
      answer: "Our system uses Google's Gemini AI to semantically parse your resume and compare it against the job description you provide. It evaluates your skills, experience, and terminology to generate an accurate match score and identify critical gaps."
    },
    {
      question: "How accurate is the Match Score?",
      answer: "The Match Score provides a strong baseline for how recruiters and Applicant Tracking Systems (ATS) might view your application. However, it's a diagnostic tool, and you should always tailor your resume specifically for the role."
    },
    {
      question: "What do I get with Premium?",
      answer: "Premium unlocks advanced AI skill forecasting, deep-dive roadmap generation, priority access to newer AI models, and an ad-free experience. You can upgrade easily by clicking 'Upgrade to Pro' in the dashboard."
    },
    {
      question: "Can I export my gap analysis report?",
      answer: "Currently, you can view your localized reports directly on the platform. We are working on adding PDF downloads in an upcoming release."
    }
  ];

  const handleSendContact = (e) => {
    e.preventDefault();
    if(!contactSubject || !contactMessage) return;
    toast.success("Message sent successfully! Our team will get back to you soon.");
    setIsContactOpen(false);
    setContactSubject('');
    setContactMessage('');
  };

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ marginBottom: '3rem' }}>
           <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <HelpCircle size={28} color="var(--primary-color)" /> Help Center
           </h2>
           <p style={{ color: 'var(--text-secondary)' }}>Find answers, contact support, and learn how to make the most out of SkillGap AI.</p>
        </div>

        <div className="flex gap-6 flex-wrap" style={{ marginBottom: '3rem' }}>
           <div style={{ flex: '1 1 250px', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)' }}>
             <div style={{ background: '#6366f1', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
               <FileText size={28} />
             </div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Documentation</h3>
             <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.5' }}>Read our detailed guides on<br/>optimizing your resume<br/>formatting for ATS.</p>
             <button onClick={() => navigate('/guides')} style={{ marginTop: 'auto', width: '100%', background: 'white', color: '#6366f1', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}>View Guides</button>
           </div>
           
           <div style={{ flex: '1 1 250px', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)' }}>
             <div style={{ background: '#6366f1', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
               <MessageCircle size={28} />
             </div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Community Forum</h3>
             <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.5' }}>Ask questions and get tips from<br/>other job seekers and recruiters.</p>
             <button onClick={() => toast.success("Redirecting to Community Discord...")} style={{ marginTop: 'auto', width: '100%', background: 'white', color: '#6366f1', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}>Join Forum</button>
           </div>

           <div style={{ flex: '1 1 250px', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)' }}>
             <div style={{ background: '#6366f1', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
               <Mail size={28} />
             </div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Email Support</h3>
             <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.5' }}>Need personalized assistance?<br/>Our team is available 24/7 to<br/>help you.</p>
             <button onClick={() => setIsContactOpen(true)} style={{ marginTop: 'auto', width: '100%', background: '#6366f1', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)' }}>Contact Us</button>
           </div>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
          <div>
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'white' }}>Still need help?</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Can't find the answer you're looking for? Reach out to our human operators directly.</p>
          </div>
          <button onClick={() => toast.success("Dialing support line...")} style={{ background: 'white', color: 'var(--primary-color)', fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s', ':active': { transform: 'scale(0.95)' } }}>
            <PhoneCall size={18} /> Call Support
          </button>
        </div>

        {/* Contact Support Modal Overlay */}
        {isContactOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: 'var(--shadow-xl)', position: 'relative' }}>
              <button onClick={() => setIsContactOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                <X size={24} />
              </button>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                <Mail size={24} color="var(--primary-color)" /> Contact Support
              </h3>
              <form onSubmit={handleSendContact} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Subject</label>
                  <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} required style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '1rem' }} placeholder="How can we help?" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Message</label>
                  <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-light)', outline: 'none', minHeight: '150px', resize: 'vertical', fontSize: '1rem', fontFamily: 'inherit' }} placeholder="Describe your issue..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '1rem', width: '100%', fontSize: '1rem' }}>Send Message</button>
              </form>
            </div>
          </div>
        )}
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </Layout>
  );
};
