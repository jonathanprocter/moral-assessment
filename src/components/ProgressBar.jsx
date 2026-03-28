function ProgressBar({ current, total, showLabel = true }) {
  const percentage = (current / total) * 100;

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ 
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-2)',
          textAlign: 'right'
        }}>
          {current} of {total}
        </div>
      )}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: 'var(--text-primary)',
            transition: 'width 0.3s ease',
            borderRadius: 'var(--radius-full)'
          }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Progress: ${current} of ${total} questions completed`}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
