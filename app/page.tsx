'use client' // This tells Next.js this page interacts with the user
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase (Use your own URL/KEY from your project settings!)
const supabase = createClient('https://supabase.com/dashboard/project/qyopevrsgdidmvnjhdxs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5b3BldnJzZ2RpZG12bmpoZHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQ0MDAsImV4cCI6MjA5ODI5MDQwMH0.9r1YOjgGV4Kp6QrNKdTjfALoaZ2L56QUcL74PSvGQ_U')

export default function Home() {
  const [quotes, setQuotes] = useState([])
  const [text, setText] = useState('')

  // 1. Load quotes when the page opens
  useEffect(() => {
    fetchQuotes()
  }, [])

  async function fetchQuotes() {
    const { data } = await supabase.from('quotes').select('*')
    setQuotes(data || [])
  }

  // 2. Add a new quote
  async function addQuote() {
    await supabase.from('quotes').insert([{ quote_text: text }])
    setText('') // clear input
    fetchQuotes() // refresh list
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Friend Quotes</h1>
      
      {/* The Input Form */}
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter a quote..." 
      />
      <button onClick={addQuote}>Add Quote</button>

      {/* The List */}
      <ul>
        {quotes.map((q) => (
          <li key={q.id}>{q.quote_text}</li>
        ))}
      </ul>
    </main>
  )
}