import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

export const GoPro = ({ 
  text = "Go Pro 🚀", 
  customStyle, 
  className = "btn btn-primary",
  onSuccess 
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Helper method to load the Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      return toast.error("Please log in to upgrade to Pro");
    }

    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      setLoading(false);
      return toast.error("Razorpay SDK failed to load. Are you online?");
    }

    try {
      // 1. Create Checkout Order
      // Set to 99900 paise internally to represent ₹999
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/payment/create-order`, {
        amount: 99900 
      });

      if (!orderResponse.data.success) {
        setLoading(false);
        return toast.error("Server error. Could not build your payment order.");
      }

      const { id: order_id, amount, currency } = orderResponse.data.order;

      // 2. Configure Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SYcm1sKWLzInbx', // Enter the Key ID securely configured in environment vars
        amount: amount.toString(),
        currency: currency,
        name: "Skill Gap AI",
        description: "Pro User Subscription",
        order_id: order_id, 
        handler: async function (response) {
          // 3. Payment Success - Verify Signature
          try {
            const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/payment/verify`, {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
               toast.success("Welcome Pro User 🚀");
               if (onSuccess) onSuccess();
            } else {
               toast.error("Signature tampering detected.");
            }
          } catch(err) {
             console.error("Verification failed:", err);
             toast.error(err.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email || "user@example.com"
        },
        theme: {
          color: "#3B82F6" 
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      // Payment failure handler
      paymentObject.on('payment.failed', function (response){
         toast.error(`Payment failed: ${response.error.description}`);
      });

      // Open Modal
      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Checkout initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const defaultStyle = { 
    background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)', 
    color: 'white', 
    padding: '0.75rem 1.5rem', 
    borderRadius: '12px', 
    fontWeight: 600,
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: loading ? 0.7 : 1
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className={className}
      style={customStyle || defaultStyle}
    >
      {loading ? (
        <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'inherit', borderRadius: '50%' }}></span>
      ) : text}
    </button>
  );
};
