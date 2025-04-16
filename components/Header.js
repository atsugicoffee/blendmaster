// components/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <nav style={{
      padding: '1rem',
      borderBottom: '1px solid #ccc',
      marginBottom: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <Link href="/" style={{ marginRight: '1.5rem' }}>🏠 ホーム</Link>
      <Link href="/blend" style={{ marginRight: '1.5rem' }}>🧪 ブレンド作成</Link>
      <Link href="/single">🌱 シングル登録</Link>
    </nav>
  );
}
