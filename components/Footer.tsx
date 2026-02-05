export default function Footer() {
  return (
    <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600 mb-2">
              SeArrumaAI
            </h3>
            <p className="text-sm text-slate-500">
              © 2026 SeArrumaAI. Transformando fotos com amor e IA.
            </p>
          </div>

          <div className="flex gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Termos
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
