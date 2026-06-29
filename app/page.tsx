'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient('https://supabase.com/dashboard/project/qyopevrsgdidmvnjhdxs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5b3BldnJzZ2RpZG12bmpoZHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MTQ0MDAsImV4cCI6MjA5ODI5MDQwMH0.9r1YOjgGV4Kp6QrNKdTjfALoaZ2L56QUcL74PSvGQ_U')

interface Quote {
  id: number;
  quote_text: string;
}

export default function Home() {
  
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession()
    
      if (!data.session) {
        router.push('/login')
      } else {
        setLoading(false )
      } 
    }
    checkUser()
  }, [router])
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