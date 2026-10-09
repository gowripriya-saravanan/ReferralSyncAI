import React, { useState } from 'react';
import {
  Bot,
  Send,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  badge?: string;
}

export const AiAssistantPage: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hello Doctor. I am the ReferralSync AI Coordination Assistant. I can help evaluate receiving hospital capabilities, explain why specific facilities were matched, or compare ICU bed readiness. How can I assist with your patient transfer needs today?",
      timestamp: '10:00 AM',
      badge: 'Referral Coordinator',
    },
  ]);

  const presetQuestions = [
    'Which hospitals support neurological referrals?',
    'Why was Regional Neuro & Trauma Hospital recommended?',
    'What requirements are missing for acute cardiac referrals?',
    'Compare Regional Neuro vs Coimbatore Advanced Care.',
  ];

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('neuro') || q.includes('neurological')) {
      return `Two regional network hospitals currently support acute neurological and stroke referrals:\n\n1. **Regional Neuro & Trauma Hospital** (6.2 km): Equipped with 3T MRI, 128-Slice CT, 24/7 Stroke Unit, mechanical thrombectomy capability, and 4 available Neuro-ICU beds.\n2. **Coimbatore Advanced Care Hospital** (8.4 km): Equipped with 1.5T MRI, 64-Slice CT, Medical ICU, and 24/7 acute neurology on-call coverage.`;
    }

    if (q.includes('why was') || q.includes('regional neuro & trauma')) {
      return `**Regional Neuro & Trauma Hospital** was ranked as the primary receiving recommendation for the following verified criteria:\n\n• **Specialty Coverage**: Certified neurology and neurosurgery departments with acute stroke protocols.\n• **Equipment Match**: Operational 3T MRI scanner on site with rapid trauma imaging.\n• **Bed Availability**: 4 dedicated Neuro-ICU beds reported open.\n• **Proximity**: Shortest transit window (6.2 km, estimated 17 mins by ambulance).`;
    }

    if (q.includes('missing') || q.includes('cardiac') || q.includes('cath')) {
      return `For acute cardiac referrals requiring emergency catheterization (Cath Lab):\n\n• **Origin Hospital (Metro Care)** currently lacks an operational Cath Lab.\n• **Kongu Heart & Emergency Hospital** (9.8 km) satisfies all requirements (Dual Cath Lab, primary PCI team, 3 CCU beds available).\n• No core equipment gaps exist when routed to Kongu Heart.`;
    }

    if (q.includes('compare')) {
      return `**Side-by-Side Facility Evaluation:**\n\n• **Regional Neuro & Trauma Hospital**: Best for acute stroke, craniotomy, and open pelvic trauma. Features 3T MRI, Level 1 Trauma bay, and 4 Neuro-ICU beds (6.2 km).\n• **Coimbatore Advanced Care Hospital**: Broader multi-organ support (Medical ICU, continuous dialysis, pulmonology ventilators, and cardiology). Features 1.5T MRI and 6 ICU beds (8.4 km).`;
    }

    return `Referral capability query processed: For "${query}", the verified regional hospital database indicates that acute transfers should be prioritized based on specialty department availability, verified on-site equipment, and ICU bed status. Please select a patient to launch automated requirement extraction.`;
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const replyText = generateAnswer(text);
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'Capability Analysis',
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    if (!textToSend) setInputVal('');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0F6FE] border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#17324D] tracking-tight">
              Clinical Referral AI Assistant
            </h2>
            <p className="text-xs text-[#60758A]">
              Specialized facility capability inquiry and triage consultation
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#176B87] bg-[#EDF5FA] px-2.5 py-1 rounded-full border border-[#C9DCE8] flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B8DEF] animate-pulse" />
          Referral Coordination Agent
        </span>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-xs font-semibold text-[#60758A] whitespace-nowrap">Suggested:</span>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDF5FA] hover:text-[#176B87] hover:border-[#176B87] border border-[#DCE8F0] text-[#17324D] transition-all cursor-pointer whitespace-nowrap shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-[#60758A]">
                {msg.sender === 'user' ? 'Dr. Ananya Rao' : 'ReferralSync AI'}
              </span>
              {msg.badge && (
                <span className="text-[10px] font-bold text-[#176B87] bg-[#EDF5FA] px-1.5 py-0.2 rounded border border-[#C9DCE8]">
                  {msg.badge}
                </span>
              )}
              <span className="text-[10px] text-[#60758A]">{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#176B87] text-white rounded-tr-none shadow-xs'
                  : 'bg-[#F4F8FC] border border-[#DCE8F0] text-[#17324D] rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="bg-white rounded-2xl border border-[#C9DCE8] p-2 shadow-[0_2px_8px_rgba(23,107,135,0.04)] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about hospital capabilities, ICU availability, equipment matches..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-[#17324D] placeholder-[#60758A]/60 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] disabled:opacity-40 text-white transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

