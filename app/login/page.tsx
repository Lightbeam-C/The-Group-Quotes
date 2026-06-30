'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient('https://qyopevrsgdidmvnjhdxs.supabase.co/rest/v1/', supabaseKey)
interface Quote {
  id: number;
  quote_text: string;
}

export default function Home() {

  const [quotes, setQuotes] = useState<Quote[]>([]); 
  async function fetchQuotes() {
    const { data } = await supabase.from('quotes').select('*');
    setQuotes((data as Quote[]) || []);
  }
  const [text, setText] = useState('')

  useEffect(() => {
    fetchQuotes()
  }, [])


  async function addQuote() {
    await supabase.from('quotes').insert([{ quote_text: text }])
    setText('') // clear input
    fetchQuotes() // refresh list
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Login Page</h1>
      
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