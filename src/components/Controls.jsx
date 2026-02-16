import React from 'react';

function Controls({ fistWidth, setFistWidth, onAnalyze, isLoading, hasImage }) {
    return (
        <div className="controls-container">
            <div className="input-group">
                <label htmlFor="ref-width">Reference Object Width (cm) <span style={{ color: '#86868B', fontWeight: 'normal' }}>(Optional)</span></label>
                <input
                    id="ref-width"
                    type="number"
                    value={fistWidth}
                    onChange={(e) => setFistWidth(e.target.value)}
                    placeholder="e.g. 5.5 for a credit card"
                    step="0.1"
                />
            </div>

            <button
                className={`analyze-btn ${isLoading ? 'loading' : ''}`}
                onClick={onAnalyze}
                disabled={isLoading || !hasImage}
            >
                {isLoading ? 'Analyzing...' : 'Analyze Food'}
            </button>
        </div>
    );
}

export default Controls;
