import { useState } from 'react';

export default function SingleOrigin() {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [process, setProcess] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrigin = {
      name,
      origin,
      process,
      price,
      note,
    };
    console.log('登録されたシングルオリジン:', newOrigin);
    setSaved(true);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>シングルオリジン登録</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 480 }}>
        <label>
          名前
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          生産国・地域
          <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
        </label>

        <label>
          精製方法
          <input type="text" value={process} onChange={(e) => setProcess(e.target.value)} required />
        </label>

        <label>
          価格（円/kg）
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>

        <label>
          備考（例：品種、標高、味の特徴など）
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <button type="submit">登録</button>
      </form>

      {saved && (
        <p style={{ marginTop: '1rem', color: 'green' }}>保存されました（仮）🎉</p>
      )}
    </div>
  );
}
