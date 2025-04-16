// pages/single.js
import { useState, useEffect } from 'react';

export default function SingleOriginForm() {
  const [variety, setVariety] = useState('');
  const [altitude, setAltitude] = useState('');
  const [region, setRegion] = useState('');
  const [origins, setOrigins] = useState([]);

  // 初回読み込み：localStorageから一覧を取得
  useEffect(() => {
    const stored = localStorage.getItem('singleOrigins');
    if (stored) setOrigins(JSON.parse(stored));
  }, []);

  // 保存ボタン押下時
  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrigin = {
      id: Date.now(), // 識別用ID
      variety,
      altitude,
      region,
    };

    const updated = [...origins, newOrigin];
    setOrigins(updated);
    localStorage.setItem('singleOrigins', JSON.stringify(updated));

    // 入力リセット
    setVariety('');
    setAltitude('');
    setRegion('');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>シングルオリジン登録</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <label>品種: </label>
          <input value={variety} onChange={(e) => setVariety(e.target.value)} required />
        </div>
        <div>
          <label>標高(m): </label>
          <input type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} required />
        </div>
        <div>
          <label>地域: </label>
          <input value={region} onChange={(e) => setRegion(e.target.value)} required />
        </div>
        <button type="submit">保存</button>
      </form>

      <h2>登録済みオリジン</h2>
      {origins.length === 0 ? (
        <p>まだ登録されていません。</p>
      ) : (
        <ul>
          {origins.map((o) => (
            <li key={o.id}>
              {o.variety}（{o.region} / {o.altitude}m）
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
