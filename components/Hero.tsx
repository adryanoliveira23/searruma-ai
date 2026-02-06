import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Transforme suas fotos em <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-amber-500 whitespace-nowrap lg:whitespace-normal">
                  Momentos Mágicos
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Crie fotos profissionais de aniversário com qualidade de estúdio
              em segundos. Nossa IA avançada preserva sua essência enquanto
              reconstrói o cenário perfeito.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-95"
              >
                Começar Agora
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Ver Como Funciona
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-6 text-sm text-slate-500 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                    src={`https://i.pravatar.cc/100?u=${i + 10}`}
                    alt="User"
                  />
                ))}
              </div>
              <p>+1.000 pessoas já transformaram suas fotos</p>
            </div>
          </div>

          <div className="lg:col-span-5 mt-16 lg:mt-0 relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-3xl opacity-20 rotate-6"></div>
            <div className="relative glass p-4 rounded-3xl shadow-2xl transition-transform hover:scale-[1.02] duration-500">
              <img
                src="https://img.freepik.com/fotos-premium/mulher-positiva-comemorando-aniversario-vestida-com-um-elegante-vestido-de-penas-soprando-vela-no-bolo-de-aniversario-em-torno-de-baloes-inflados-em-casa_121837-9889.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Mulher comemorando aniversário"
                className="rounded-2xl w-full shadow-inner object-cover aspect-[4/5]"
              />

              {/* Floating feature card */}
              <div
                className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100 dark:border-slate-700 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-2xl">
                  ✨
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    Qualidade Estúdio
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Processado em 3min
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
