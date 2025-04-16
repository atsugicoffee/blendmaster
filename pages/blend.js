import { useState } from 'react';

export default function Blend() {
  const [concept, setConcept] = useState('');
  const [acidity, setAcidity] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [budget, setBudget] = useState(100);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // シンプルなダミー結果を作成（将来的にblendLogicと連携）
    const generatedBlend = {
      concept,
      acidity,
      bitterness,
      budget,
      recommendation: acidity > bitterness ? '明るく華やかなブレンド' : 'コク深いリッチなブレンド'
    };
    setResult(generatedBlend);
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
          酸味 (1–5)
          <input
            type="range"
            min="1"
            max="5"
            value={acidity}
            onChange={(e) => setAcidity(Number(e.target.value))}
          /> {acidity}
        </label>

        <label>
          苦味 (1–5)
          <input
            type="range"
            min="1"
            max="5"
            value={bitterness}
            onChange={(e) => setBitterness(Number(e.target.value))}
          /> {bitterness}
        </label>

        <label>
          予算（50円単位）
          <select value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={(i + 1) * 50}>
                {(i + 1) * 50}円
              </option>
            ))}
          </select>
        </label>

        <button type="submit">生成する</button>
      </form>

      {/* 生成結果表示 */}
      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>生成されたブレンド</h2>
          <p><strong>コンセプト:</strong> {result.concept}</p>
          <p><strong>酸味:</strong> {result.acidity}</p>
          <p><strong>苦味:</strong> {result.bitterness}</p>
          <p><strong>予算:</strong> {result.budget}円</p>
          <p><strong>おすすめタイプ:</strong> {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}
