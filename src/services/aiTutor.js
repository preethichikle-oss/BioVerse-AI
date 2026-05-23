import { organelles } from '../data/organelles.js';

const localKnowledge = {
  mitochondria:
    'Mitochondria are the cell energy stations. They use oxygen and nutrients to make ATP, which powers movement, repair, transport, and chemical reactions.',
  atp:
    'ATP is a tiny rechargeable energy molecule. When a cell breaks one phosphate bond, energy is released for tasks like muscle contraction, active transport, and molecule building.',
  protein:
    'Protein synthesis starts when DNA instructions are copied into mRNA. Ribosomes read that message and connect amino acids in the correct order to form a protein.',
  transport:
    'Cell transport is how materials cross the membrane. Passive transport follows concentration gradients, while active transport uses energy to move substances where the cell needs them.',
  nucleus:
    'The nucleus stores DNA and acts like a command hub. It does not do every job itself, but it controls which instructions are sent out for protein production.',
};

export async function askTutor(prompt, context = '') {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'local';
  if (provider === 'openai' && import.meta.env.VITE_OPENAI_API_KEY) {
    return askOpenAI(prompt, context);
  }
  if (provider === 'gemini' && import.meta.env.VITE_GEMINI_API_KEY) {
    return askGemini(prompt, context);
  }
  return localTutor(prompt, context);
}

export async function getOrganelleExplanation(organelleName) {
  const organelle = organelles.find((item) => item.name === organelleName);
  if (!organelle) return localTutor(organelleName);
  return askTutor(organelle.aiPrompt, organelle.detail);
}

export async function getDidYouKnow(topic = 'human cell') {
  return askTutor(
    `Give one surprising, beginner-friendly "Did you know?" fact about ${topic}. Keep it under 35 words.`,
  );
}

async function askOpenAI(prompt, context) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are BioVerse AI, a friendly biology tutor. Explain accurately, simply, and with practical analogies. Keep answers concise.',
        },
        { role: 'user', content: `${context}\n\n${prompt}` },
      ],
      temperature: 0.6,
    }),
  });

  if (!response.ok) throw new Error('OpenAI request failed.');
  const data = await response.json();
  return data.choices?.[0]?.message?.content || localTutor(prompt, context);
}

async function askGemini(prompt, context) {
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${
      import.meta.env.VITE_GEMINI_API_KEY
    }`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are BioVerse AI, a friendly biology tutor. Keep answers concise.\n${context}\n${prompt}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) throw new Error('Gemini request failed.');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || localTutor(prompt, context);
}

function localTutor(prompt, context = '') {
  const text = `${prompt} ${context}`.toLowerCase();
  const key = Object.keys(localKnowledge).find((item) => text.includes(item));
  const core = key
    ? localKnowledge[key]
    : 'A human cell is a living system of specialized parts. Each organelle has a job, and together they manage energy, information, building, transport, and recycling.';

  return Promise.resolve(
    `${core} Quick learning check: can you name the organelle involved and explain its job in one sentence?`,
  );
}
