import Link from 'next/link';

export default function Header() {
  const linkStyle = {
    marginRight: '1rem',
    padding: '0.4rem 0.8rem',
    background: '#f0f0f0',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  };

  return (
    <nav style={{
      padding: '1rem',
      borderBottom: '1px solid #ccc',
      marginBottom: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <Link href="/" legacyBehavior>
        <a style={linkStyle}>🏠 ホーム</a>
      </Link>
      <Link href="/blend" legacyBehavior>
        <a style={linkStyle}>🧪 ブレンド作成</a>
      </Link>
      <Link href="/single" legacyBehavior>
        <a style={linkStyle}>☕ シングル登録</a>
      </Link>
      <Link href="/saved" legacyBehavior>
        <a style={linkStyle}>💾 保存済みを見る</a>
      </Link>
    </nav>
  );
}
