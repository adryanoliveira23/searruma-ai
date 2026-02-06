import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("--- Teste de Conexão Anon Key ---");
console.log("URL:", supabaseUrl);
console.log("Key (start):", supabaseAnonKey?.substring(0, 10));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltando credenciais.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const { data, error } = await supabase
    .from("orders")
    .select("count")
    .limit(1);

  if (error) {
    console.error("\n[FALHA] Erro ao conectar com Anon Key:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    if (error.code === "PGRST301" || error.message.includes("JWT")) {
      console.error(">> ISSO CONFIRMA QUE A CHAVE É INVÁLIDA ou EXPIRADA.");
    }
  } else {
    console.log("\n[SUCESSO] Conexão estabelecida! RLS permitiu leitura.");
    console.log("Data:", data);
  }
}

testConnection();
