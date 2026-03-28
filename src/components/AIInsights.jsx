import { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Copy, Check, Loader } from 'lucide-react';
import { getAIInsights, validateApiKey } from '../utils/ai';
import { saveApiKey, loadApiKey } from '../utils/storage';
import { aiModels } from '../constants/config';

function AIInsights({ results, onClose, onInsightsGenerated }) {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [showKey, setShowKey] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load saved API key on mount
  useEffect(() => {
    const savedKey = loadApiKey(provider);
    if (savedKey) {
      setApiKey(savedKey);
      setAgreed(true);
    }
  }, [provider]);

  // Update default model when provider changes
  useEffect(() => {
    if (provider === 'openai') {
      setSelectedModel('gpt-4o');
    } else {
      setSelectedModel('claude-sonnet-4-5-20250929');
    }
  }, [provider]);

  const handleGenerate = async () => {
    setError(null);
    
    // Validate API key
    if (!validateApiKey(apiKey, provider)) {
      setError(`Invalid API key format for ${provider}. ${
        provider === 'openai' 
          ? 'OpenAI keys start with "sk-"' 
          : 'Anthropic keys start with "sk-ant-"'
      }`);
      return;
    }

    if (!agreed) {
      setError('Please confirm you understand the API key usage policy.');
      return;
    }

    setLoading(true);

    try {
      // Save API key to session storage
      saveApiKey(provider, apiKey);

      // Generate insights
      const aiInsights = await getAIInsights({
        scores: results.scores,
        responses: results.responses,
        catchQuestionStatus: results.catchQuestionStatus,
        provider,
        apiKey,
        model: selectedModel
      });

      setInsights(aiInsights);
      
      // Pass insights back to parent component
      if (onInsightsGenerated) {
        onInsightsGenerated(aiInsights);
      }
    } catch (err) {
      console.error('AI insights error:', err);
      
      // Parse error message
      let errorMessage = err.message || 'An error occurred';
      
      if (errorMessage.includes('401') || errorMessage.includes('authenticate')) {
        errorMessage = 'Invalid API key. Please check your key and try again.';
      } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        errorMessage = 'API rate limit reached. Please try again in a moment.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Connection failed. Please check your internet and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInsights = () => {
    if (insights) {
      navigator.clipboard.writeText(insights);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    setInsights(null);
    setError(null);
  };

  const models = aiModels[provider] || [];

  return (
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
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div className="card" style={{ 
        maxWidth: '700px', 
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            background: 'transparent',
            border: 'none',
            fontSize: 'var(--text-2xl)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2)',
            minWidth: 'auto',
            minHeight: 'auto',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <Sparkles size={24} color="var(--text-primary)" />
          <h2 style={{ margin: 0, paddingRight: 'var(--space-8)' }}>
            AI-Powered Deep Insights
          </h2>
        </div>

        {!insights ? (
          <>
            <p style={{ 
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 'var(--space-6)',
              color: 'var(--text-secondary)'
            }}>
              Get personalized analysis of your moral foundations profile using AI. 
              Your API key is used directly in your browser and is never stored or 
              transmitted to our servers.
            </p>

            {/* Provider Selection */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontWeight: 'var(--font-medium)'
              }}>
                API Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>

            {/* Model Selection */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontWeight: 'var(--font-medium)'
              }}>
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ width: '100%' }}
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key Input */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontWeight: 'var(--font-medium)'
              }}>
                API Key
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  style={{ width: '100%', paddingRight: 'var(--space-12)' }}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: 'var(--space-2)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    padding: 'var(--space-2)',
                    minWidth: 'auto',
                    minHeight: 'auto',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)'
                  }}
                  type="button"
                >
                  {showKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: 'var(--space-2)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)'
              }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ marginTop: '2px', flexShrink: 0 }}
                />
                <span>
                  I understand my API key is used for this session only and will be cleared when I close this tab.
                </span>
              </label>
            </div>

            {/* Error Display */}
            {error && (
              <div style={{
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-4)',
                display: 'flex',
                gap: 'var(--space-2)',
                alignItems: 'flex-start'
              }}>
                <AlertCircle size={20} color="var(--danger-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--danger-text)' }}>
                  {error}
                </span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !apiKey || !agreed}
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)'
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} className="spinner" />
                  Analyzing your profile...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate AI Insights
                </>
              )}
            </button>

            {/* Privacy Notice */}
            <div style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-relaxed)'
            }}>
              🔒 Your API key is stored only in session memory and cleared when you close this tab. 
              API calls are made directly from your browser to {provider === 'openai' ? 'OpenAI' : 'Anthropic'}.
            </div>
          </>
        ) : (
          <>
            {/* Insights Display */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
              maxHeight: '400px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              lineHeight: 'var(--leading-relaxed)',
              fontSize: 'var(--text-base)'
            }}>
              {insights}
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-3)',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleCopyInsights}
                className="secondary"
                style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy to Clipboard
                  </>
                )}
              </button>
              
              <button
                onClick={handleRegenerate}
                className="secondary"
                style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                <Sparkles size={16} />
                Regenerate
              </button>
            </div>

            <p style={{
              marginTop: 'var(--space-4)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginBottom: 0
            }}>
              Generated by {models.find(m => m.id === selectedModel)?.name || selectedModel}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AIInsights;
