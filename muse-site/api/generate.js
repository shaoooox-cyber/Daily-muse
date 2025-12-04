export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "你是一个灵感生成助手，提供简短、有启发性的灵感内容。" },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
      }),
    });

    const json = await openaiRes.json();
    const text = json?.choices?.[0]?.message?.content;

    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ error: "AI 调用失败" });
  }
}
