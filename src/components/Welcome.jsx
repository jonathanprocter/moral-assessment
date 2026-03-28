import { Clock } from 'lucide-react';

function Welcome({ onStart, showResumeModal, onResume, onStartFresh, onCloseModal }) {
  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--space-8) var(--space-4)'
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: 'var(--space-4)',
            color: 'var(--text-primary)'
          }}>
            🧭
          </div>
          
          <h1 style={{ marginBottom: 'var(--space-3)' }}>
            Moral Foundations Questionnaire
          </h1>
          
          <p style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-6)'
          }}>
            Discover Your Moral Psychology
          </p>
        </div>

        {/* Description Card */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <p style={{ lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            The Moral Foundations Questionnaire (MFQ-30) is a validated psychological assessment 
            that measures five moral foundations: <strong>Care/Harm</strong>, <strong>Fairness/Cheating</strong>, 
            <strong>Loyalty/Betrayal</strong>, <strong>Authority/Subversion</strong>, and <strong>Sanctity/Degradation</strong>.
          </p>
          
          <p style={{ lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
            Understanding your moral foundations can help you better understand your own values, 
            improve communication with others who may have different moral priorities, and gain 
            insight into political and cultural differences.
          </p>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-base)'
          }}>
            <Clock size={20} />
            <span>10-15 minutes to complete</span>
          </div>
        </div>

        {/* Start Button */}
        <button 
          onClick={onStart}
          style={{ 
            width: '100%',
            fontSize: 'var(--text-lg)',
            padding: 'var(--space-4) var(--space-6)',
            marginBottom: 'var(--space-4)'
          }}
        >
          Begin Assessment
        </button>


      </div>

      {/* Resume Session Modal */}
      {showResumeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            maxWidth: '400px', 
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={onCloseModal}
              style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                background: 'transparent',
                border: 'none',
                fontSize: 'var(--text-xl)',
                color: 'var(--text-secondary)',
                padding: 'var(--space-2)',
                minWidth: 'auto',
                minHeight: 'auto'
              }}
              aria-label="Close"
            >
              ×
            </button>

            <h3 style={{ marginBottom: 'var(--space-4)' }}>Welcome Back!</h3>
            
            <p style={{ marginBottom: 'var(--space-6)', color: 'var(--text-secondary)' }}>
              You have a saved session. Would you like to continue where you left off?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <button onClick={onResume} style={{ width: '100%' }}>
                Resume Where I Left Off
              </button>
              <button onClick={onStartFresh} className="secondary" style={{ width: '100%' }}>
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
