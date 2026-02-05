import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <Hero />

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

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
            Pronto para ver a mágica acontecer?
          </h2>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-10 py-4 rounded-2xl text-lg font-bold text-indigo-600 bg-white hover:bg-slate-100 shadow-xl transition-all active:scale-95"
          >
            Escolher meu Pacote
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
