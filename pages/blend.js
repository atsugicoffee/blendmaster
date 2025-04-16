import { useState, useEffect } from 'react';

export default function Blend() {
  const [concept, setConcept] = useState('');
  const [acidity, setAcidity] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [budget, setBudget] = useState(100);
  const [origins, setOrigins] = useState([]);
  const [blendResult, setBlendResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('singleOrigins');
    if (stored) setOrigins(JSON.parse(stored));
  }, []);

  const generateBlend = () => {
    if (origins.length < 2) {
      alert('最低でも2つのシングルオリジンが必要です。');
      return;
    }

    const count = Math.min(
      Math.max(2, Math.floor(Math.random() * 10) + 1),
      origins.length
    );

    const shuffled = [...origins].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    // 配合比率計算（合計100%）
    const weights = Array.from({ length: count }, () => Math.random());
    const sum = weights.reduce((a, b) => a + b, 0);
    const distribution = weights.map((w) => Math.round((w / sum) * 100));

    // 比率合計が100%になるように微調整
    const total = distribution.reduce((a, b) => a + b, 0);
    if (total !== 100) distribution[0] += 100 - total;

    const result = selected.map((o, i) => ({
      ...o,
      ratio: distribution[i]
    }));

    setBlendResult({ concept, result });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateBlend();
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
          /> {acidity}
        </label>

        <label>
          苦味 (1-5)
          <input
            type="range"
            min="1"
            max="5"
            value={bitterness}
            onChange={(e) => setBitterness(Number(e.target.value))}
          /> {bitterness}
        </label>

        <label>
          予算 (50円単位)
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

      {blendResult && (
        <div style={{ marginTop: '2rem' }}>
          <h2>生成されたブレンド</h2>
          <p><strong>コンセプト:</strong> {blendResult.concept}</p>
          <ul>
            {blendResult.result.map((item, i) => (
              <li key={i}>
                {item.variety}（{item.region} / {item.altitude}m） - {item.ratio}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
