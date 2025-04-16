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

  const generateBlendName = (concept) => {
    const themes = ['霞', '風', '灯', '詩', 'ひかり', '余韻', '囁き', 'しずく', '日和', '巡り'];
    const rand = themes[Math.floor(Math.random() * themes.length)];
    return `${concept.split(' ')[0]}の${rand}`;
  };

  const generateScene = (concept) => {
    return `「${concept}」をテーマに、心がほどけるような時間をイメージしました。柔らかな光に包まれながら、遠くで揺れる木々の音や、そっと立ち上る香りとともに楽しんでください。`;
  };

  const generateOneBlend = (originList, concept) => {
    const count = Math.min(
      Math.max(2, Math.floor(Math.random() * 9) + 2),
      originList.length
    );
    const shuffled = [...originList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const weights = Array.from({ length: count }, () => Math.random());
    const sum = weights.reduce((a, b) => a + b, 0);
    const distribution = weights.map((w) => Math.round((w / sum) * 100));
    const total = distribution.reduce((a, b) => a + b, 0);
    if (total !== 100) distribution[0] += 100 - total;

    const result = selected.map((o, i) => ({ ...o, ratio: distribution[i] }));

    return {
      name: generateBlendName(concept),
      scene: generateScene(concept),
      result
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origins.length < 2) {
      alert('最低でも2つのシングルオリジンが必要です。');
      return;
    }
    const blends = [
      generateOneBlend(origins, concept),
      generateOneBlend(origins, concept),
      generateOneBlend(origins, concept)
    ];
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
              <h3>{index + 1}案目：{blend.name}</h3>
              <p>{blend.scene}</p>
              <ul>
                {blend.result.map((item, i) => (
                  <li key={i}>
                    {item.country} / {item.farm} / {item.process} / {item.variety} - {item.ratio}%
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
