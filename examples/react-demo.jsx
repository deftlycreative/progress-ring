// React demo for @deftlycreative/progress-ring
// To run: npm run dev:react (from the project root)
import { useState } from 'react';
import ProgressRing from '../src/ProgressRing.tsx';

const tasks = [
  { id: 1, label: 'Design', value: 100 },
  { id: 2, label: 'Dev',    value: 65  },
  { id: 3, label: 'QA',     value: 30  },
  { id: 4, label: 'Deploy', value: 0   },
];

const circleStyle = { width: 110, height: 110 };

export default function App() {
  const [liveValue, setLiveValue] = useState(50);

  return (
    <div className="demo">
      <h2>React demo</h2>

      {/* Static examples */}
      <div className="row">
        <div className="card">
          <span>Default</span>
          <ProgressRing value={72} style={circleStyle} />
        </div>

        <div className="card">
          <span>Custom colors</span>
          <ProgressRing
            value={45}
            primaryColor="#e63946"
            mutedColor="#f4a1a7"
            backgroundColor="#fff5f5"
            style={circleStyle}
          />
        </div>

        <div className="card">
          <span>Thick ring</span>
          <ProgressRing
            value={88}
            primaryColor="#2a9d8f"
            mutedColor="#b2dfdb"
            thickness={14}
            style={circleStyle}
          />
        </div>

        <div className="card">
          <span>No animation</span>
          <ProgressRing value={60} primaryColor="#f4a261" animated={false} style={circleStyle} />
        </div>
      </div>

      {/* Loop example */}
      <div className="row">
        {tasks.map(task => (
          <div key={task.id} className="card">
            <span>{task.label}</span>
            <ProgressRing value={task.value} primaryColor="#6c63ff" style={circleStyle} />
          </div>
        ))}
      </div>

      {/* Interactive */}
      <div className="card">
        <span>Interactive: {liveValue}</span>
        <ProgressRing value={liveValue} primaryColor="#6c63ff" thickness={10} style={circleStyle} />
        <input
          type="range"
          min="0"
          max="100"
          value={liveValue}
          onChange={e => setLiveValue(Number(e.target.value))}
          style={{ width: 140 }}
        />
      </div>

      <style>{`
        .demo  { font-family: sans-serif; padding: 40px; background: #f5f5f5; }
        .row   { display: flex; flex-wrap: wrap; gap: 24px; margin-bottom: 24px; }
        .card  { background: #fff; border-radius: 12px; padding: 20px;
                 display: flex; flex-direction: column; align-items: center;
                 gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .card span { font-size: 13px; color: #555; }
      `}</style>
    </div>
  );
}
