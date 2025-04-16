export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { blendName, origins, concept } = req.body;

  if (!blendName || !origins || !concept) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ラベルっぽい文章を生成（シンプルな例）
  const date = new Date().toLocaleDateString('ja-JP');
  const labelText = `
【${blendName}】
Produced by BlendMaster ☕
Date: ${date}

コンセプト：
${concept}

使用オリジン：
${origins.map((o, i) => `・${o.country} / ${o.farm} / ${o.process} / ${o.variety} - ${o.percentage}%`).join('\n')}
`;

  res.status(200).json({ label: labelText.trim() });
}
