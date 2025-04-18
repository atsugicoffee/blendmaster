import { useState, useEffect } from 'react';

export default function Blend() {
  const [concept, setConcept] = useState('');
  const [acidity, setAcidity] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [budget, setBudget] = useState(100);
  const [origins, setOrigins] = useState([]);
  const [blendResults, setBlendResults] = useState([]);
  const [comments, setComments] = useState({});
  const [labels, setLabels] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('singleOrigins');
    if (stored) setOrigins(JSON.parse(stored));
  }, []);

  const generateBlendName = (concept) => {
    const styles = [
      (theme) => `${theme}の余白`,
      (theme) => `${theme}に溶ける刻`,
      (theme) => `巡る${theme}`,
      (theme) => `${theme}の輪郭`,
      (theme) => `静かな${theme}の灯り`,
      (theme) => `${theme}を旅する珈琲`,
    ];
    const fn = styles[Math.floor(Math.random() * styles.length)];
    return fn(concept.replace(/の.*$/, '').trim());
  };

  const generateScene = (concept) => {
    const examples = [
      `「${concept}」をテーマに、誰にも邪魔されない時間が静かに流れる情景を描きました。`,
      `「${concept}」という言葉から、草木がそよぎ、光がゆらめく瞬間を想像しました。`,
      `「${concept}」は、遠い記憶の中にある風景。時間を忘れて味わう一杯を表現しました。`,
      `「${concept}」を思い浮かべながら、あなただけの特別な午後に寄り添う香りをつくりました。`,
      `このブレンドは「${concept}」という言葉が持つ奥行きを味覚で描いたものです。`,
      `「${concept}」という響きから生まれた、心の中にそっと灯るようなコーヒーを表現しました。`
    ];
    return examples[Math.floor(Math.random() * examples.length)];
  };

  const generateOneBlend = (originList, concept, budget) => {
    const maxTries = 20;
    const tolerance = 50;

    for (let attempt = 0; attempt < maxTries; attempt++) {
      const count = Math.floor(Math.random() * 4) + 2; // 2~5種類
      const shuffled = [...originList].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      if (selected.length < 2) continue;

      const weights = Array.from({ length: count }, () => Math.random());
      const sum = weights.reduce((a, b) => a + b, 0);
      const distribution = weights.map((w) => Math.round((w / sum) * 100));
      const total = distribution.reduce((a, b) => a + b, 0);
      if (total !== 100) distribution[0] += 100 - total;

      const cost = selected.reduce(
        (acc, origin, i) => acc + (origin.price || 0) * (distribution[i] / 100),
        0
      );

      if (cost >= budget - tolerance && cost <= budget + tolerance) {
        const result = selected.map((o, i) => ({ ...o, ratio: distribution[i] }));
        return {
          name: generateBlendName(concept),
          scene: generateScene(concept),
          result,
          cost: Math.round(cost),
        };
      }
    }

    // fallback: 最安構成で返す（ただし2種類以上）
    const sorted = [...originList].sort((a, b) => (a.price || 0) - (b.price || 0));
    const fallbackSelected = sorted.slice(0, 2);
    const result = fallbackSelected.map((o, i) => ({ ...o, ratio: i === 0 ? 50 : 50 }));
    const fallbackCost = result.reduce((acc, o) => acc + (o.price || 0) * (o.ratio / 100), 0);

    return {
      name: generateBlendName(concept),
      scene: `「${concept}」というテーマに沿い、最もお得なシングル構成でブレンドしました。`,
      result,
      cost: Math.round(fallbackCost),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origins.length < 2) {
      alert('最低でも2つのシングルオリジンが必要です。');
      return;
    }
    const blends = [
      generateOneBlend(origins, concept, budget),
      generateOneBlend(origins, concept, budget),
      generateOneBlend(origins, concept, budget),
    ];
    setBlendResults(blends);
    setComments({});
    setLabels({});
  };

  const handleCommentChange = (index, value) => {
    setComments((prev) => ({ ...prev, [index]: value }));
  };

  const handleSave = (blend, comment) => {
    const saved = localStorage.getItem('savedBlends');
    const savedList = saved ? JSON.parse(saved) : [];
    savedList.push({ ...blend, comment });
    localStorage.setItem('savedBlends', JSON.stringify(savedList));
    alert('ブレンドを保存しました');
  };

  const handleLabelGenerate = async (blend, index) => {
    try {
      const response = await fetch('/api/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blendName: blend.name,
          origins: blend.result,
          concept: blend.concept || concept,
        }),
      });
      const data = await response.json();
      setLabels((prev) => ({ ...prev, [index]: data.label }));
    } catch (err) {
      console.error('ラベル生成エラー:', err);
      setLabels((prev) => ({ ...prev, [index]: 'ラベル生成に失敗しました。' }));
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
          <input type="range" min="1" max="5" value={acidity} onChange={(e) => setAcidity(Number(e.target.value))} /> {acidity}
        </label>

        <label>
          苦味 (1-5)
          <input type="range" min="1" max="5" value={bitterness} onChange={(e) => setBitterness(Number(e.target.value))} /> {bitterness}
        </label>

        <label>
          予算（円単位で自由入力）
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="例: 250"
            style={{ width: '100%' }}
          />
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
              <p style={{ fontWeight: 'bold' }}>原価合計：{blend.cost}円</p>
              <ul>
                {blend.result.map((item, i) => (
                  <li key={i}>
                    {item.country} / {item.farm} / {item.process} / {item.variety} - {item.ratio}%
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1rem' }}>
                <label>
                  コメント：<br />
                  <textarea
                    rows="2"
                    style={{ width: '100%' }}
                    value={comments[index] || ''}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                  />
                </label>
                <button onClick={() => handleSave(blend, comments[index] || '')}>保存する</button>
                <button onClick={() => handleLabelGenerate(blend, index)} style={{ marginLeft: '1rem' }}>
                  📎 ラベル生成
                </button>
                {labels[index] && (
                  <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '1rem', marginTop: '1rem' }}>
                    {labels[index]}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
