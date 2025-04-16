import { useState, useEffect } from 'react';

export default function Blend() {
  const [concept, setConcept] = useState('');
  const [acidity, setAcidity] = useState(3);
  const [bitterness, setBitterness] = useState(3);
  const [budget, setBudget] = useState(100);
  const [origins, setOrigins] = useState([]);
  const [blendResults, setBlendResults] = useState([]);
  const [comments, setComments] = useState({});

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
      (theme) => `${theme}を旅する珈琲`
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
    setComments({});
  };

  const handleCommentChange = (index, value) => {
    setComments(prev => ({ ...prev, [index]: value }));
  };

  const handleSave = (blend, comment) => {
    const saved = localStorage.getItem('savedBlends');
    const savedList = saved ? JSON.parse(saved) : [];
    savedList.push({ ...blend, comment });
    localStorage.setItem('savedBlends', JSON.stringify(savedList));
    alert('ブレンドを保存しました');
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
