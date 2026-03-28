import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { questions, scaleLabels, partInstructions } from '../data/questions';
import ProgressBar from './ProgressBar';

function Assessment({ currentQuestion, responses, onResponseChange, onNext, onPrevious }) {
  const question = questions.find(q => q.id === currentQuestion);
  const currentResponse = responses[currentQuestion];
  const part = question.part;
  const scale = part === 1 ? scaleLabels.part1 : scaleLabels.part2;
  const instructions = part === 1 ? partInstructions.part1 : partInstructions.part2;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Number keys 0-5 for selection
      if (e.key >= '0' && e.key <= '5') {
        const value = parseInt(e.key);
        onResponseChange(currentQuestion, value);
      }
      // Enter to proceed
      else if (e.key === 'Enter' && currentResponse !== undefined) {
        onNext();
      }
      // Arrow keys for navigation
      else if (e.key === 'ArrowLeft' && currentQuestion > 1) {
        onPrevious();
      }
      else if (e.key === 'ArrowRight' && currentResponse !== undefined) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentResponse, onNext, onPrevious, onResponseChange]);

  const handleRadioChange = (value) => {
    onResponseChange(currentQuestion, value);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-4) 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-3)'
          }}>
            <span style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-secondary)'
            }}>
              Part {part} of 2
            </span>
            <span style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-secondary)'
            }}>
              Question {currentQuestion} of 32
            </span>
          </div>
          
          <ProgressBar current={currentQuestion} total={32} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-4)'
      }}>
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          {/* Instructions */}
          <div style={{ 
            marginBottom: 'var(--space-8)',
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)'
          }}>
            {instructions}
          </div>

          {/* Question */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ 
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-medium)',
              marginBottom: 'var(--space-6)',
              lineHeight: 'var(--leading-relaxed)'
            }}>
              {question.text}
            </div>

            {/* Scale Options */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-3)' 
            }}>
              {scale.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: currentResponse === option.value 
                      ? 'var(--bg-secondary)' 
                      : 'transparent',
                    borderColor: currentResponse === option.value 
                      ? 'var(--text-primary)' 
                      : 'var(--border)'
                  }}
                  onMouseEnter={(e) => {
                    if (currentResponse !== option.value) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentResponse !== option.value) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option.value}
                    checked={currentResponse === option.value}
                    onChange={() => handleRadioChange(option.value)}
                    style={{ flexShrink: 0 }}
                  />
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-3)',
                    width: '100%'
                  }}>
                    <span style={{ 
                      fontWeight: 'var(--font-semibold)',
                      minWidth: '20px'
                    }}>
                      {option.value}
                    </span>
                    <span style={{ flex: 1 }}>
                      {option.label}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {/* Keyboard hint */}
            <div style={{ 
              marginTop: 'var(--space-4)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              Tip: Use number keys 0-5 to select, Enter to continue
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-4)',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={onPrevious}
              disabled={currentQuestion === 1}
              className="secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)' 
              }}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={onNext}
              disabled={currentResponse === undefined}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)' 
              }}
            >
              {currentQuestion === 32 ? 'Complete' : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
