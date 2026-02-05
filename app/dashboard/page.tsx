"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Image as ImageIcon,
  Sparkles,
  Download,
  Trash2,
  Settings,
  History,
  HelpCircle,
  Menu,
  X,
  CreditCard,
  User,
  LogOut,
  ChevronRight,
  Maximize2,
  Mail,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RedesignedDashboard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage || !email) {
      alert("Por favor, selecione uma imagem e informe seu email.");
      return;
    }
    setProcessing(true);
    setResult(null);
    try {
      const response = await fetch("/api/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage.split(",")[1],
          email: email,
          name: "Usuário",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.resultImage);
      } else {
        alert("Erro ao processar: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erro na requisição");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#020617] overflow-hidden">
      {/* Sidebar - Professional Style */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Sparkles size={20} fill="white" />
              </div>
              <span className="font-black text-xl tracking-tight dark:text-white">
                SeArrumaAI
              </span>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 mb-10"
            >
              <Plus size={18} /> Novo Projeto
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <nav className="space-y-1">
              {[
                {
                  name: "Meus Projetos",
                  icon: <ImageIcon size={20} />,
                  active: true,
                },
                {
                  name: "Histórico",
                  icon: <History size={20} />,
                  active: false,
                },
                {
                  name: "Minhas Compras",
                  icon: <CreditCard size={20} />,
                  active: false,
                },
                { name: "Conta", icon: <User size={20} />, active: false },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <User size={20} />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold dark:text-white">Meu Perfil</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  Acesso Ativo
                </p>
              </div>
              <LogOut
                size={18}
                className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Workspace Area */}
      <main className="flex-grow flex flex-col relative">
        {/* Top bar */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
            >
              <Menu size={20} className="dark:text-white" />
            </button>
            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase opacity-40">
              Studio / Aniversário
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700">
              <History size={14} /> Histórico
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-grow relative flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
          <div className="absolute inset-0 bg-[#F1F5F9] dark:bg-[#020617] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="relative w-full max-w-5xl aspect-video lg:aspect-[16/10] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden w-full h-full relative group">
              {result ? (
                <img
                  src={result}
                  alt="Result"
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : selectedImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className={`w-full h-full object-cover transition-all duration-1000 ${processing ? "blur-2xl brightness-50 scale-110" : ""}`}
                  />
                  {processing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
                      <div className="w-24 h-24 relative mb-8">
                        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl">
                          ✨
                        </div>
                      </div>
                      <h3 className="text-3xl font-black mb-4 tracking-tight">
                        Criando sua obra de arte...
                      </h3>
                      <p className="text-white/70 font-medium max-w-sm">
                        Nossa IA está reconstruindo o cenário em alta definição.
                      </p>

                      <div className="w-full max-w-xs h-1.5 bg-white/20 rounded-full mt-10 overflow-hidden text-left">
                        <div className="h-full bg-indigo-500 animate-[progress_60s_ease-out_forwards]"></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-6xl mb-8 shadow-inner">
                    🎨
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                    Área de Criação
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 max-w-xs font-medium">
                    Faça o upload da sua foto para começar a mágica.
                  </p>
                </div>
              )}

              {/* Floating Action Buttons */}
              {result && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <a
                    href={result}
                    download
                    className="flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all text-sm font-black text-slate-900 border border-slate-100"
                  >
                    <Download size={20} /> Download HD
                  </a>
                  <button
                    onClick={() => setResult(null)}
                    className="flex items-center gap-3 bg-slate-900 px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all text-sm font-black text-white"
                  >
                    <Trash2 size={20} /> Limpar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation / Prompt Bar - Firefly Style */}
        <div className="p-8 pt-0">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-grow relative w-full">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email para envio do resultado final..."
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl outline-none font-bold dark:text-white border border-transparent focus:border-indigo-600/30 transition-all"
                />
              </div>
              <button
                onClick={handleProcess}
                disabled={processing || !selectedImage}
                className="w-full md:w-auto bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3 group"
              >
                Gerar Foto Mágica{" "}
                <Sparkles size={18} className="group-hover:animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 98%;
          }
        }
      `}</style>
    </div>
  );
}
