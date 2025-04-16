import { useState, useEffect } from 'react';

export default function SingleOriginForm() {
  const [form, setForm] = useState({
    country: '',
    region: '',
    farm: '',
    altitude: '',
    variety: '',
    process: '',
    roast: '',
    flavor: '',
    acidityDesc: '',
    acidityLevel: 3,
    bitternessLevel: 3,
    price: ''
  });

  const [origins, setOrigins] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('singleOrigins');
    if (stored) setOrigins(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrigin = { id: Date.now(), ...form };
    const updated = [...origins, newOrigin];
    setOrigins(updated);
    localStorage.setItem('singleOrigins', JSON.stringify(updated));
    setForm({
      country: '', region: '', farm: '', altitude: '', variety: '', process: '', roast: '',
      flavor: '', acidityDesc: '', acidityLevel: 3, bitternessLevel: 3, price: ''
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>シングルオリジン登録</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 600 }}>
        <input name="country" value={form.country} onChange={handleChange} placeholder="生産国" required />
        <input name="region" value={form.region} onChange={handleChange} placeholder="生産エリア" required />
        <input name="farm" value={form.farm} onChange={handleChange} placeholder="農園名" required />
        <input name="altitude" value={form.altitude} onChange={handleChange} placeholder="標高 (m)" required />
        <input name="variety" value={form.variety} onChange={handleChange} placeholder="品種" required />
        <input name="process" value={form.process} onChange={handleChange} placeholder="プロセス（精製方法）" required />
        <input name="roast" value={form.roast} onChange={handleChange} placeholder="焙煎度合い（例：ライトロースト）" required />
        <input name="flavor" value={form.flavor} onChange={handleChange} placeholder="フレーバー（例：ピーチ、チョコレート）" required />

        <label>
          酸味レベル: {form.acidityLevel}
          <input type="range" name="acidityLevel" min="1" max="5" value={form.acidityLevel} onChange={handleChange} />
        </label>
        <input name="acidityDesc" value={form.acidityDesc} onChange={handleChange} placeholder="酸味の特徴（例：シトラスのような明るさ）" />

        <label>
          苦味レベル: {form.bitternessLevel}
          <input type="range" name="bitternessLevel" min="1" max="5" value={form.bitternessLevel} onChange={handleChange} />
        </label>

        <input name="price" value={form.price} onChange={handleChange} placeholder="価格（円/kg）" required />
        <button type="submit">保存</button>
      </form>

      <h2 style={{ marginTop: '2rem' }}>登録済みオリジン</h2>
      {origins.length === 0 ? (
        <p>まだ登録されていません。</p>
      ) : (
        <ul>
          {origins.map((o) => (
            <li key={o.id}>
              {o.country} - {o.region} - {o.farm} / {o.variety} / {o.altitude}m / {o.process} / {o.roast} / {o.flavor} / 酸味: {o.acidityLevel}（{o.acidityDesc}） / 苦味: {o.bitternessLevel} / {o.price}円/kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
