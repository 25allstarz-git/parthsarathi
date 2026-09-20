import { createClient } from "@supabase/supabase-js";
import { embedText } from "../src/lib/ai.server";

// Assuming SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are in .env
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

// We use the service role key if available for admin access, otherwise we fallback to anon.
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function run() {
  console.log("Starting precedents backfill...");
  const { data: precedents, error } = await supabase.from("precedents").select("id, title, citation, holding, category").is("embedding", null);

  if (error) {
    console.error("Error fetching precedents:", error);
    process.exit(1);
  }

  if (!precedents || precedents.length === 0) {
    console.log("No precedents need backfilling.");
    process.exit(0);
  }

  console.log(`Found ${precedents.length} precedents to backfill.`);

  for (const precedent of precedents) {
    const text = `${precedent.title} ${precedent.citation} ${precedent.holding} ${precedent.category}`;
    try {
      const embedding = await embedText(text);
      if (embedding && embedding.length === 768) {
        const { error: updateError } = await supabase
          .from("precedents")
          .update({ embedding: `[${embedding.join(",")}]` }) // Postgres vector format
          .eq("id", precedent.id);
        
        if (updateError) {
          console.error(`Failed to update precedent ${precedent.id}:`, updateError);
        } else {
          console.log(`Backfilled precedent ${precedent.id}`);
        }
      } else {
        console.warn(`Invalid embedding generated for precedent ${precedent.id}. Length: ${embedding?.length}`);
      }
    } catch (e) {
      console.error(`Error embedding precedent ${precedent.id}:`, e);
    }
  }

  console.log("Backfill complete.");
}

run();
