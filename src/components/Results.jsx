import { useState, useRef } from 'react';
import { Download, Share2, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import RadarChart from './RadarChart';
import ExportModal from './ExportModal';
import AIInsights from './AIInsights';
import { 
  foundationNames, 
  averageScores, 
  interpretations, 
  politicalPatternNote 
} from '../constants/normativeData';
import { getInterpretationLevel } from '../utils/scoring';
import { colors } from '../constants/config';

function Results({ results, onRetake }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [expandedFoundation, setExpandedFoundation] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const chartRef = useRef(null);

  const { scores, completedAt } = results;
  const catchQuestionStatus = results.catchQuestionStatus || { valid: true, warnings: [] };
  const isShared = Boolean(results.sharedFromUrl);
  const canUseAI = !isShared && results.responses && Object.keys(results.responses).length >= 32;

  const completedDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown date';

  const toggleFoundation = (foundation) => {
    setExpandedFoundation(expandedFoundation === foundation ? null : foundation);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>
            Your Moral Foundations Profile
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
            Completed {completedDate}
          </p>
        </div>

        {/* Attention Check Warning */}
        {!catchQuestionStatus.valid && (
          <div style={{
            backgroundColor: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'flex-start'
          }}>
            <AlertTriangle size={24} color="var(--warning-text)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Attention Check Warning
              </strong>
              {catchQuestionStatus.warnings.map((warning, idx) => (
                <p key={idx} style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                  {warning}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Shared Results Notice */}
        {isShared && (
          <div className="card" style={{ marginBottom: 'var(--space-6)', backgroundColor: 'var(--surface-elevated)' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Shared Results</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              This view was opened from a shared link. Detailed responses and AI insights are unavailable.
            </p>
          </div>
        )}

        {/* Radar Chart */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }} ref={chartRef}>
          <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            Foundation Scores
          </h2>
          <RadarChart scores={scores} />
        </div>

        {/* Scores Comparison */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Your Scores vs. Average</h2>
          
          {Object.entries(foundationNames).map(([key, name]) => {
            const score = scores[key];
            const avg = averageScores[key];
            const percentage = (score / 30) * 100;
            const avgPercentage = (avg / 30) * 100;
            const foundationColor = colors.foundations[key];

            return (
              <div key={key} style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  <span>{name}</span>
                  <span>{score} / 30</span>
                </div>
                
                <div style={{ position: 'relative', height: '32px' }}>
                  {/* Average marker */}
                  <div style={{
                    position: 'absolute',
                    left: `${avgPercentage}%`,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: 'var(--text-secondary)',
                    zIndex: 1
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap'
                    }}>
                      Avg: {avg}
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: foundationColor,
                      transition: 'width 0.5s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: 'var(--space-2)',
                      color: 'var(--surface)',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)'
                    }}>
                      {score > 3 && score}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interpretations */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Interpretation</h2>
          
          {Object.entries(foundationNames).map(([key, name]) => {
            const score = scores[key];
            const level = getInterpretationLevel(score);
            const interpretation = interpretations[key][level];
            const isExpanded = expandedFoundation === key;
            const foundationColor = colors.foundations[key];

            return (
              <div 
                key={key} 
                style={{ 
                  marginBottom: 'var(--space-4)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFoundation(key)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-4)',
                    backgroundColor: isExpanded ? 'var(--bg-secondary)' : 'var(--surface)',
                    border: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%',
                        backgroundColor: foundationColor
                      }}
                    />
                    {name}
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)'
                  }}>
                    {score}/30 - {level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                </button>
                
                {isExpanded && (
                  <div style={{ 
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--surface)',
                    borderTop: '1px solid var(--border)',
                    lineHeight: 'var(--leading-relaxed)'
                  }}>
                    {interpretation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Political Pattern Note */}
        <div className="card" style={{ 
          marginBottom: 'var(--space-6)',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-lg)' }}>
            Understanding Political Patterns
          </h3>
          <p style={{ 
            lineHeight: 'var(--leading-relaxed)',
            fontSize: 'var(--text-base)',
            margin: 0
          }}>
            {politicalPatternNote}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          {canUseAI && (
            <button
              onClick={() => setShowAIInsights(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 'var(--space-2)' 
              }}
            >
              <Sparkles size={20} />
              Get AI Insights
            </button>
          )}
          
          <button
            onClick={() => setShowExportModal(true)}
            className="secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-2)' 
            }}
          >
            <Download size={20} />
            Export Results
          </button>
          
          <button
            onClick={onRetake}
            className="secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-2)' 
            }}
          >
            <RefreshCw size={20} />
            Retake Assessment
          </button>
        </div>

        {/* Modals */}
        {showExportModal && (
          <ExportModal
            results={results}
            chartElement={chartRef.current}
            onClose={() => setShowExportModal(false)}
            aiInsights={aiInsights}
          />
        )}

        {showAIInsights && (
          <AIInsights
            results={results}
            onClose={() => setShowAIInsights(false)}
            onInsightsGenerated={(insights) => setAiInsights(insights)}
          />
        )}
      </div>
    </div>
  );
}

export default Results;
