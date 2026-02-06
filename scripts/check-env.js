const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Carregar .env.local manual
const envPath = path.resolve(process.cwd(), ".env.local");
const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log("--- Diagnóstico de Variáveis de Ambiente ---");

const anonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY || "NÃO ENCONTRADA";
const serviceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || "NÃO ENCONTRADA";

console.log(`ANON_KEY (Primeiros 10 chars): ${anonKey.substring(0, 10)}...`);
console.log(
  `SERVICE_KEY (Primeiros 10 chars): ${serviceKey.substring(0, 10)}...`,
);

if (anonKey === serviceKey) {
  console.error("\n[CRÍTICO] A ANON_KEY é IGUAL à SERVICE_KEY!");
  console.error("Isso causa o erro 'Forbidden use of secret API key'.");
  console.error("Você copiou a chave errada do Supabase.");
} else if (anonKey.startsWith("sb_secret")) {
  console.error(
    "\n[CRÍTICO] A ANON_KEY parece ser uma chave secreta antiga (começa com sb_secret).",
  );
  console.error("Ela deve começar com 'eyJ'.");
} else {
  console.log("\n[OK] As chaves parecem distintas e corretas (formato JWT).");
}
