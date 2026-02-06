"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import FloatingSupport from "@/components/FloatingSupport";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <Hero />

      {/* Marketing Showcase Section */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] overflow-hidden border border-indigo-100 dark:border-indigo-900/20 shadow-2xl shadow-indigo-600/5 transition-all hover:shadow-indigo-600/10">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="p-12 lg:p-20 lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  DESTAQUE
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Ensaio Aniversário <br />
                  <span className="text-indigo-600 italic">Premium</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Aproveite nosso cenário temático exclusivo para transformar
                  suas fotos em recordações profissionais de alto nível.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Garantir meu Ensaio 🎁
                </button>
              </div>
              <div className="lg:w-1/2 w-full aspect-square relative group">
                <img
                  src="/ensaio-aniversario.jpg"
                  alt="Ensaio Aniversário Criativo"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-indigo-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 border-y border-slate-100 dark:border-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center text-4xl shadow-sm rotate-3">
                📸
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Fácil de Usar
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Basta um upload e nossa IA avançada cuida de toda a reconstrução
                do cenário para você.
              </p>
            </div>

            <div className="space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center text-4xl shadow-sm -rotate-3">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Ultra Rápido
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Esqueça horas de edição. Tenha sua foto processada com qualidade
                de estúdio em poucos minutos.
              </p>
            </div>

            <div className="space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center text-4xl shadow-sm rotate-6">
                💎
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Alta Resolução
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Download em altíssima definição pronto para postar, imprimir ou
                guardar como uma recordação impecável.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Como Funciona?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Sua foto profissional em 4 passos simples
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2"></div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Escolha o Pacote",
                  desc: "Selecione quantas fotos deseja transformar hoje.",
                  icon: "💳",
                },
                {
                  step: "02",
                  title: "Faça o Upload",
                  desc: "Envie sua foto original (pode ser do celular!).",
                  icon: "📤",
                },
                {
                  step: "03",
                  title: "IA Processando",
                  desc: "Nossa IA reconstrói o cenário e iluminação.",
                  icon: "✨",
                },
                {
                  step: "04",
                  title: "Baixe sua Foto",
                  desc: "Receba o resultado no e-mail e painel em HD.",
                  icon: "📥",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-600/5 text-center group hover:border-indigo-600/30 transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 mb-2 block uppercase tracking-widest">
                    PASSO {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <button
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 group"
              >
                Começar Agora ✨
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Dúvidas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Quanto tempo demora para processar?",
                a: "O processamento médio leva entre 2 a 5 minutos, dependendo da complexidade da imagem.",
              },
              {
                q: "Posso usar fotos tiradas do celular?",
                a: "Sim! Nossa IA funciona perfeitamente com fotos de smartphone, reconstruindo o cenário em alta definição.",
              },
              {
                q: "Como recebo minhas fotos?",
                a: "Você receberá um link no seu e-mail e também poderá acessar todas as suas fotos na aba 'Galeria' do nosso site.",
              },
              {
                q: "O pagamento é seguro?",
                a: "Sim, utilizamos o Mercado Pago como gateway de pagamento, garantindo total segurança via PIX.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 underline decoration-indigo-600/30 underline-offset-4">
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">
            Não perca tempo com <br className="hidden md:block" /> edições
            complicadas.
          </h2>
          <p className="text-indigo-100 mb-10 text-lg font-medium max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já transformaram seus momentos em
            recordações impecáveis.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-12 py-5 rounded-2xl text-lg font-black text-indigo-600 bg-white hover:bg-slate-100 shadow-2xl transition-all active:scale-95"
          >
            Começar Agora ✨
          </a>
        </div>
      </section>

      <Footer />
      <FloatingSupport />
    </main>
  );
}
