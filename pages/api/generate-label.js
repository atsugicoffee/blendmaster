// pages/api/generate-blend.js

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { concept, acidity, bitterness, budget } = req.body;

  if (!concept || acidity == null || bitterness == null || budget == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // モックのシングルオリジン（仮データ）
  const sampleOrigins = [
    { country: 'Guatemala', farm: 'ATSUGI COFFEE FARM', process: 'ウォッシュド', variety: 'パチェ' },
    { country: 'Guatemala', farm: 'El Injerto', process: 'ウォッシュド', variety: 'ゲイシャ' },
    { country: 'Guatemala', farm: 'リキダンバル農園', process: 'ナチュラル', variety: 'ブルボン' },
    { country: 'Panama', farm: 'Los Alpes', process: 'ハニー', variety: 'ゲイシャ' },
  ];

  // 3案のダミーを返す
  const blends = Array.from({ length: 3 }, (_, i) => {
    const selected = sampleOrigins
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 2); // 2~4種類
    const percentages = Array(selected.length).fill(0).map(() => Math.random());
    const total = percentages.reduce((a, b) => a + b, 0);
    const normalized = percentages.map(p => Math.round((p / total) * 100));
    const corrected = normalized.map((p, i) =>
      i === normalized.length - 1 ? 100 - normalized.slice(0, -1).reduce((a, b) => a + b, 0) : p
    );

    const origins = selected.map((o, j) => ({
      ...o,
      percentage: corrected[j]
    }));

    return {
      name: `${concept} #${i + 1}`,
      concept,
      story: `${concept} という言葉が持つ奥行きを味覚で描いたブレンドです。`,
      origins
    };
  });

  res.status(200).json({ blends });
}
