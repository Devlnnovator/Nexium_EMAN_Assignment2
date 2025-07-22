// app/api/summarise/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function saveToSupabase(summary: string, translated: string) {
  await supabase.from('summaries').insert([{ summary, translated }])
}
