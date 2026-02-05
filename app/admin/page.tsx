"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CreditCard,
  LogOut,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: number;
  email: string;
  name: string;
  photos: number;
  amount: string;
  status: string;
  payment_id: string;
  image_url: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "orders">(
    "overview",
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Adiel&Adryan2026@!") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Senha administrativa incorreta.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.payment_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    totalSales: orders
      .filter((o) => o.status === "approved")
      .reduce((acc, o) => acc + parseFloat(o.amount || "0"), 0),
    activeUsers: new Set(orders.map((o) => o.email)).size,
    processedPhotos: orders
      .filter((o) => o.status === "approved")
      .reduce((acc, o) => acc + o.photos, 0),
    conversionRate:
      orders.length > 0
        ? (
            (orders.filter((o) => o.status === "approved").length /
              orders.length) *
            100
          ).toFixed(1)
        : 0,
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
                className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-slate-600/5 focus:border-slate-900 outline-none transition-all dark:text-slate-900"
                placeholder="Introduza a chave mestre"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-xs font-bold text-center">
                {loginError}
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

        <nav className="grow space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "overview" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <LayoutDashboard size={20} /> Visão Geral
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
      <main className="grow p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight">
              {activeTab === "overview"
                ? "Dashboard Admin"
                : "Pedidos e Logística"}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente ou e-mail..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 transition-all font-medium dark:text-slate-900"
              />
            </div>
            <button
              onClick={fetchOrders}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
            >
              <Clock size={16} />
            </button>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Vendas Totais",
                value: `R$ ${stats.totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                icon: "💰",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                label: "Identificações",
                value: stats.activeUsers.toString(),
                icon: "👤",
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Fotos Solicitadas",
                value: stats.processedPhotos.toString(),
                icon: "⚡",
                color: "bg-amber-50 text-amber-600",
              },
              {
                label: "Taxa de Pagos",
                value: `${stats.conversionRate}%`,
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
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                      Foto Original
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 tracking-widest">
                      Pacote
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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse"
                      >
                        Carregando pedidos...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest"
                      >
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                              {order.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {order.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {order.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {order.image_url ? (
                            <a
                              href={order.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative block w-12 h-12 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-600 transition-all group-hover:scale-105"
                            >
                              <img
                                src={order.image_url}
                                alt="Original"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ExternalLink
                                  size={12}
                                  className="text-white"
                                />
                              </div>
                            </a>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                              <AlertCircle size={14} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-[10px] font-black rounded-full ${
                              order.status === "approved"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status === "approved"
                              ? "PAGO"
                              : order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">
                            {order.photos} Fotos
                          </p>
                          <p className="text-[10px] text-slate-400">
                            R$ {order.amount}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(order.created_at).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
