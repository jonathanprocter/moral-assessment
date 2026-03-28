// Export utilities for PDF, PNG, JSON, and CSV
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { foundationNames, averageScores } from '../constants/normativeData.js';
import { questions } from '../data/questions.js';

/**
 * Export results as PDF
 * @param {Object} data - Results data
 * @param {HTMLElement} chartElement - Chart element to capture
 * @param {Object} options - Optional export options
 * @param {string} options.aiInsights - Optional AI insights
 * @param {string} options.summaryText - Optional narrative summary
 * @returns {Promise<void>}
 */
export const exportToPDF = async (data, chartElement, options = {}) => {
  try {
    const { aiInsights = null, summaryText = null } = options;
    const pdf = new jsPDF('p', 'mm', 'letter');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 19; // 0.75 inch margins
    let yPosition = margin;
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Moral Foundations Questionnaire', margin, yPosition);
    yPosition += 8;
    
    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Your Results', margin, yPosition);
    yPosition += 5;
    
    // Date
    pdf.setFontSize(10);
    const date = new Date(data.completedAt).toLocaleDateString();
    pdf.text(`Completed: ${date}`, margin, yPosition);
    yPosition += 10;
    
    // Capture chart
    if (chartElement) {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (yPosition + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    }
    
    // Scores table
    if (yPosition + 50 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Your Scores', margin, yPosition);
    yPosition += 7;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    for (const [key, name] of Object.entries(foundationNames)) {
      const score = data.scores[key];
      const avg = averageScores[key];
      pdf.text(`${name}: ${score}/30 (Average: ${avg})`, margin, yPosition);
      yPosition += 6;
    }
    
    yPosition += 5;
    
    // Narrative Summary
    if (summaryText) {
      if (yPosition + 30 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary Narrative', margin, yPosition);
      yPosition += 7;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');

      const lines = pdf.splitTextToSize(summaryText, pageWidth - (2 * margin));
      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      }

      yPosition += 4;
    }

    // AI Insights
    if (aiInsights) {
      if (yPosition + 30 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI Insights', margin, yPosition);
      yPosition += 7;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      const lines = pdf.splitTextToSize(aiInsights, pageWidth - (2 * margin));
      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      }
    }
    

    
    // Save
    pdf.save(`mfq-results-${Date.now()}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

/**
 * Export chart as PNG image
 * @param {HTMLElement} chartElement - Chart element to capture
 * @returns {Promise<void>}
 */
export const exportToPNG = async (chartElement) => {
  try {
    if (!chartElement) {
      throw new Error('Chart is not available for export yet. Please try again.');
    }

    const canvas = await html2canvas(chartElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      width: 1200,
      height: 630
    });
    
    const link = document.createElement('a');
    link.download = `mfq-chart-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('PNG export error:', error);
    throw error;
  }
};

/**
 * Export results as JSON
 * @param {Object} data - Results data
 * @param {string} aiInsights - Optional AI insights
 */
export const exportToJSON = (data, aiInsights = null) => {
  try {
    const exportData = {
      metadata: {
        version: 'MFQ-30',
        completedAt: new Date(data.completedAt).toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      scores: data.scores,
      responses: data.responses,
      catchQuestions: data.catchQuestionStatus,
      aiInsights: aiInsights || null
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const link = document.createElement('a');
    link.download = `mfq-results-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('JSON export error:', error);
    throw error;
  }
};

/**
 * Export results as CSV
 * @param {Object} data - Results data
 * @param {string} aiInsights - Optional AI insights
 */
export const exportToCSV = (data, aiInsights = null) => {
  try {
    const rows = [
      ['Question', 'Foundation', 'Response', 'Scale Type']
    ];
    
    for (const question of questions) {
      if (question.catch) continue; // Skip catch questions
      
      const response = data.responses[question.id];
      const scaleType = question.part === 1 ? 'Relevance (0-5)' : 'Agreement (0-5)';
      const foundationName = question.foundation 
        ? foundationNames[question.foundation] 
        : 'N/A';
      
      rows.push([
        `Q${question.id}`,
        foundationName,
        response !== undefined ? response : '',
        scaleType
      ]);
    }
    
    // Add summary scores
    rows.push([]);
    rows.push(['Foundation', 'Score', 'Average', 'Difference']);
    
    for (const [key, name] of Object.entries(foundationNames)) {
      const score = data.scores[key];
      const avg = averageScores[key];
      const diff = (score - avg).toFixed(1);
      
      rows.push([name, score, avg, diff]);
    }
    
    // Add AI Insights if available
    if (aiInsights) {
      rows.push([]);
      rows.push(['AI Insights']);
      rows.push([aiInsights]);
    }
    
    const csvContent = rows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `mfq-results-${Date.now()}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('CSV export error:', error);
    throw error;
  }
};

/**
 * Generate shareable URL with encoded results
 * @param {Object} scores - Foundation scores
 * @returns {string} Shareable URL
 */
export const generateShareURL = (scores) => {
  try {
    const data = {
      c: scores.care,
      f: scores.fairness,
      l: scores.loyalty,
      a: scores.authority,
      s: scores.sanctity,
      t: Date.now()
    };
    
    const encoded = btoa(JSON.stringify(data));
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}#/results/${encoded}`;
  } catch (error) {
    console.error('Share URL generation error:', error);
    throw error;
  }
};

/**
 * Decode results from share URL
 * @param {string} encoded - Encoded data string
 * @returns {Object|null} Decoded scores or null
 */
export const decodeShareURL = (encoded) => {
  try {
    const decoded = JSON.parse(atob(encoded));
    return {
      care: Number(decoded.c),
      fairness: Number(decoded.f),
      loyalty: Number(decoded.l),
      authority: Number(decoded.a),
      sanctity: Number(decoded.s),
      timestamp: decoded.t ? Number(decoded.t) : null
    };
  } catch (error) {
    console.error('Share URL decode error:', error);
    return null;
  }
};
