import { useState, useRef } from 'react';
import { Download, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import RadarChart from './RadarChart';
import ExportModal from './ExportModal';
import AIInsights from './AIInsights';
import { 
  foundationNames, 
  averageScores, 
  interpretations,
  foundationDescriptions,
  politicalPatternNote 
} from '../constants/normativeData';
import { getInterpretationLevel, estimatePercentile, compareWithAverage } from '../utils/scoring';
import { colors } from '../constants/config';

function Results({ results, onRetake }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [expandedFoundation, setExpandedFoundation] = useState(null);
  const [showRadar, setShowRadar] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const chartRef = useRef(null);

  const { scores, completedAt } = results;
  const catchQuestionStatus = results.catchQuestionStatus || { valid: true, warnings: [] };
  const isShared = Boolean(results.sharedFromUrl);
  const canUseAI = !isShared && results.responses && Object.keys(results.responses).length >= 32;
  const comparison = compareWithAverage(scores);

  const individualizing = ((scores.care + scores.fairness) / 2);
  const binding = ((scores.loyalty + scores.authority + scores.sanctity) / 3);
  const profileDelta = Number((individualizing - binding).toFixed(1));

  const profileLabel = (() => {
    if (profileDelta >= 4) return 'Individualizing-leaning';
    if (profileDelta <= -4) return 'Binding-leaning';
    return 'Balanced';
  })();

  const profileSummary = (() => {
    if (profileLabel === 'Individualizing-leaning') {
      return 'Your results emphasize care and fairness more strongly than group loyalty, authority, or sanctity. This often correlates with a focus on individual rights, harm reduction, and equitable treatment.';
    }
    if (profileLabel === 'Binding-leaning') {
      return 'Your results emphasize loyalty, authority, and sanctity more strongly than care and fairness. This often correlates with a focus on cohesion, shared norms, and preserving social order.';
    }
    return 'Your results show a relatively even balance between individualizing and binding foundations. This often correlates with flexible moral reasoning that shifts with context.';
  })();

  const reflectionQuestions = (() => {
    if (profileLabel === 'Individualizing-leaning') {
      return [
        'Where do group commitments matter, even when individual harm is low?',
        'Which traditions or institutions deserve more trust than you instinctively grant?',
        'How do you protect compassion without burning out?'
      ];
    }
    if (profileLabel === 'Binding-leaning') {
      return [
        'When should individual rights override group cohesion?',
        'Which norms are worth preserving—and which should evolve?',
        'How do you stay open to outsiders without losing shared identity?'
      ];
    }
    return [
      'When do you lean toward care/fairness vs. loyalty/authority/sanctity?',
      'Which foundation is easiest for you to compromise—and why?',
      'How do you adapt your moral language to people unlike you?'
    ];
  })();

  const foundationGuidance = {
    care: {
      high: {
        strengths: 'Highly empathetic; quick to notice suffering; motivated to protect the vulnerable.',
        blindSpots: 'May overextend personally or assume others prioritize compassion in the same way.',
        growth: 'Pair compassion with boundaries and sustainable action.'
      },
      moderate: {
        strengths: 'Compassionate without losing perspective; balances care with other values.',
        blindSpots: 'May under-advocate for vulnerable people in complex tradeoffs.',
        growth: 'Identify situations where harm is subtle or delayed.'
      },
      low: {
        strengths: 'Can make tough decisions without being overly swayed by emotional cues.',
        blindSpots: 'May underestimate emotional harm or relational impact.',
        growth: 'Practice perspective-taking and look for invisible harms.'
      }
    },
    fairness: {
      high: {
        strengths: 'Strong moral compass around justice, equity, and reciprocity.',
        blindSpots: 'May interpret disagreement as unfairness rather than differing priorities.',
        growth: 'Consider how context and tradeoffs shape perceptions of fairness.'
      },
      moderate: {
        strengths: 'Values fairness but can navigate exceptions when needed.',
        blindSpots: 'May tolerate inequities if they serve other goals.',
        growth: 'Clarify what “fair” means in ambiguous situations.'
      },
      low: {
        strengths: 'Able to prioritize other values over strict equality when necessary.',
        blindSpots: 'Risk of overlooking systemic imbalances.',
        growth: 'Check how rules and outcomes impact different groups.'
      }
    },
    loyalty: {
      high: {
        strengths: 'Strong sense of belonging and commitment; values team cohesion.',
        blindSpots: 'May excuse in-group missteps or overlook outsider perspectives.',
        growth: 'Balance loyalty with fairness and accountability.'
      },
      moderate: {
        strengths: 'Can be loyal without losing independence.',
        blindSpots: 'May feel tension between group ties and personal values.',
        growth: 'Define when loyalty is protective vs. restrictive.'
      },
      low: {
        strengths: 'Independent-minded; evaluates people as individuals.',
        blindSpots: 'May underestimate how much belonging matters to others.',
        growth: 'Practice acknowledging shared identity and group commitments.'
      }
    },
    authority: {
      high: {
        strengths: 'Respects expertise, order, and continuity; good at working within systems.',
        blindSpots: 'May defer too quickly to hierarchy or tradition.',
        growth: 'Stay open to reform when systems no longer serve well.'
      },
      moderate: {
        strengths: 'Balances respect for structure with healthy skepticism.',
        blindSpots: 'May feel conflicted about rule-breaking vs. innovation.',
        growth: 'Clarify which authorities are legitimately earned.'
      },
      low: {
        strengths: 'Comfortable challenging authority and advocating change.',
        blindSpots: 'May discount stability or the value of shared norms.',
        growth: 'Consider the stabilizing role of rules in complex groups.'
      }
    },
    sanctity: {
      high: {
        strengths: 'Attuned to purity, meaning, and the symbolic dimension of behavior.',
        blindSpots: 'May interpret difference as degradation or feel moral disgust quickly.',
        growth: 'Separate visceral reactions from ethical reasoning.'
      },
      moderate: {
        strengths: 'Balances symbolic concerns with practical outcomes.',
        blindSpots: 'May be inconsistent about when purity matters.',
        growth: 'Notice contexts where sanctity affects your judgments.'
      },
      low: {
        strengths: 'Grounded in tangible outcomes rather than symbolic purity.',
        blindSpots: 'May underestimate how purity concerns motivate others.',
        growth: 'Recognize when values are tied to identity and meaning.'
      }
    }
  };

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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-4)'
          }}>
            <h2 style={{ margin: 0 }}>Score Overview</h2>
            <button
              className="secondary"
              onClick={() => setShowRadar((prev) => !prev)}
              style={{ minWidth: 'auto', padding: 'var(--space-2) var(--space-3)' }}
            >
              {showRadar ? 'Hide radar' : 'Show radar'}
            </button>
          </div>
          <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>
            Bars are generally easier to compare than radar shapes. The radar view is available as a secondary visual.
          </p>

          {showRadar && <RadarChart scores={scores} />}
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)'
                }}>
                  <span>
                    {comparison[key].higher ? 'Above' : 'Below'} avg by {Math.abs(comparison[key].difference)}
                  </span>
                  <span>
                    Est. percentile: {estimatePercentile(score, avg)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Profile Summary */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Profile Summary</h2>
          <p style={{ marginTop: 0 }}>{profileSummary}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Individualizing (Care + Fairness)</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)' }}>{individualizing.toFixed(1)}</div>
            </div>
            <div style={{ padding: 'var(--space-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Binding (Loyalty + Authority + Sanctity)</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)' }}>{binding.toFixed(1)}</div>
            </div>
            <div style={{ padding: 'var(--space-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Profile Balance</div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                {profileLabel} ({profileDelta >= 0 ? '+' : ''}{profileDelta})
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)', backgroundColor: 'var(--surface-elevated)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Context Without AI</h3>
          <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>
            These interpretations use validated scoring rules and a moderate U.S. sample average for comparison. 
            AI analysis can add richer narrative depth, but the core profile and foundation-level insights here 
            are fully derived from your scores.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Reflection Prompts</h3>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', lineHeight: 'var(--leading-relaxed)' }}>
            {reflectionQuestions.map((q, idx) => (
              <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>{q}</li>
            ))}
          </ul>
        </div>

        {/* Interpretations */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>Foundation Deep Dive</h2>
          
          {Object.entries(foundationNames).map(([key, name]) => {
            const score = scores[key];
            const level = getInterpretationLevel(score);
            const interpretation = interpretations[key][level];
            const isExpanded = expandedFoundation === key;
            const foundationColor = colors.foundations[key];
            const guidance = foundationGuidance[key][level];

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
                    <p style={{ marginTop: 0 }}>{foundationDescriptions[key]}</p>
                    <p><strong>Interpretation:</strong> {interpretation}</p>
                    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                      <div><strong>Strengths:</strong> {guidance.strengths}</div>
                      <div><strong>Potential blind spots:</strong> {guidance.blindSpots}</div>
                      <div><strong>Growth edge:</strong> {guidance.growth}</div>
                    </div>
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
            onClick={() => {
              setShowRadar(true);
              setShowExportModal(true);
            }}
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
