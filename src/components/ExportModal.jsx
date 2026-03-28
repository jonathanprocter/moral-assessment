import { useState } from 'react';
import { X, FileText, Image, FileJson, FileSpreadsheet, Link2, Check } from 'lucide-react';
import { exportToPDF, exportToPNG, exportToJSON, exportToCSV, generateShareURL } from '../utils/export';

function ExportModal({ results, chartElement, onClose, aiInsights = null, summaryText = null }) {
  const [includeAI, setIncludeAI] = useState(false);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [exporting, setExporting] = useState(null);
  const [shareURL, setShareURL] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleExportPDF = async () => {
    try {
      setExporting('pdf');
      await exportToPDF(results, chartElement, {
        aiInsights: includeAI ? aiInsights : null,
        summaryText: includeSummary ? summaryText : null
      });
    } catch (error) {
      alert('Failed to export PDF: ' + error.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPNG = async () => {
    try {
      setExporting('png');
      await exportToPNG(chartElement);
    } catch (error) {
      alert('Failed to export PNG: ' + error.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportJSON = () => {
    try {
      setExporting('json');
      exportToJSON(results, includeAI ? aiInsights : null);
    } catch (error) {
      alert('Failed to export JSON: ' + error.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportCSV = () => {
    try {
      setExporting('csv');
      exportToCSV(results, includeAI ? aiInsights : null);
    } catch (error) {
      alert('Failed to export CSV: ' + error.message);
    } finally {
      setExporting(null);
    }
  };

  const handleGenerateShareURL = () => {
    try {
      const url = generateShareURL(results.scores);
      setShareURL(url);
    } catch (error) {
      alert('Failed to generate share URL: ' + error.message);
    }
  };

  const handleCopyURL = () => {
    if (shareURL) {
      navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        maxWidth: '600px', 
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

        <h2 style={{ marginBottom: 'var(--space-6)', paddingRight: 'var(--space-8)' }}>
          Export Your Results
        </h2>

        {/* Export Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* PDF Export */}
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-3)'
            }}>
              <FileText size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  PDF Report
                </h3>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  Complete report with charts and interpretation
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={exporting === 'pdf'}
              style={{ width: '100%' }}
            >
              {exporting === 'pdf' ? 'Generating...' : 'Download PDF'}
            </button>
          </div>

          {/* PNG Export */}
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-3)'
            }}>
              <Image size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  Image (PNG)
                </h3>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  Visual summary for sharing
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPNG}
              disabled={exporting === 'png'}
              className="secondary"
              style={{ width: '100%' }}
            >
              {exporting === 'png' ? 'Generating...' : 'Download Image'}
            </button>
          </div>

          {/* JSON Export */}
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-3)'
            }}>
              <FileJson size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  Raw Data (JSON)
                </h3>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  All responses and scores for analysis
                </p>
              </div>
            </div>
            <button
              onClick={handleExportJSON}
              disabled={exporting === 'json'}
              className="secondary"
              style={{ width: '100%' }}
            >
              {exporting === 'json' ? 'Generating...' : 'Download JSON'}
            </button>
          </div>

          {/* CSV Export */}
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-3)'
            }}>
              <FileSpreadsheet size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  CSV Spreadsheet
                </h3>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  Import into Excel, Google Sheets, etc.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={exporting === 'csv'}
              className="secondary"
              style={{ width: '100%' }}
            >
              {exporting === 'csv' ? 'Generating...' : 'Download CSV'}
            </button>
          </div>

          {/* Share URL */}
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-3)'
            }}>
              <Link2 size={24} color="var(--text-primary)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  Share Link
                </h3>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  Generate a shareable URL with your results
                </p>
              </div>
            </div>
            
            {!shareURL ? (
              <button
                onClick={handleGenerateShareURL}
                className="secondary"
                style={{ width: '100%' }}
              >
                Generate Share Link
              </button>
            ) : (
              <div>
                <input
                  type="text"
                  value={shareURL}
                  readOnly
                  style={{
                    width: '100%',
                    marginBottom: 'var(--space-2)',
                    fontSize: 'var(--text-sm)'
                  }}
                />
                <button
                  onClick={handleCopyURL}
                  className="secondary"
                  style={{ 
                    width: '100%',
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
                    'Copy to Clipboard'
                  )}
                </button>
                <p style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  marginTop: 'var(--space-2)',
                  marginBottom: 0
                }}>
                  ⚠️ This link contains your results. Anyone with the link can view your scores.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        {(aiInsights || summaryText) && (
          <div style={{ 
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--border)'
          }}>
            {summaryText && (
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                marginBottom: aiInsights ? 'var(--space-2)' : 0
              }}>
                <input
                  type="checkbox"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                />
                Include narrative summary in PDF
              </label>
            )}
            {aiInsights && (
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)'
              }}>
                <input
                  type="checkbox"
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                />
                Include AI insights in exports
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExportModal;
