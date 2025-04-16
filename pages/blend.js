import { useState, useEffect } from 'react';

export default function Blend() {
  const [concept, setConcept] = useState('');
  const [acidity, setAcidity] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [budget, setBudget] = useState(100);
  const [results, setResults] = useState([]);
  const [label, setLabel] = useState(''); // ✅ ラベル用の状態

  // ブレンド生成
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/generate-blend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept, acidity, bitterness, budget }),
    });

    const data = await response.json();
    setResults(data.blends);
    setLabel('');
  };

  // ✅ ラベル生成関数
  const handleLabelGenerate = async (blend) => {
    try {
      const response = await fetch('/api/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blendName: blend.name,
          origins: blend.origins,
          concept: blend.concept,
        }),
      });

      const data = await response.json();
      setLabel(data.label);
    } catch (error) {
      console.error('ラベル生成エラー:', error);
      setLabel('ラベル生成に失敗しました。');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>ブレンド作成</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
        <label>
          コンセプト
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </label>

        <label>
          酸味 (1-5)
          <input
            type="range"
            min="1"
            max="5"
            value={acidity}
            onChange={(e) => setAcidity(Number(e.target.value))}
          />
        </label>

        <label>
          苦味 (1-5)
          <input
            type="range"
            min="1"
            max="5"
            value={bitterness}
            onChange={(e) => setBitterness(Number(e.target.value))}
          />
        </label>

        <label>
          予算（50円単位）
          <select value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={(i + 1) * 50}>
                {(i + 1) * 50}円
              </option>
            ))}
          </select>
        </label>

        <button type="submit">生成する</button>
      </form>

      {results.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>生成されたブレンド案</h2>
          {results.map((blend, index) => (
            <div key={index} style={{ marginBottom: '2rem' }}>
              <h3>{index + 1}案目：{blend.name}</h3>
              <p>{blend.story}</p>
              <ul>
                {blend.origins.map((origin, i) => (
                  <li key={i}>
                    {origin.country} / {origin.farm} / {origin.process} / {origin.variety} - {origin.percentage}%
                  </li>
                ))}
              </ul>

              {/* ✅ ラベル生成ボタン */}
              <button onClick={() => handleLabelGenerate(blend)} style={{ marginTop: '0.5rem' }}>
                📎 ラベル生成
              </button>

              {/* ✅ ラベル出力 */}
              {label && (
                <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '1rem', marginTop: '1rem' }}>
                  {label}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
