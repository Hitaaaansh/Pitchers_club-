import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://wvbklltzmjjupcqkypgg.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_kF1L9n4ecKaubAH84fdKpw_w89g6csi";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("\n--- Testing team select ---");
  const { data, error } = await supabase.from("team").select("*");
  if (error) {
    console.error("Select error:", error);
  } else {
    console.log("Select success! Total team members:", data.length);
    console.log("Sample data:", data[0]);
  }

  console.log("\n--- Testing team insert (as anon, should fail if not authenticated) ---");
  const { data: insData, error: insError } = await supabase
    .from("team")
    .insert({
      name: "Test Member",
      role: "Developer",
      domain: "Technical",
      year: "Second Year",
      bio: "Just a test bio",
      tier: "Core team",
    })
    .select();

  if (insError) {
    console.error("Insert error:", insError);
  } else {
    console.log("Insert success! Data:", insData);
  }
}

test().catch(console.error);
