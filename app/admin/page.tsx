"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Lock,
  Search,
  Filter,
} from "lucide-react";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "orders">(
    "overview",
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Adiel&Adryan2026@!") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha administrativa incorreta.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-xl shadow-slate-900/20">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Admin Focus
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Acesso exclusivo para administradores
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Senha Mestra
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-slate-600/5 focus:border-slate-900 outline-none transition-all"
                placeholder="Introduza a chave mestre"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs font-bold text-center">
                {error}
              </p>
            )}
            <button className="w-full py-4 rounded-2xl font-black text-white bg-slate-900 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
              Desbloquear Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
            AD
          </div>
          <span className="font-black text-lg text-slate-900 tracking-tight">
            Admin Panel
          </span>
        </div>

        <nav className="flex-grow space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "overview" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <LayoutDashboard size={20} /> Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "users" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Users size={20} /> Usuários
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "orders" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <CreditCard size={20} /> Pedidos/Logística
          </button>
        </nav>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} /> Sair
        </button>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight">
              {activeTab === "overview" ? "Dashboard Admin" : activeTab}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Gerencie a plataforma em tempo real.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 transition-all font-medium"
              />
            </div>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Vendas Totais",
                value: "R$ 12.450",
                icon: "💰",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                label: "Usuários Ativos",
                value: "842",
                icon: "👤",
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Fotos Processadas",
                value: "2.103",
                icon: "⚡",
                color: "bg-amber-50 text-amber-600",
              },
              {
                label: "Taxa de Conversão",
                value: "4.2%",
                icon: "📈",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-4`}
                >
                  {stat.icon}
                </div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab content placeholders */}
        {(activeTab === "users" || activeTab === "orders") && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                    Data
                  </th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest text-right">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr
                    key={item}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      #{1000 + item}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Cliente {item}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            cliente{item}@exemplo.com
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full">
                        ATIVO
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      05 Fev, 2026
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 font-bold text-sm hover:underline">
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
