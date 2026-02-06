import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkColumns() {
  console.log("Checking columns of 'orders' table...");

  const testRecord = {
    email: "diag_" + Date.now() + "@test.com",
    name: "Diag Order",
    status: "pending",
    payment_id: "DIAG_" + Date.now(),
    receipt_url: "https://test.com/receipt.jpg",
  };

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([testRecord])
    .select();

  if (error) {
    console.log("--- ERROR DETECTED ---");
    console.log("Code:", error.code);
    console.log("Message:", error.message);
    console.log("Details:", error.details);
    console.log("Hint:", error.hint);
  } else {
    console.log("SUCCESS: Insert worked perfectly.");
  }
}

checkColumns();
