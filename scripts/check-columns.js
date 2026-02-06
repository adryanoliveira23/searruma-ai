import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkColumns() {
  console.log("Checking columns of 'orders' table...");

  // Try to insert a record with ALL new fields to see if it fails
  const { error } = await supabaseAdmin.from("orders").insert([
    {
      email: "col_test@example.com",
      receipt_url: "https://test.com/receipt.jpg",
    },
  ]);

  if (error) {
    console.log("Insert failed. Error code:", error.code);
    console.log("Error message:", error.message);
    if (
      error.message.includes(
        'column "receipt_url" of relation "orders" does not exist',
      )
    ) {
      console.log("CONFIRMED: Column 'receipt_url' is missing!");
    }
  } else {
    console.log("Insert succeeded. Column 'receipt_url' exists.");
  }
}

checkColumns();
