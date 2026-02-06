import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

// SIMULATE PUBLIC CLIENT (non-role)
const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

async function testPublicRead() {
  console.log("Testing Public Read Access (Anon Key)...");

  const { data, error } = await supabasePublic
    .from("orders")
    .select("*")
    .limit(5);

  if (error) {
    console.error("Public Read Error:", error);
    console.log("This usually means RLS is blocking the query.");
  } else {
    console.log(
      "Public Read Success! Found",
      data?.length,
      "orders visible to public.",
    );
    if (data && data.length > 0) {
      console.log("Sample Data Record ID:", data[0].id);
    } else {
      console.log(
        "Query returned empty list. RLS might be active but allowing nothing.",
      );
    }
  }
}

testPublicRead();
