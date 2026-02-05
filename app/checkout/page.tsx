"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const photos = searchParams.get("photos") || "3";
  const price = searchParams.get("price") || "30";
  const packageName = searchParams.get("name") || "Pacote 3 Fotos";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          photos: parseInt(photos),
          price: parseFloat(price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      if (data.checkoutUrl) {
        // Redireciona para o Mercado Pago
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Form Side */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-600/5 border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Identificação
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">
          Preencha seus dados para receber o acesso após o pagamento.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Nome Completo
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all dark:text-white"
                placeholder="Como devemos te chamar?"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              E-mail
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all dark:text-white"
                placeholder="Onde enviaremos suas fotos?"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs font-bold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-600/25 text-base font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              "Processando..."
            ) : (
              <span className="flex items-center gap-2">
                Pagar com PIX <ArrowRight size={20} />
              </span>
            )}
          </button>

          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="text-emerald-500" size={24} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Seguro
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="text-amber-500" size={24} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Instantâneo
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center max-w-[250px]">
              Ao clicar em pagar, você será redirecionado para o ambiente seguro
              do Mercado Pago.
            </p>
          </div>
        </form>
      </div>

      {/* Summary Side */}
      <div className="space-y-8">
        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[60px]"></div>

          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <CheckCircle2 size={24} /> Resumo do Pedido
          </h3>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center pb-6 border-b border-white/10">
              <div>
                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-1">
                  Produto
                </p>
                <p className="text-2xl font-black">{packageName}</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-1">
                  Fotos
                </p>
                <p className="text-2xl font-black">{photos}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-indigo-100 text-lg font-bold">Total a pagar</p>
              <p className="text-4xl font-black tracking-tight">R$ {price}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800/50">
          <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">
            O que você recebe:
          </h4>
          <ul className="space-y-4">
            {[
              "Processamento imediato com IA",
              "Qualidade profissional de estúdio",
              "Download em alta resolução",
              "Acesso vitalício ao dashboard",
              "Suporte especializado",
            ].map((text, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] text-indigo-600 dark:text-indigo-400">
                  ✓
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:rotate-6 transition-transform">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              SeArrumaAI
            </span>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-20 animate-pulse text-indigo-600 font-bold text-xl uppercase tracking-widest">
              Carregando Checkout...
            </div>
          }
        >
          <CheckoutForm />
        </Suspense>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2024 SeArrumaAI - Pagamento processado pelo Mercado Pago
          </p>
        </div>
      </div>
    </div>
  );
}
