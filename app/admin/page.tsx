"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CreditCard,
  LogOut,
  Lock,
  Search,
  ExternalLink,
  AlertCircle,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock,
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
  receipt_url: string | null;
  whatsapp: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "orders" | "generator"
  >("overview");
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

  const handleApprovePayment = async (orderId: number) => {
    if (!confirm("Confirmar que o pagamento foi recebido?")) return;

    try {
      const response = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "approved" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao aprovar pagamento");
      }

      // Atualizar localmente
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: "approved" } : o,
        ),
      );
    } catch (err) {
      console.error("Error approving:", err);
      alert(err instanceof Error ? err.message : "Erro ao aprovar");
    }
  };

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
          <button
            onClick={() => setActiveTab("generator")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "generator" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Sparkles size={20} /> Gerador Gratuito
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
                : activeTab === "generator"
                  ? "Gerador IA"
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
        {activeTab === "generator" && <AdminGenerator />}
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
                      Fotos (Original / Comprovante)
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
                              {order.whatsapp && (
                                <p className="text-[10px] text-emerald-600 font-bold">
                                  WA: {order.whatsapp}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {order.image_url ? (
                              <a
                                href={order.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative block w-12 h-12 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-600 transition-all group-hover:scale-105"
                                title="Foto Original"
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

                            {order.receipt_url ? (
                              <a
                                href={order.receipt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative block w-12 h-12 rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50 hover:ring-2 hover:ring-emerald-600 transition-all group-hover:scale-105"
                                title="Ver Comprovante"
                              >
                                <img
                                  src={order.receipt_url}
                                  alt="Comprovante"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-emerald-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <CreditCard
                                    size={12}
                                    className="text-white"
                                  />
                                </div>
                              </a>
                            ) : (
                              <div
                                className="w-12 h-12 rounded-lg bg-amber-50 border border-dashed border-amber-200 flex flex-col items-center justify-center text-amber-400"
                                title="Sem Comprovante"
                              >
                                <CreditCard size={14} />
                                <span className="text-[8px] font-black">
                                  N/A
                                </span>
                              </div>
                            )}
                          </div>
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
                          {order.status === "pending" &&
                            new Date().getTime() -
                              new Date(order.created_at).getTime() >
                              3600000 && (
                              <span className="block mt-1 text-[9px] font-black text-red-500 animate-pulse">
                                PIX ABANDONADO (&gt;1H)
                              </span>
                            )}
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
                        <td className="px-6 py-4 text-right space-x-2">
                          {order.status !== "approved" && (
                            <button
                              onClick={() => handleApprovePayment(order.id)}
                              className="inline-flex p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                              title="Aprovar Pagamento"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          {order.whatsapp && (
                            <a
                              href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${order.name}, vimos que você gerou um Pix para o SeArrumaAI mas não finalizou o pagamento. Podemos te ajudar em algo?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                              title="Contato WhatsApp"
                            >
                              <MessageCircle size={18} />
                            </a>
                          )}
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

function AdminGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return alert("Selecione uma imagem");
    if (!email)
      return alert("Informe o e-mail do cliente para envio do resultado");

    setProcessing(true);
    setResult(null);
    try {
      const response = await fetch("/api/process-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: image.split(",")[1],
          email: email,
          name: "Admin",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.resultImage);
      } else {
        alert("Erro: " + data.error);
      }
    } catch (err) {
      console.error("Erro na geração:", err);
      alert("Erro na geração");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-xl font-black text-slate-900 mb-6">Configuração</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Foto Original
            </label>
            <div
              onClick={() => document.getElementById("admin-upload")?.click()}
              className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden p-2"
            >
              {image ? (
                <img
                  src={image}
                  className="w-full h-full object-cover rounded-2xl"
                  alt="Original"
                />
              ) : (
                <div className="text-center p-6">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Clique para Upload
                  </p>
                </div>
              )}
            </div>
            <input
              id="admin-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Email do Cliente (Opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all text-slate-900"
              placeholder="cliente@email.com"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!image || processing}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Processando...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Gerar Agora
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col">
        <h3 className="text-xl font-black text-slate-900 mb-6">Resultado</h3>
        <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden relative min-h-[400px]">
          {result ? (
            <div className="relative w-full h-full group">
              <img
                src={result}
                className="w-full h-full object-cover"
                alt="Resultado"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
                <a
                  href={result}
                  download
                  className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs hover:scale-105 transition-transform"
                >
                  Download HD
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4 grayscale opacity-50">✨</div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Aguardando Geração
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
