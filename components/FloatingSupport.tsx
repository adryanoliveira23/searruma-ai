"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* AI Bubble Message */}
      {showBubble && !isOpen && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-[240px] animate-in slide-in-from-bottom-2 fade-in duration-500 relative">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">
              <Sparkles size={12} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
              Assistente IA
            </span>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Olá! Sabia que você pode ter suas fotos de aniversário prontas em
            menos de 3 minutos? 🎂✨
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-3 text-[11px] font-bold text-indigo-600 hover:underline"
          >
            Quero saber mais
          </button>
        </div>
      )}

      {/* Chat Window Mockup */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-[320px] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          <div className="bg-indigo-600 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Suporte SeArrumaAI
                </h3>
                <p className="text-[10px] text-indigo-100">Online agora</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 h-[280px] overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/50">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-600 dark:text-slate-300 font-medium">
              Olá! Eu sou a assistente virtual. Como posso te ajudar a criar as
              melhores fotos hoje? 📸
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-600 dark:text-slate-300 font-medium italic">
              Dica: Nossos pacotes de 3 e 5 fotos são os mais escolhidos para
              ensaios completos!
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <a
              href="https://wa.me/556699762785?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20tirar%20algumas%20dúvidas."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              Atendimento Humano no WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowBubble(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-90 ${
          isOpen
            ? "bg-slate-900 rotate-90"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
