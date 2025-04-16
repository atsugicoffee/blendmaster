// components/Header.js
import Link from 'next/link';

export default function Header() {
  const linkStyle = {
    marginRight: '1rem',
    padding: '0.5rem 1rem',
    background: '#f0f0f0',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  };

  const hoverStyle = {
    background: '#e0e0e0',
  };

  return (
    <nav style={{
      padding: '1rem',
      borderBottom: '1px solid #ccc',
      marginBottom: '2rem',
      fontFamily: 'sans-serif',
    }}>
      <Link href="/" legacyBehavior>
        <a style={linkStyle} onMouseOver={e => e.currentTarget.style.background = hoverStyle.background}
           onMouseOut={e => e.currentTarget.style.background = linkStyle.background}>🏠 ホーム</a>
      </Link>
      <Link href="/blend" legacyBehavior>
        <a style={linkStyle} onMouseOver={e => e.currentTarget.style.background = hoverStyle.background}
           onMouseOut={e => e.currentTarget.style.background = linkStyle.background}>🧪 ブレンド作成</a>
      </Link>
      <Link href="/single" legacyBehavior>
        <a style={linkStyle} onMouseOver={e => e.currentTarget.style.background = hoverStyle.background}
           onMouseOut={e => e.currentTarget.style.background = linkStyle.background}>☕ シングル登録</a>
      </Link>
      <Link href="/saved" legacyBehavior>
        <a style={linkStyle} onMouseOver={e => e.currentTarget.style.background = hoverStyle.background}
           onMouseOut={e => e.currentTarget.style.background = linkStyle.background}>💾 保存済みを見る</a>
      </Link>
    </nav>
  );
}
