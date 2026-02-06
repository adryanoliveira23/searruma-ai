import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testOrder() {
  const testEmail = "test@example.com";
  console.log(`Simulating order for ${testEmail}...`);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .upsert(
      [
        {
          email: testEmail,
          name: "Cliente Teste",
          whatsapp: "11999999999",
          photos: 3,
          amount: "30",
          status: "approved",
          payment_id: "TEST-" + Date.now(),
          image_url: "https://via.placeholder.com/800x800?text=Original",
          result_url:
            "https://via.placeholder.com/1024x1024/667eea/ffffff?text=Resultado+Gemini",
          created_at: new Date().toISOString(),
        },
      ],
      { onConflict: "payment_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Order created/updated successfully:", data.id);
  }
}

testOrder();
