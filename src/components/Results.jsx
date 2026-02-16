import React from 'react';

function Results({ data, error }) {
    const [showLogic, setShowLogic] = React.useState(false);

    if (error) {
        return (
            <div className="results-container error">
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="results-card">
            <div className="res-header">
                <h2 className="res-title">{data.food_name || "Unknown Food"}</h2>
                <p className="res-description">{data.description}</p>
            </div>

            <div className="res-metrics">
                <div className="res-metric-box">
                    <div className="res-metric-label">
                        ESTIMATED WEIGHT
                        <button
                            className="info-icon"
                            onMouseEnter={() => setShowLogic(true)}
                            onMouseLeave={() => setShowLogic(false)}
                            aria-label="Estimation logic"
                        >
                            ⓘ
                        </button>
                    </div>
                    <div className="res-metric-value">
                        {data.estimated_weight_g} <span className="res-unit">g</span>
                    </div>
                    {showLogic && data.estimation_logic && (
                        <div className="logic-tooltip">
                            {data.estimation_logic}
                        </div>
                    )}
                </div>

                <div className="res-metric-box">
                    <div className="res-metric-label">ESTIMATED CALORIES</div>
                    <div className="res-metric-value">
                        {data.estimated_calories_kcal} <span className="res-unit">kcal</span>
                    </div>
                </div>
            </div>

            <div className="res-macros">
                <div className="macro-item">
                    <div className="macro-label">蛋白質</div>
                    <div className="macro-value">{data.protein_g} <span className="macro-unit">g</span></div>
                </div>
                <div className="macro-item">
                    <div className="macro-label">脂肪</div>
                    <div className="macro-value">{data.fat_g} <span className="macro-unit">g</span></div>
                </div>
                <div className="macro-item">
                    <div className="macro-label">碳水</div>
                    <div className="macro-value">{data.carbs_g} <span className="macro-unit">g</span></div>
                </div>
            </div>

            <div className="res-footer">
                GEMINI 2.5 FLASH VISION
            </div>
        </div>
    );
}

export default Results;
