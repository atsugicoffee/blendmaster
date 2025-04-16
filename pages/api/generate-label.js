// /pages/api/generate-label.js

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { blendName, origins, concept } = req.body;

    if (!blendName || !origins || !concept) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const date = new Date().toLocaleDateString('ja-JP');
    const labelText = `
【${blendName}】
Produced by BlendMaster
Date: ${date}

コンセプト：
${concept}

使用オリジン：
${origins.map((o) =>
  `・${o.country} / ${o.farm} / ${o.process} / ${o.variety} - ${o.ratio || o.percentage || 0}%`
).join('\n')}
    `;

    return res.status(200).json({ label: labelText.trim() });
  } catch (error) {
    console.error('💥 ラベル生成APIエラー:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
