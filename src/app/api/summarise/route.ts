import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { translateToUrdu } from './translate'
import { saveToSupabase } from './supabase'
import { saveToMongo } from './mongo'

export async function POST(req: Request) {
  try {
    // ✅ Step 1: Read blog URL sent from frontend
    const { url } = await req.json()
    console.log('✅ Step 1: URL received:', url)

    // ✅ Step 2: Fetch the blog HTML
    const html = await fetch(url).then(res => res.text())
    console.log('✅ Step 2: HTML fetched')

    // ✅ Step 3: Extract text from <p> tags using cheerio
    const $ = cheerio.load(html)
    const text = $('p').text()
    console.log('✅ Step 3: Text extracted (first 100 chars):', text.slice(0, 100))

    // ✅ Step 4: Create fake summary (first 300 chars)
    const summary = text.slice(0, 300) + '...'

    // ✅ Step 5: Translate summary to Urdu
    let translated
    try {
      translated = await translateToUrdu(summary)
    } catch (err) {
      console.error('❌ ERROR in translateToUrdu:', err)
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
    }
    console.log('✅ Step 4: Summary and Urdu translation created', { summary, translated })

    // ✅ Step 6: Save to Supabase
    try {
      await saveToSupabase(summary, translated)
    } catch (err) {
      console.error('❌ ERROR in saveToSupabase:', err)
      return NextResponse.json({ error: 'Supabase save failed' }, { status: 500 })
    }
    console.log('✅ Step 5: Saved to Supabase')

    // ✅ Step 7: Save full text to MongoDB
    try {
      await saveToMongo(text)
    } catch (err) {
      console.error('❌ ERROR in saveToMongo:', err)
      return NextResponse.json({ error: 'MongoDB save failed' }, { status: 500 })
    }
    console.log('✅ Step 6: Saved to MongoDB')

    // ✅ Step 8: Send back data to frontend
    return NextResponse.json({ summary, translated })

  } catch (error) {
    console.error('❌ ERROR:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
