const OpenAI = require("openai");
const { serverConfig } = require("../config");
const token = serverConfig.OPENAI;

async function main(prompt) {
  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token,
  });

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "" },
      { role: "user", content: prompt }
    ],
    model: "gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
  });

  return response.choices[0].message.content;
}

module.exports = { main };
