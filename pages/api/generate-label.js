export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { blendName, concept, story } = req.body;

  const label = {
    name: `📛 ${blendName}`,
    catchphrase: `${concept}の余韻が、あなたの日常にやさしく寄り添う。`,
    visual: '水彩画の春風と本を読む人のシルエット',
    story:
      story ||
      'このブレンドは心をほどくような穏やかさをテーマにしています。ふとした時間に、自然と向き合いたくなるような味わいに仕上げました。',
  };

  res.status(200).json(label);
}
