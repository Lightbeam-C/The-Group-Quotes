'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import { Plus, House, TextAlignStart, ChevronDown } from 'lucide-react'
import Link from 'next/link';

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient('https://qyopevrsgdidmvnjhdxs.supabase.co', supabaseKey!)

interface CustomDropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder?: string;
}

export default function Home() {
    const router = useRouter()
    const pathname = usePathname()
    const whoPlaceholder = "Who"
    const typePlaceholder = "Type"
    const [quoteParts, setQuoteParts] = useState([{ text:"", person:''}])
    const [type, setType] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)

    const people = ['Zico', 'Cadence', 'Griffin', 'James'];
    const types = ['Sus', 'Non Sus', 'Misheard']
    
    function handleTextareaChange(part:number, e: React.ChangeEvent<HTMLTextAreaElement>) {
        const extraArray = [...quoteParts]
        extraArray[part]['text'] = e.target.value
        setQuoteParts(extraArray)
    
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }
    async function addQuote(){

    }

    return (
        <div className="h-screen w-screen flex flex-row">
            <div className="flex flex-col items-center p-3 h-[calc(100vh-20px)] bg-[#181A39] w-56 my-[10px] rounded-r-4xl">
                <SidebarButton label="Home" icon={<House size={20} />} href='/'/>
                <SidebarLine label="Quotes"/>
                <SidebarButton label="Add Quote" icon={<Plus size={20} />} href='/addquote'/>
                <SidebarButton label="View Quotes" icon={<TextAlignStart size={20}/>} href='/'/>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 bg-[#181A39] m-[10px] rounded-lg">
                <div className="flex flex-col items-start w-full px-4 space-y-1">
                    <h1 className='text-3xl'>Add Quotes</h1>
                    <div className="flex flex-row w-full">
                        <textarea 
                            value = {quoteParts[0]['text']}
                            onChange = {(e) => handleTextareaChange(0, e)}
                            className='border-3 border-[#3A4358] bg-[#202531] rounded-lg w-full min-h-[37px] resize-none p-1 overflow-hidden mr-1' 
                            rows={1}
                            placeholder='Enter your quote...'
                        />
                        <div className='w-60 h-full flex flex-row space-x-1 items-center'>
                            <div className="relative w-30">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full flex justify-between items-center bg-blue-500 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 transition-colors"
                                >
                                    <span className="truncate">{quoteParts[0]['person'] || whoPlaceholder}</span>
                                    <ChevronDown
                                    color='white'
                                    size={16}
                                    className={`text-slate-400 transition-transform duration-200 ${
                                        isOpen ? 'rotate-180' : ''
                                    }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="absolute top-full mt-1 w-full bg-blue-500 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                                    <div className="max-h-60 overflow-y-auto">
                                        {people.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {const extraArray = [...quoteParts]
                                                extraArray[0]['person'] = option
                                                setQuoteParts(extraArray)
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-400 hover:text-white transition-colors"
                                        >
                                            {option}
                                        </button>
                                        ))}
                                    </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full">
                        <div className="flex-1">
                            
                        </div>
                        <div className="flex-1 flex flex-row justify-end space-x-1 mt-1">
                            <div className="relative w-30">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen2(!isOpen2)}
                                    className="w-full flex justify-between items-center bg-yellow-400 border border-slate-700 text-black px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 transition-colors"
                                >
                                    <span className="truncate">{type || typePlaceholder}</span>
                                    <ChevronDown
                                    color='black'
                                    size={16}
                                    className={`text-slate-400 transition-transform duration-200 ${
                                        isOpen2 ? 'rotate-180' : ''
                                    }`}
                                    />
                                </button>
                                {isOpen2 && (
                                    <div className="absolute top-full mt-1 w-full bg-yellow-400 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                                    <div className="max-h-60 overflow-y-auto">
                                        {types.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {setType(option);
                                            setIsOpen2(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-300 hover:text-black transition-colors"
                                        >
                                            {option}
                                        </button>
                                        ))}
                                    </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative w-30">
                                <button
                                    type="button"
                                    onClick={(addQuote)}
                                    className="w-full flex  justify-center items-center bg-green-500 border border-slate-700 text-black px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 hover:bg-green-400 transition-colors"
                                >
                                    <span className="truncate">Submit Quote</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

  );
}
}