import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL in use:", supabaseUrl);

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function deepDiag() {
  console.log("Checking Table 'orders'...");

  // 1. Get column names and sample data
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error accessing 'orders' table:", error);
  } else {
    console.log("Latest 5 orders found:", data?.length);
    data?.forEach((order, i) => {
      console.log(`\n--- Order ${i + 1} ---`);
      console.log(`ID: ${order.id}`);
      console.log(`Email: ${order.email}`);
      console.log(`Name: ${order.name}`);
      console.log(`Status: ${order.status}`);
      console.log(`Payment ID: ${order.payment_id}`);
      console.log(`Created At: ${order.created_at}`);
      console.log(`Receipt URL: ${order.receipt_url ? "YES" : "NO"}`);
    });
  }
}

deepDiag();
