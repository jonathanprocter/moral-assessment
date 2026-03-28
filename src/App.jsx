import { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Assessment from './components/Assessment';
import Results from './components/Results';
import { loadProgress, saveProgress, clearProgress } from './utils/storage';
import { calculateScores, checkCatchQuestions, validateResponses } from './utils/scoring';
import { decodeShareURL } from './utils/export';

function App() {
  const [view, setView] = useState('welcome'); // welcome, assessment, transition, results
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [results, setResults] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const parseSharedResultsFromHash = (hash) => {
    const match = hash.match(/^#\/results\/([^/]+)$/);
    if (!match) return null;

    const decoded = decodeShareURL(match[1]);
    if (!decoded) return null;

    return {
      scores: {
        care: decoded.care,
        fairness: decoded.fairness,
        loyalty: decoded.loyalty,
        authority: decoded.authority,
        sanctity: decoded.sanctity
      },
      responses: null,
      catchQuestionStatus: { valid: true, warnings: [] },
      completedAt: decoded.timestamp || Date.now(),
      sharedFromUrl: true
    };
  };

  // Check for shared results or saved progress on mount
  useEffect(() => {
    const shared = parseSharedResultsFromHash(window.location.hash);
    if (shared) {
      setResults(shared);
      setView('results');
      setShowResumeModal(false);
      return;
    }

    const saved = loadProgress();
    if (saved && view === 'welcome') {
      setShowResumeModal(true);
    }
  }, []);

  // Listen for share links pasted into the address bar
  useEffect(() => {
    const handleHashChange = () => {
      const shared = parseSharedResultsFromHash(window.location.hash);
      if (shared) {
        setResults(shared);
        setView('results');
        setShowResumeModal(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (view === 'assessment' && Object.keys(responses).length > 0) {
      saveProgress(responses, currentQuestion);
    }
  }, [responses, currentQuestion, view]);

  const handleStartAssessment = () => {
    if (window.location.hash.startsWith('#/results/')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setView('assessment');
    setResponses({});
    setCurrentQuestion(1);
    clearProgress();
  };

  const handleResumeSession = () => {
    const saved = loadProgress();
    if (saved) {
      setResponses(saved.responses);
      setCurrentQuestion(saved.currentQuestion);
      setView('assessment');
    }
    setShowResumeModal(false);
  };

  const handleStartFresh = () => {
    clearProgress();
    setShowResumeModal(false);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion === 16) {
      setView('transition');
    } else if (currentQuestion < 32) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
      if (currentQuestion === 17) {
        setView('assessment');
      }
    }
  };

  const handleContinueToPartTwo = () => {
    setView('assessment');
    setCurrentQuestion(17);
  };

  const handleComplete = () => {
    const validation = validateResponses(responses);
    
    if (!validation.valid) {
      alert(`Please answer all questions. ${validation.unanswered.length} questions remaining.`);
      setCurrentQuestion(validation.unanswered[0]);
      return;
    }

    const scores = calculateScores(responses);
    const catchQuestionStatus = checkCatchQuestions(responses);

    const resultsData = {
      scores,
      responses,
      catchQuestionStatus,
      completedAt: Date.now()
    };

    setResults(resultsData);
    setView('results');
    clearProgress();
  };

  const handleRetakeAssessment = () => {
    if (window.location.hash.startsWith('#/results/')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setView('welcome');
    setResponses({});
    setCurrentQuestion(1);
    setResults(null);
    clearProgress();
  };

  return (
    <div className="app">
      {view === 'welcome' && (
        <Welcome
          onStart={handleStartAssessment}
          showResumeModal={showResumeModal}
          onResume={handleResumeSession}
          onStartFresh={handleStartFresh}
          onCloseModal={() => setShowResumeModal(false)}
        />
      )}

      {view === 'assessment' && (
        <Assessment
          currentQuestion={currentQuestion}
          responses={responses}
          onResponseChange={handleResponseChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {view === 'transition' && (
        <div className="container" style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div className="card text-center" style={{ maxWidth: '500px' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Great Progress!</h2>
            <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>
              Part 1 complete. You've answered 16 of 32 questions.
            </p>
            <button 
              onClick={handleContinueToPartTwo}
              style={{ width: '100%' }}
            >
              Continue to Part 2
            </button>
          </div>
        </div>
      )}

      {view === 'results' && results && (
        <Results
          results={results}
          onRetake={handleRetakeAssessment}
        />
      )}
    </div>
  );
}

export default App;
