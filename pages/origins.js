// pages/origins.js
import { useEffect, useState } from 'react';

export default function OriginsList() {
  const [origins, setOrigins] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('singleOrigins');
    if (stored) setOrigins(JSON.parse(stored));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>登録済みシングルオリジン一覧</h1>
      {origins.length === 0 ? (
        <p>登録されているオリジンがありません。</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>品種</th>
              <th>地域</th>
              <th>標高 (m)</th>
            </tr>
          </thead>
          <tbody>
            {origins.map((o) => (
              <tr key={o.id}>
                <td>{o.variety}</td>
                <td>{o.region}</td>
                <td>{o.altitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
