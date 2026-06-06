export default function Rules() {
    return (
        <main>
            <div className="rules-content">
                <h1>How to Play</h1>

                <section className="rules-section">
                    <h2>The Goal</h2>
                    <p>The aim of each puzzle is to charge the battery as much as required. Too much and you'll overcharge, too little and you'll underpower, electricity is a precise endeavour!</p>
                </section>

                <section className="rules-section">
                    <h2>The Grid</h2>
                    <p>Each puzzle is a grid of cells. Click any cell to start your path. From there, you can only move to cells directly above, below, left, or right of your last cell. You cannot revisit a cell you've already passed through.</p>
                    <div className="rules-example">
                        <div className="rules-grid">
                            <div className="tile-blocked"></div>
                            <div className="tile-blocked"></div>
                            <div className="tile-charge">50</div>
                            <div className="tile-charge">50</div>
                            <div className="tile-charge">50</div>
                            <div className="tile-charge">100</div>
                            <div className="tile-blocked"></div>
                            <div className="tile-charge">150</div>
                            <div className="tile-charge">100</div>
                        </div>
                        <p className="rules-caption">An example grid</p>
                        <p>Electrictity can't be contained easily, your path only ends when no valid moves remain; you can't stop halfway with adjacent cells next door!</p>
                    </div>
                </section>

                <section className="rules-section">
                    <h2>Cell Types</h2>

                    <div className="rules-tile-row">
                        <div className="tile-charge rules-tile">200</div>
                        <div className="rules-tile-desc">
                            <strong>Charge</strong>
                            <p>Adds its value to your total charge when traversed.</p>
                        </div>
                    </div>

                    <div className="rules-tile-row">
                        <div className="tile-next-amp rules-tile">x2 next</div>
                        <div className="rules-tile-desc">
                            <strong>Amp Next</strong>
                            <p>Multiplies the value of the next cell in your path by its value.</p>
                        </div>
                    </div>

                    <div className="rules-tile-row">
                        <div className="tile-global-amp rules-tile">x2 all</div>
                        <div className="rules-tile-desc">
                            <strong>Amp Global</strong>
                            <p>Multiplies your entire accumulated charge by its value when traversed.</p>
                        </div>
                    </div>

                    <div className="rules-tile-row">
                        <div className="tile-blocked rules-tile"></div>
                        <div className="rules-tile-desc">
                            <strong>Blocked</strong>
                            <p>Cannot be traversed.</p>
                        </div>
                    </div>
                </section>

                <section className="rules-section">
                    <h2>Charging</h2>
                    <p>Once your path is complete, you can attempt to charge the battery. If your total matches the target exactly, the battery is fully charged. Too little and you're underpowered. Too much and you've overcharged the circuit.</p>
                    <p>Good luck, the power grid needs you!</p>
                </section>
            </div>
        </main>
    )
}