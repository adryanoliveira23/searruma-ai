import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing URL or KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log("Buckets:", JSON.stringify(data, null, 2));

    // Check if 'user-images' exists
    const exists = data.some((b) => b.name === "user-images");
    if (exists) {
      console.log("Bucket 'user-images' found.");
    } else {
      console.log("Bucket 'user-images' NOT found.");
      // Try to create it?
      // const { data: bucket, error: createError } = await supabase.storage.createBucket('user-images', { public: true });
      // if (createError) console.error('Error creating bucket:', createError);
      // else console.log('Created bucket:', bucket);
    }
  }
}

listBuckets();
