"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Loader2,
  Download,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function GalleryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Erro ao buscar suas fotos. Verifique o e-mail informado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:rotate-6 transition-transform">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              SeArrumaAI
            </span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white text-center mb-4">
            Suas Fotos Processadas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl font-medium">
            Digite seu e-mail abaixo para encontrar todas as fotos que você já
            gerou conosco.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-12 pr-32 py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-indigo-600/5 focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all dark:text-white"
              placeholder="Digite seu e-mail aqui..."
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Buscar"
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {orders.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-600/5 group hover:border-indigo-600/30 transition-all"
                  >
                    <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {order.result_url ? (
                        <img
                          src={order.result_url}
                          alt="Resultado"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                          <ImageIcon size={48} className="opacity-20" />
                          <p className="text-xs font-bold uppercase tracking-widest px-4 text-center">
                            {order.status === "approved"
                              ? "Processando Imagem..."
                              : "Pagamento Pendente"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            DATA DO PEDIDO
                          </p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {new Date(order.created_at).toLocaleDateString(
                              "pt-BR",
                            )}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === "completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {order.status === "completed" ? "Pronto" : "Em fila"}
                        </div>
                      </div>

                      {order.result_url && (
                        <a
                          href={order.result_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                          <Download size={18} /> Baixar Imagem
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-4xl border border-dashed border-slate-200 dark:border-slate-800">
                <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Nenhuma foto encontrada
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Não encontramos nenhum pedido associado ao e-mail {email}.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
