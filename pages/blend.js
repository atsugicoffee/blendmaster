import { useState, useEffect } from 'react';

export default function Blend() {
  const [concept, setConcept] = useState('');
  const [acidity, setAcidity] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [budget, setBudget] = useState(100);
  const [origins, setOrigins] = useState([]);
  const [blendResults, setBlendResults] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('singleOrigins');
    if (stored) setOrigins(JSON.parse(stored));
  }, []);

  const generateStory = (concept, blendArray) => {
    const highlights = blendArray
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 3)
      .map(o => `${o.farm}の${o.variety}（${o.process}）が${o.ratio}%`)
      .join('、');

    return `「${concept}」というコンセプトに対して、${highlights} という構成でブレンドを設計しました。明るさ、甘さ、奥行きのバランスがとれた味わいに仕上がっています。`;
  };

  const generateOneBlend = () => {
    const count = Math.min(
      Math.max(2, Math.floor(Math.random() * 9) + 2),
      origins.length
    );

    const shuffled = [...origins].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const weights = Array.from({ length: count }, () => Math.random());
    const sum = weights.reduce((a, b) => a + b, 0);
    const distribution = weights.map((w) => Math.round((w / sum) * 100));

    const total = distribution.reduce((a, b) => a + b, 0);
    if (total !== 100) distribution[0] += 100 - total;

    const result = selected.map((o, i) => ({
      ...o,
      ratio: distribution[i]
    }));

    const story = generateStory(concept, result);
    return { concept, result, story };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origins.length < 2) {
      alert('最低でも2つのシングルオリジンが必要です。');
      return;
    }
    const blends = [generateOneBlend(), generateOneBlend(), generateOneBlend()];
    setBlendResults(blends);
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

      {blendResults.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>生成されたブレンド案</h2>
          {blendResults.map((blend, index) => (
            <div key={index} style={{ marginBottom: '2rem' }}>
              <h3>{index + 1}案目</h3>
              <p><strong>コンセプト:</strong> {blend.concept}</p>
              <ul>
                {blend.result.map((item, i) => (
                  <li key={i}>
                    {item.country} / {item.farm} / {item.process} / {item.variety} - {item.ratio}%
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '1rem' }}>{blend.story}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
