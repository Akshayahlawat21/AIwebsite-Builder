import axios from 'axios';

const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
const model = "deepseek/deepseek-chat";

export const generateResponse = async (prompt) => {
    try {
        const response = await axios.post(
            openRouterUrl,
            {
                model: model,
                messages: [
                    { role: "system", content: "You must return ONLY valid raw JSON." },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5173', // Optional but good for OpenRouter
                    'X-Title': 'GenWeb.ai'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            console.error("OpenRouter Error Data:", error.response.data);
            throw new Error(`OpenRouter Error: ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
};
