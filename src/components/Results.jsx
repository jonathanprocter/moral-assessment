import { useState, useRef } from 'react';
import { Download, Sparkles, RefreshCw, AlertTriangle, FileText, Compass, MessageCircle, Target } from 'lucide-react';
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
import { getInterpretationLevel, estimatePercentile, compareWithAverage, getExtremes } from '../utils/scoring';
import { exportToPDF } from '../utils/export';
import { colors } from '../constants/config';

function Results({ results, onRetake }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [expandedFoundation, setExpandedFoundation] = useState(null);
  const [showRadar, setShowRadar] = useState(false);
  const [showFullReport, setShowFullReport] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const chartRef = useRef(null);

  const { scores, completedAt } = results;
  const catchQuestionStatus = results.catchQuestionStatus || { valid: true, warnings: [] };
  const isShared = Boolean(results.sharedFromUrl);
  const canUseAI = !isShared && results.responses && Object.keys(results.responses).length >= 32;
  const comparison = compareWithAverage(scores);
  const extremes = getExtremes(scores);

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

  const typicalScores = averageScores;
  const typicalIndividualizing = ((typicalScores.care + typicalScores.fairness) / 2);
  const typicalBinding = ((typicalScores.loyalty + typicalScores.authority + typicalScores.sanctity) / 3);
  const typicalDelta = Number((typicalIndividualizing - typicalBinding).toFixed(1));
  const typicalLabel = typicalDelta >= 4 ? 'Individualizing-leaning' : typicalDelta <= -4 ? 'Binding-leaning' : 'Balanced';

  const narrativeSections = (() => {
    const top = foundationNames[extremes.highest.foundation];
    const low = foundationNames[extremes.lowest.foundation];
    const topScore = extremes.highest.score;
    const lowScore = extremes.lowest.score;
    const gap = Number((topScore - lowScore).toFixed(1));
    const balanceNote = gap >= 10
      ? 'There is a pronounced spread between your strongest and weakest foundations, which can create clear moral priorities but also sharper tradeoffs.'
      : 'Your foundations are relatively close together, which suggests flexibility across different moral contexts.';

    const avgDelta = profileDelta >= 0
      ? `Your Individualizing average is higher by ${profileDelta} points.`
      : `Your Binding average is higher by ${Math.abs(profileDelta)} points.`;

    const tensionNote = gap >= 12
      ? `Because the spread is sizable, conflicts may feel sharper when ${top} clashes with ${low}.`
      : 'Because the spread is modest, you may find it easier to integrate competing moral priorities.';

    return {
      overview: [
        `Your highest foundation is ${top} (${topScore}/30), while your lowest is ${low} (${lowScore}/30). ${balanceNote}`,
        `${profileSummary} ${avgDelta}`,
        tensionNote
      ],
      decisionStyle: [
        profileLabel === 'Individualizing-leaning'
          ? 'Likely to anchor decisions on harm reduction and fairness, especially when outcomes affect individuals.'
          : profileLabel === 'Binding-leaning'
            ? 'Likely to weigh cohesion, stability, and shared norms when evaluating moral tradeoffs.'
            : 'Likely to shift moral emphasis based on context rather than a single dominant principle.',
        'You may prioritize different foundations in private vs. public settings, depending on accountability and social expectations.'
      ],
      practicalImplications: [
        `High ${top} can make you especially sensitive to cues that others might overlook.`,
        `Lower ${low} may mean you underweight signals that people with stronger ${low} instincts find compelling.`,
        'When stakes are high, you likely default to your strongest foundations for clarity.'
      ],
      relationshipImplications: [
        'People who share your strongest foundations may feel immediately understood by you.',
        'People who prioritize your lower foundations may interpret your stance as incomplete unless you explicitly acknowledge their values.',
        'Explicitly naming tradeoffs reduces friction in disagreement.'
      ],
      communicationTips: [
        'Start with shared values before debating details.',
        'Translate your strongest foundations into language others prioritize.',
        'Acknowledge the tradeoffs you’re willing to make — it builds trust.',
        'Use specific examples to show how you weigh competing values.'
      ],
      growthEdges: [
        `Your strongest area (${top}) can be a moral strength; over-reliance may cause blind spots in ${low}.`,
        'Try an occasional “swap lens” exercise: deliberately evaluate a tough issue using your lowest foundation.',
        'Notice when emotional intensity is rising—this often signals a foundation conflict.'
      ],
      longerForm: [
        'Moral foundations are like a set of lenses. You do not use each lens equally, and that is normal. What matters most is how aware you are of the lens you are currently using.',
        'When your strongest foundations are activated, decisions tend to feel obvious and emotionally clear. When your lower foundations are activated by other people, disagreements can feel confusing or even frustrating.',
        'The most resilient moral reasoning often comes from deliberately slowing down and “borrowing” a weaker foundation just long enough to understand another perspective.',
        'This profile should be read as a pattern, not a label. It reflects how you responded today and can shift with experience, context, and reflection.',
        'Use the scenarios below as practice. The goal is not to change your values, but to recognize how they shape your judgments.'
      ]
    };
  })();

  const scenarioExamples = (() => {
    const top = foundationNames[extremes.highest.foundation];
    const low = foundationNames[extremes.lowest.foundation];
    const typicalTop = (() => {
      const entries = Object.entries(averageScores).sort((a, b) => b[1] - a[1]);
      return foundationNames[entries[0][0]];
    })();

    return [
      {
        title: 'Workplace Layoffs',
        setup: 'A company must cut 10% of roles. Leaders can either preserve team stability or protect the most vulnerable employees.',
        you: profileLabel === 'Individualizing-leaning'
          ? 'Likely to prioritize minimizing harm to individuals and preventing unfair burden on those already at risk.'
          : profileLabel === 'Binding-leaning'
            ? 'Likely to prioritize preserving team cohesion and honoring commitments to the group’s structure.'
            : 'Likely to weigh harm reduction against team stability, looking for a balanced compromise.',
        typical: 'Typical respondents tend to favor harm reduction and procedural fairness, but are more mixed on loyalty and authority considerations.'
      },
      {
        title: 'Community Tradition',
        setup: 'A community debate arises about changing a long-held tradition that some now see as exclusionary.',
        you: profileLabel === 'Binding-leaning'
          ? 'Likely to value the stabilizing role of tradition and ask how change affects shared identity.'
          : profileLabel === 'Individualizing-leaning'
            ? 'Likely to prioritize inclusion and challenge the tradition if it causes harm or inequity.'
            : 'Likely to balance continuity with reform, seeking respectful evolution of the tradition.',
        typical: `Typical respondents lean toward reform when harms are clear, but still vary based on loyalty and authority scores.`
      },
      {
        title: 'Public Health vs. Personal Freedom',
        setup: 'A policy proposal restricts some individual freedoms to reduce public health risks.',
        you: profileLabel === 'Individualizing-leaning'
          ? 'Likely to support restrictions if they clearly reduce harm and protect vulnerable groups.'
          : profileLabel === 'Binding-leaning'
            ? 'Likely to consider social order and shared responsibility, but may weigh personal liberty and tradition more heavily.'
            : 'Likely to evaluate evidence and tradeoffs, supporting measures that feel proportionate and fair.',
        typical: 'Typical respondents generally support measures when harm reduction is salient, but emphasize fairness and proportionality.'
      }
    ];
  })();

  const summaryText = [
    'Profile Summary',
    narrativeSections.overview.join(' '),
    'Decision-Making Style',
    narrativeSections.decisionStyle.join(' '),
    'Practical Implications',
    narrativeSections.practicalImplications.join(' '),
    'Relationship Implications',
    narrativeSections.relationshipImplications.join(' '),
    'Communication Tips',
    narrativeSections.communicationTips.map((tip, idx) => `${idx + 1}. ${tip}`).join(' '),
    'Growth Edges',
    narrativeSections.growthEdges.map((tip, idx) => `${idx + 1}. ${tip}`).join(' '),
    'Scenario Examples',
    scenarioExamples.map((scenario) => `${scenario.title}: ${scenario.setup} You: ${scenario.you} Typical: ${scenario.typical}`).join(' ')
  ].join('\n');

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

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-3)' }}>Comparison: You vs. Typical Respondent</h2>
          <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>
            “Typical respondent” reflects the moderate U.S. sample averages used in MFQ-30 research.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
              <h3 style={{ marginTop: 0 }}>You</h3>
              <p style={{ margin: 0 }}><strong>Profile:</strong> {profileLabel}</p>
              <p style={{ margin: 0 }}><strong>Individualizing:</strong> {individualizing.toFixed(1)}</p>
              <p style={{ margin: 0 }}><strong>Binding:</strong> {binding.toFixed(1)}</p>
            </div>
            <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
              <h3 style={{ marginTop: 0 }}>Typical Respondent</h3>
              <p style={{ margin: 0 }}><strong>Profile:</strong> {typicalLabel}</p>
              <p style={{ margin: 0 }}><strong>Individualizing:</strong> {typicalIndividualizing.toFixed(1)}</p>
              <p style={{ margin: 0 }}><strong>Binding:</strong> {typicalBinding.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Profile Map */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Profile Map</h2>
          <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>
            This map shows how your Individualizing foundations (Care + Fairness) compare to your Binding foundations
            (Loyalty + Authority + Sanctity).
          </p>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
            aspectRatio: '1 / 1',
            margin: '0 auto',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '1px',
              backgroundColor: 'var(--border)'
            }} />
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '10%',
              bottom: '10%',
              width: '1px',
              backgroundColor: 'var(--border)'
            }} />
            <div style={{
              position: 'absolute',
              left: '12%',
              top: '12%',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)'
            }}>
              Higher Individualizing
            </div>
            <div style={{
              position: 'absolute',
              right: '12%',
              bottom: '12%',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)'
            }}>
              Higher Binding
            </div>
            <div style={{
              position: 'absolute',
              left: `${10 + (binding / 30) * 80}%`,
              top: `${10 + (1 - (individualizing / 30)) * 80}%`,
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--space-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            <span>Individualizing: {individualizing.toFixed(1)}</span>
            <span>Binding: {binding.toFixed(1)}</span>
          </div>
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

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ margin: 0 }}>Narrative Report (10–12 min read)</h2>
            <button
              className="secondary print-hide"
              onClick={() => setShowFullReport((prev) => !prev)}
              style={{ minWidth: 'auto', padding: 'var(--space-2) var(--space-3)' }}
            >
              {showFullReport ? 'Collapse report' : 'Expand report'}
            </button>
          </div>
          {showFullReport && (
            <div style={{ lineHeight: 'var(--leading-relaxed)' }}>
              <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Compass size={18} color="var(--text-secondary)" />
                    <h3 style={{ margin: 0 }}>Overview</h3>
                  </div>
                  {narrativeSections.overview.map((text, idx) => (
                    <p key={idx} style={{ marginBottom: idx === narrativeSections.overview.length - 1 ? 0 : 'var(--space-3)' }}>{text}</p>
                  ))}
                  {narrativeSections.longerForm.map((text, idx) => (
                    <p key={`long-${idx}`} style={{ marginBottom: idx === narrativeSections.longerForm.length - 1 ? 0 : 'var(--space-3)' }}>{text}</p>
                  ))}
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Target size={18} color="var(--text-secondary)" />
                    <h3 style={{ margin: 0 }}>Decision-Making Style</h3>
                  </div>
                  {narrativeSections.decisionStyle.map((text, idx) => (
                    <p key={idx} style={{ marginBottom: idx === narrativeSections.decisionStyle.length - 1 ? 0 : 'var(--space-3)' }}>{text}</p>
                  ))}
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FileText size={18} color="var(--text-secondary)" />
                    <h3 style={{ margin: 0 }}>Practical Implications</h3>
                  </div>
                  <ul style={{ paddingLeft: 'var(--space-5)', marginTop: 'var(--space-3)' }}>
                    {narrativeSections.practicalImplications.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <MessageCircle size={18} color="var(--text-secondary)" />
                    <h3 style={{ margin: 0 }}>Relationship Implications</h3>
                  </div>
                  <ul style={{ paddingLeft: 'var(--space-5)', marginTop: 'var(--space-3)' }}>
                    {narrativeSections.relationshipImplications.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <MessageCircle size={18} color="var(--text-secondary)" />
                    <h3 style={{ margin: 0 }}>Communication Tips</h3>
                  </div>
                  <ul style={{ paddingLeft: 'var(--space-5)', marginTop: 'var(--space-3)' }}>
                    {narrativeSections.communicationTips.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Target size={18} color="var(--text-secondary)" />
                    <h3 style={{ margin: 0 }}>Growth Edges</h3>
                  </div>
                  <ul style={{ paddingLeft: 'var(--space-5)', marginTop: 'var(--space-3)' }}>
                    {narrativeSections.growthEdges.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Compass size={18} color="var(--text-secondary)" />
                    <h3 style={{ margin: 0 }}>Scenario-Based Examples</h3>
                  </div>
                  {scenarioExamples.map((scenario, idx) => (
                    <div key={idx} style={{ marginTop: 'var(--space-3)' }}>
                      <h4 style={{ marginBottom: 'var(--space-2)' }}>{scenario.title}</h4>
                      <p style={{ marginBottom: 'var(--space-2)' }}><strong>Scenario:</strong> {scenario.setup}</p>
                      <p style={{ marginBottom: 'var(--space-2)' }}><strong>Your likely response:</strong> {scenario.you}</p>
                      <p style={{ marginBottom: 0 }}><strong>Typical respondent:</strong> {scenario.typical}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
        <div className="print-hide" style={{ 
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
          <button
            onClick={() => window.print()}
            className="secondary print-hide"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-2)' 
            }}
          >
            Print / Save PDF
          </button>
          <button
            onClick={async () => {
              setShowRadar(true);
              try {
                await exportToPDF(results, chartRef.current, { summaryText });
              } catch (error) {
                alert('Failed to export PDF: ' + error.message);
              }
            }}
            className="secondary print-hide"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 'var(--space-2)' 
            }}
          >
            Download Summary PDF
          </button>
        </div>

        {/* Modals */}
        {showExportModal && (
          <ExportModal
            results={results}
            chartElement={chartRef.current}
            onClose={() => setShowExportModal(false)}
            aiInsights={aiInsights}
            summaryText={summaryText}
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
