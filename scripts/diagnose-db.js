import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabase() {
  console.log("Testing Database Connection...");

  // 1. Try to read
  const { data: readData, error: readError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .limit(1);

  if (readError) {
    console.error("Read Error:", readError);
  } else {
    console.log("Read Success! Found", readData?.length, "orders.");
  }

  // 2. Try to insert
  const testOrder = {
    email: "test_diag@example.com",
    name: "Diag Test",
    whatsapp: "123456789",
    photos: 1,
    amount: "10",
    status: "pending",
    payment_id: "DIAG-" + Date.now(),
    created_at: new Date().toISOString(),
  };

  console.log("Attempting to insert test order:", testOrder);
  const { data: insertData, error: insertError } = await supabaseAdmin
    .from("orders")
    .insert([testOrder])
    .select();

  if (insertError) {
    console.error("Insert Error:", insertError);
  } else {
    console.log("Insert Success! New Order ID:", insertData?.[0]?.id);
  }
}

testDatabase();
