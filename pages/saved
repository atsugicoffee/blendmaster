import { useEffect, useState } from 'react';

export default function SavedBlends() {
  const [savedBlends, setSavedBlends] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('savedBlends');
    if (stored) setSavedBlends(JSON.parse(stored));
  }, []);

  const handleDelete = (index) => {
    const updated = [...savedBlends];
    updated.splice(index, 1);
    setSavedBlends(updated);
    localStorage.setItem('savedBlends', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>保存されたブレンド</h1>
      {savedBlends.length === 0 ? (
        <p>まだ保存されたブレンドはありません。</p>
      ) : (
        savedBlends.map((blend, index) => (
          <div key={index} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <h2>{blend.name}</h2>
            <p>{blend.scene}</p>
            <ul>
              {blend.result.map((item, i) => (
                <li key={i}>
                  {item.country} / {item.farm} / {item.process} / {item.variety} - {item.ratio}%
                </li>
              ))}
            </ul>
            {blend.comment && (
              <p><strong>コメント:</strong> {blend.comment}</p>
            )}
            <button onClick={() => handleDelete(index)}>削除</button>
          </div>
        ))
      )}
    </div>
  );
}
