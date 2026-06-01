// // //chatbout.controller.js
// // const { GoogleGenerativeAI } = require('@google/generative-ai');
// // const dotenv = require('dotenv');

// // dotenv.config();

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // const chatbotController = {
// //   async sendMessage(req, res) {
// //     try {
// //       const { message, userId } = req.body;

// //       if (!message || !userId) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Message and userId are required',
// //         });
// //       }

// //       // Initialize the Gemini model
// //       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// //       // Create a prompt tailored for relationship advice
// //       const prompt = `
// //         You are an AI relationship assistant for RelationSync, a platform focused on enhancing relationships. 
// //         Provide thoughtful, empathetic, and practical advice related to relationships, communication, or personal growth.
// //         The user with ID ${userId} asked: "${message}"
// //         Respond in a conversational tone, keeping the response concise (under 200 words) and relevant to the user's query.
// //         If the query is unclear, ask for clarification while offering a general helpful response.
// //       `;

// //       // Generate response
// //       const result = await model.generateContent(prompt);
// //       const responseText = await result.response.text();

// //       res.status(200).json({
// //         success: true,
// //         data: { response: responseText },
// //       });
// //     } catch (error) {
// //       console.error('Chatbot error:', error);
// //       res.status(500).json({
// //         success: false,
// //         error: 'Failed to process chatbot request',
// //       });
// //     }
// //   },
// // };

// // module.exports = chatbotController;

// const axios = require('axios');
// const dotenv = require('dotenv');

// dotenv.config();

// const API_KEY = process.env.GEMINI_API_KEY;

// const chatbotController = {
//   async sendMessage(req, res) {
//     console.log('Received request:', req.body);
//     try {
//       const { message, userId } = req.body;

//       if (!message || !userId) {
//         return res.status(400).json({
//           success: false,
//           error: 'Message and userId are required',
//         });
//       }

//       // Optimized prompt
//       const prompt = `You are a relationship assistant for RelationSync. Provide empathetic, practical advice on relationships or personal growth. User ID ${userId} asked: "${message}". Respond concisely (<200 words). Clarify if query is vague.`;

//       // Call Gemini API via REST
//       const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//         {
//           contents: [{ role: 'user', parts: [{ text: prompt }] }],
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       if (!responseText) {
//         throw new Error('No response from Gemini API');
//       }

//       res.status(200).json({
//         success: true,
//         data: { response: responseText },
//       });
//     } catch (error) {
//       console.error('Chatbot error:', error);
//       if (error.response?.status === 429) {
//         return res.status(429).json({
//           success: false,
//           error: 'API quota exceeded. Please try again later or upgrade your plan.',
//         });
//       }
//       res.status(500).json({
//         success: false,
//         error: 'Failed to process chatbot request',
//       });
//     }
//   },
// };

// module.exports = chatbotController;
// const axios = require('axios');
// const dotenv = require('dotenv');
// dotenv.config();

// const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
// const OLLAMA_MODEL    = process.env.OLLAMA_MODEL    || 'mistral:latest';
// const OLLAMA_TIMEOUT  = parseInt(process.env.OLLAMA_TIMEOUT_MS) || 60000;

// // Static fallback responses when Ollama is unreachable
// const FALLBACK_RESPONSES = [
//   "I'm having trouble connecting right now. In the meantime — open, honest communication is the foundation of every healthy relationship. Try sharing one appreciation with your partner today.",
//   "I can't reach my AI engine at the moment. A quick tip: active listening (reflecting back what your partner says before responding) can de-escalate most conflicts.",
//   "Connection issue on my end! While I sort that out — scheduling a regular check-in with your partner, even 10 minutes a week, builds consistency and trust over time.",
// ];

// const getStaticFallback = () =>
//   FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

// const chatbotController = {
//   async sendMessage(req, res) {
//     console.log('Chatbot request received:', req.body);

//     const { message, userId } = req.body;

//     if (!message || !userId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Message and userId are required',
//       });
//     }

//     const prompt = `You are a warm, empathetic relationship assistant for RelationSync, a platform focused on Indian relationship dynamics and personal growth.

// The user asked: "${message}"

// Guidelines:
// - Respond in a conversational, supportive tone
// - Keep the response under 200 words
// - Be specific and practical — avoid generic platitudes
// - If the query touches on Indian family dynamics, cultural expectations, or societal pressures, acknowledge them naturally
// - If the query is vague, give a helpful general response and ask one clarifying question
// - Do NOT use bullet points or headers — respond in natural flowing prose

// Respond directly to the user now.`;

//     // Try Ollama with 2 attempts
//     for (let attempt = 1; attempt <= 2; attempt++) {
//       try {
//         console.log(`🦙 Ollama chatbot attempt ${attempt}`);

//         const ollamaRes = await axios.post(
//           `${OLLAMA_BASE_URL}/api/generate`,
//           {
//             model: OLLAMA_MODEL,
//             prompt,
//             stream: false,
//             options: {
//               temperature: 0.8,
//               num_predict: 300,
//             },
//           },
//           {
//             headers: { 'Content-Type': 'application/json' },
//             timeout: OLLAMA_TIMEOUT,
//           }
//         );

//         const responseText = ollamaRes.data?.response?.trim();

//         if (!responseText) throw new Error('Empty response from Ollama');

//         console.log('✅ Ollama chatbot response OK');
//         return res.status(200).json({
//           success: true,
//           data: { response: responseText },
//         });
//       } catch (err) {
//         console.error(`Ollama chatbot attempt ${attempt} failed:`, err.message);
//         if (attempt < 2) await new Promise((r) => setTimeout(r, 1500));
//       }
//     }

//     // Ollama failed — use static fallback (never show a 500 to the user)
//     console.warn('⚠️ Ollama unavailable — serving static fallback response');
//     return res.status(200).json({
//       success: true,
//       data: { response: getStaticFallback() },
//     });
//   },
// };

// module.exports = chatbotController;
const { OpenRouter } = require('@openrouter/sdk');
const dotenv = require('dotenv');

dotenv.config();

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

const FALLBACK_RESPONSES = [
  "I'm having trouble connecting right now. In the meantime — open, honest communication is the foundation of every healthy relationship. Try sharing one appreciation with your partner today.",
  "I can't reach my AI engine at the moment. A quick tip: active listening (reflecting back what your partner says before responding) can de-escalate most conflicts.",
  "Connection issue on my end! While I sort that out — scheduling a regular check-in with your partner, even 10 minutes a week, builds consistency and trust over time.",
];

const getStaticFallback = () =>
  FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

const chatbotController = {
  async sendMessage(req, res) {
    console.log('Chatbot request received:', req.body);
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Message and userId are required',
      });
    }

    const prompt = `You are a warm, empathetic relationship assistant for RelationSync, a platform focused on Indian relationship dynamics and personal growth.

The user asked: "${message}"

Guidelines:
- Respond in a conversational, supportive tone
- Keep the response under 200 words
- Be specific and practical — avoid generic platitudes
- If the query touches on Indian family dynamics, cultural expectations, or societal pressures, acknowledge them naturally
- If the query is vague, give a helpful general response and ask one clarifying question
- Do NOT use bullet points or headers — respond in natural flowing prose

Respond directly to the user now.`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`🤖 OpenRouter chatbot attempt ${attempt}`);

        const response = await openrouter.chat.send({
          chatRequest: {
            model: OPENROUTER_MODEL,
            messages: [{ role: 'user', content: prompt }],
            stream: false,
          },
        });

        const responseText = response.choices?.[0]?.message?.content?.trim();
        if (!responseText) throw new Error('Empty response from OpenRouter');

        console.log('✅ OpenRouter chatbot response OK');
        return res.status(200).json({
          success: true,
          data: { response: responseText },
        });
      } catch (err) {
        console.error(`OpenRouter chatbot attempt ${attempt} failed:`, err.message);
        if (attempt < 2) await new Promise((r) => setTimeout(r, 1500));
      }
    }

    console.warn('⚠️ OpenRouter unavailable — serving static fallback response');
    return res.status(200).json({
      success: true,
      data: { response: getStaticFallback() },
    });
  },
};

module.exports = chatbotController;