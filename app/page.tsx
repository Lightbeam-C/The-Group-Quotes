'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { Plus, House, TextAlignStart } from 'lucide-react'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient('https://qyopevrsgdidmvnjhdxs.supabase.co', supabaseKey!)

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

  if (loading) return <p>Loading...</p>

  return (
        <div className="h-screen w-screen flex flex-row">
            <div className="flex flex-col items-center p-3 h-[calc(100vh-20px)] bg-[#181A39] w-56 my-[10px] rounded-r-4xl">
                <SidebarButton label="Home" icon={<House size={20} />} href='/'/>
                <SidebarLine label="Quotes"/>
                <SidebarButton label="Add Quote" icon={<Plus size={20} />} href='/addquote'/>
                <SidebarButton label="View Quotes" icon={<TextAlignStart size={20}/>} href='/'/>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 bg-[#181A39] m-[10px] rounded-lg">
              <span className='text-8xl'>UNDER CONSTRUCTION</span>
            </div>
        </div> 
    )

    function SidebarLine({label}: any) {
        return (
            <div data-orientation="horizontal" role="none" className="flex items-center mx-2 my-1.5 w-52 text-sm text-slate-400">
                <span className="flex-grow h-px bg-sidebar-border border border-slate-400"></span>
                <span className="px-2 shrink-0">{label}</span>
                <span className="flex-grow h-px bg-sidebar-border border border-slate-400"></span>
            </div>
        )
    }

    function SidebarButton({ href, icon, label, active }: any) {
        return (
        <Link href={href}>
            <button
            className={`flex w-52 m-[2px] items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 
            ${active ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
            {icon}
            <span className="font-medium">{label}</span>
            </button>
        </Link>

    )
    }   
}