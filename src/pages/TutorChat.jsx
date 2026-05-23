import { useEffect, useRef, useState } from 'react';
import { AudioLines, Loader2, Send, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader.jsx';
import { askTutor } from '../services/aiTutor.js';
import { useLearningStore } from '../store/useLearningStore.js';

const suggestions = ['What does mitochondria do?', 'Explain protein synthesis simply', 'What is ATP energy?', 'How does cell transport work?'];

export default function TutorChat() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scroller = useRef(null);
  const { chatHistory, addChatMessage, resetChat, addCompletion, soundEnabled } = useLearningStore();

  useEffect(() => {
    addCompletion('Tutor');
  }, [addCompletion]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory, loading]);

  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    setInput('');
    addChatMessage({ role: 'user', content: text });
    setLoading(true);
    try {
      const answer = await askTutor(text);
      addChatMessage({ role: 'assistant', content: answer });
      if (soundEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
      }
    } catch (error) {
      addChatMessage({ role: 'assistant', content: 'I had trouble reaching the AI service, so switch to local mode or check your API key.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader eyebrow="AI Tutor Chat" title="Ask BioVerse AI anything about cells">
        Get short explanations, analogies, and learning checks. Voice narration uses your browser SpeechSynthesis support.
      </SectionHeader>

      <section className="glass mx-auto flex h-[68vh] max-w-5xl flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <p className="font-bold text-white">BioVerse Tutor</p>
            <p className="text-xs text-slate-500">OpenAI, Gemini, or offline local tutor mode</p>
          </div>
          <button className="icon-btn" onClick={resetChat} title="Clear chat"><Trash2 /></button>
        </div>
        <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto p-4">
          {chatHistory.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-3xl border px-4 py-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'border-cyanGlow/40 bg-cyanGlow/15 text-white'
                  : 'border-white/10 bg-white/[0.04] text-slate-300'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-sm text-cyanGlow"><Loader2 className="h-4 w-4 animate-spin" /> BioVerse AI is typing...</div>}
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((item) => (
              <button key={item} onClick={() => send(item)} className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:border-cyanGlow/40 hover:text-white">
                {item}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-cyanGlow/50"
              placeholder="Ask about ATP, ribosomes, transport..."
            />
            <button className="primary-btn px-4" type="submit"><Send className="h-5 w-5" /></button>
            <button className="icon-btn" type="button" onClick={() => window.speechSynthesis?.cancel()} title="Stop narration"><AudioLines /></button>
          </form>
        </div>
      </section>
    </div>
  );
}
