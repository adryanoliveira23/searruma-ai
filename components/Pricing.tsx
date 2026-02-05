"use client";

import { useRouter } from "next/navigation";

const packages = [
  {
    name: "1 Foto",
    price: "10",
    photos: 1,
    features: [
      "1 foto de alta qualidade",
      "Processamento rápido",
      "Download digital",
      "Cenário de aniversário",
    ],
    popular: false,
  },
  {
    name: "3 Fotos",
    price: "30",
    photos: 3,
    features: [
      "3 fotos de alta qualidade",
      "Processamento rápido",
      "Vários ângulos",
      "Cenários exclusivos",
    ],
    popular: true,
  },
  {
    name: "5 Fotos",
    price: "50",
    photos: 5,
    features: [
      "5 fotos de alta qualidade",
      "Máxima prioridade",
      "Cenários profissionais",
      "Download em HD",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const router = useRouter();

  const handlePurchase = (pkg: (typeof packages)[0]) => {
    const params = new URLSearchParams({
      photos: pkg.photos.toString(),
      price: pkg.price,
      name: pkg.name,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Escolha seu Pacote
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Selecione a quantidade de fotos que deseja transformar e veja a
            mágica acontecer. Sem assinaturas, pague apenas pelo que usar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border transition-all duration-300 ${
                pkg.popular
                  ? "border-indigo-600 shadow-2xl shadow-indigo-600/10 scale-105 z-10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black tracking-widest py-1.5 px-4 rounded-full">
                  RECOMENDADO
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
                    R$ {pkg.price}
                  </span>
                  <span className="text-slate-400 text-sm font-bold uppercase tracking-widest ml-1">
                    Único
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 grow">
                {pkg.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] text-indigo-600 dark:text-indigo-400 shrink-0">
                      ✓
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(pkg)}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                  pkg.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
                    : "bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700"
                }`}
              >
                Comprar Pacote
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
