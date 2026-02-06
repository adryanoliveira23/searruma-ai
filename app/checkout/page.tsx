"use client";

import { useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Upload,
  X,
  Loader2,
  Phone,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = searchParams.get("photos") || "3";
  const price = searchParams.get("price") || "30";
  const packageName = searchParams.get("name") || "Pacote 3 Fotos";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    qrcode: string;
    qrcode_base64: string;
    paymentId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 10MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("user-images")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error("Erro ao subir imagem: " + uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("user-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleCopyPix = () => {
    if (pixData?.qrcode) {
      navigator.clipboard.writeText(pixData.qrcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkPaymentStatus = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("status")
        .eq("payment_id", id)
        .single();

      if (data?.status === "approved") {
        window.location.href = "/dashboard?payment=success";
      }
    } catch (err) {
      console.error("Error checking status:", err);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("O comprovante deve ter no máximo 10MB");
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSendReceipt = async () => {
    if (!receiptFile || !pixData) return;

    setReceiptUploading(true);
    setError(null);

    try {
      // 1. Upload do comprovante
      const receiptUrl = await uploadImage(receiptFile);

      // 2. Avisar API
      const response = await fetch("/api/upload-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: pixData.paymentId,
          receiptUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao enviar comprovante");
      }

      setReceiptSent(true);
      setReceiptFile(null);
      setReceiptPreview(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao enviar comprovante",
      );
    } finally {
      setReceiptUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setError("Por favor, selecione uma foto para processar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload da imagem
      setUploading(true);
      const imageUrl = await uploadImage(imageFile);
      setUploading(false);

      // 2. Criar pagamento
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          whatsapp,
          photos: parseInt(photos),
          price: parseFloat(price),
          imageUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      const data = await response.json();

      if (data.pix) {
        setPixData({
          qrcode: data.pix.qrcode,
          qrcode_base64: data.pix.qrcode_base64,
          paymentId: data.paymentId,
        });

        // Iniciar polling
        const interval = setInterval(() => {
          checkPaymentStatus(data.paymentId);
        }, 5000);

        // Limpar interval após 10 minutos ou redirecionamento
        setTimeout(() => clearInterval(interval), 600000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Form Side */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-600/5 border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Sua Identificação
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">
          Preencha seus dados e escolha a foto que deseja transformar.
        </p>

        {pixData ? (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl inline-block mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Pagamento PIX Gerado!
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Escaneie o QR Code abaixo ou copie o código para pagar no seu
                banco.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 mx-auto max-w-[280px]">
              <img
                src={`data:image/jpeg;base64,${pixData.qrcode_base64}`}
                alt="QR Code PIX"
                className="w-full aspect-square"
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl break-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  CÓDIGO PIX (COPIA E COLA)
                </p>
                <p className="text-xs font-mono dark:text-white line-clamp-2">
                  {pixData.qrcode}
                </p>
              </div>

              <button
                onClick={handleCopyPix}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  copied
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={18} /> COPIADO COM SUCESSO!
                  </>
                ) : (
                  <>
                    <Zap size={18} /> COPIAR CÓDIGO PIX
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl">
              <Loader2 className="animate-spin text-amber-500" size={20} />
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Aguardando confirmação do pagamento...
              </p>
            </div>

            {/* Receipt Upload Section */}
            {!receiptSent ? (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-center text-sm font-black text-slate-900 dark:text-white">
                  Já pagou? Envie seu comprovante aqui:
                </p>
                <div
                  onClick={() =>
                    !receiptPreview && receiptInputRef.current?.click()
                  }
                  className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer group flex flex-col items-center justify-center text-center ${
                    receiptPreview
                      ? "border-emerald-500/50 bg-emerald-50/10"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-600/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <input
                    type="file"
                    ref={receiptInputRef}
                    onChange={handleReceiptChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {receiptPreview ? (
                    <div className="relative w-full max-w-[150px] mx-auto">
                      <img
                        src={receiptPreview}
                        alt="Comprovante"
                        className="w-full aspect-square object-cover rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReceiptFile(null);
                          setReceiptPreview(null);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={20} className="text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-500">
                        Selecionar Comprovante
                      </p>
                    </>
                  )}
                </div>

                {receiptFile && (
                  <button
                    onClick={handleSendReceipt}
                    disabled={receiptUploading}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-xs shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {receiptUploading ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />{" "}
                        ENVIANDO...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} /> ENVIAR COMPROVANTE
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl text-center space-y-2 animate-in fade-in zoom-in">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-400">
                  Comprovante Recebido!
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-500 font-medium">
                  Nossa equipe irá confirmar seu pagamento em breve e você
                  receberá o resultado por e-mail e no dashboard.
                </p>
              </div>
            )}

            <p className="text-center text-[11px] text-slate-400">
              Assim que o pagamento for confirmado, você será redirecionado
              automaticamente para o processamento das fotos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nome Completo
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all dark:text-white text-sm"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  E-mail
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all dark:text-white text-sm"
                    placeholder="Seu melhor e-mail"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                WhatsApp (Número de Telefone)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all dark:text-white text-sm"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Sua Foto Principal
              </label>
              <div
                onClick={() => !imagePreview && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center text-center ${
                  imagePreview
                    ? "border-emerald-500/50 bg-emerald-50/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-600/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative w-full">
                    <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden shadow-xl ring-4 ring-emerald-500/20">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="mt-4 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center gap-1">
                      <CheckCircle2 size={14} /> FOTO SELECIONADA
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Toque para selecionar sua foto
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Formatos suportados: JPG, PNG (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full relative group overflow-hidden flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-600/25 text-base font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  {uploading ? "Subindo Foto..." : "Processando..."}
                </span>
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
                Escaneie o QR Code ou copie a chave PIX para finalizar.
              </p>
            </div>
          </form>
        )}
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

        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-4xl p-8 border border-slate-100 dark:border-slate-800/50">
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
