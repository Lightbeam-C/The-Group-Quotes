'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import { Plus, House, TextAlignStart, ChevronDown, Minus} from 'lucide-react'
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
    const currentDate = new Date()
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
    const currentYear = currentDate.toLocaleString('default', { year: 'numeric' })

    const router = useRouter()
    const pathname = usePathname()
    const [quoteParts, setQuoteParts] = useState([{ text:"", person:''}])
    const [type, setType] = useState("")
    const [isOpen, setIsOpen] = useState([false])
    const [isOpenType, setIsOpenType] = useState(false)
    const [isOpenMonth, setIsOpenMonth] = useState(false)
    const [isOpenYear, setIsOpenYear] = useState(false)
    const [month, setMonth] = useState(currentMonth)
    const [year, setYear] = useState(Number(currentYear))
    const [success, setSuccess] = useState(false)

    const people = ['Zico', 'Alexis', 'Cadence', 'James', 'Griffin', 'Rhys', 'Thomas', 'Inspirobot', 'Everyone', 'Hezekiah', 'Jakob', 'Other'];
    const types = ['Sus', 'Non Sus', 'Misheard']
    const years = [2026, 2027, 2028, 2029]
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    useEffect(() => {
          if (success) {
              setSuccess(true);

            const timer = setTimeout(() => {
            setSuccess(false);
          }, 3000);


          return () => clearTimeout(timer);
        }
        }, [success]);
    
    function handleTextareaChange(part:number, e: React.ChangeEvent<HTMLTextAreaElement>) {
        const extraArray = [...quoteParts]
        extraArray[part]['text'] = e.target.value
        setQuoteParts(extraArray)
    
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }
    async function addQuote(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        const combinedText = quoteParts.map(part=>part.text).join("|")
        const combinedPeople = quoteParts.map(part=>part.person).join("|")

        const { error } = await supabase.from('quotes').insert({quoted_person:combinedPeople, quote:combinedText, type:type, month:month, year:year})

        if (error){

        } else {
          setSuccess(true)
          setQuoteParts([{ text: "", person:""}])
        }
    }
    function addQuotePart(){
      if (quoteParts.length < 5) {
        const extraArray = [...quoteParts]
        extraArray.push({text:'', person:''})
        setQuoteParts(extraArray)
      }
    }
    
    function removeQuotePart(index: number) {
        if (quoteParts.length > 1) {
            const extraArray=[...quoteParts]
            extraArray.splice(index, 1)
            setQuoteParts(extraArray)
        }
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
                    <form onSubmit={(e) => addQuote(e)} className='flex flex-col items-start w-full px-4 space-y-1'>
                        <h1 className='text-3xl'>Add Quotes</h1>
                        <div
                          className={`transition-all duration-350 ease-in-out grid ${
                            success
                              ? "grid-rows-[1fr] opacity-100 mb-2" 
                              : "grid-rows-[0fr] opacity-0 mb-0 pointer-events-none"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <span className="text-md text-green-500 font-medium">
                              Success!
                            </span>
                          </div>
                        </div>
                        {quoteParts.map(({text, person}, index) => (
                            <div className="flex flex-row w-full" key={index}>
                                <textarea 
                                    value = {quoteParts[index]['text']}
                                    onChange = {(e) => handleTextareaChange(index, e)}
                                    className='border-3 border-[#3A4358] bg-[#202531] rounded-lg w-full min-h-[37px] resize-none p-1 overflow-hidden mr-1' 
                                    rows={1}
                                    placeholder='Enter your quote...'
                                />
                                <div className='flex-1 h-full flex flex-row space-x-1 items-center justify-end'>
                                    <div className="relative w-30">
                                        <button
                                            type="button"
                                            onClick={() => { 
                                                const openList = [...isOpen]
                                                openList[index] = !openList[index]
                                                setIsOpen(openList)
                                            }}
                                            className="w-full flex justify-between items-center bg-blue-500 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 transition-colors"
                                        >
                                            <span className="truncate">{quoteParts[index]['person'] || "Who"}</span>
                                            <ChevronDown
                                            color='white'
                                            size={16}
                                            className={`text-slate-400 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                            />
                                        </button>
                                        {isOpen[index] && (
                                            <div className="absolute top-full mt-1 w-full bg-blue-500 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                                            <div className="max-h-50 overflow-y-auto">
                                                {people.map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => {const extraArray = [...quoteParts]
                                                        extraArray[index]['person'] = option
                                                        setQuoteParts(extraArray)
                                                        const openList = [...isOpen]
                                                        openList[index] = false
                                                        setIsOpen(openList);
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
                                    <button type='button' onClick={() => removeQuotePart(index)} className='size-[37px] bg-slate-500 rounded-full items-center hover:bg-slate-400 transition-colors'>
                                        <Minus color='Black' size={37}></Minus>
                                    </button>
                                </div>
                            </div>
                            ))
                        }
                        <div className="flex flex-row w-full">
                            <div className="flex-1 flex flex-row mt-1 me-2">
                                <button type='button' onClick={addQuotePart} className='size-[37px] bg-slate-500 rounded-full items-center hover:bg-slate-400 transition-colors'>
                                    <Plus color='Black' size={37}></Plus>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-row justify-end space-x-1 mt-1">
                                <div className="relative w-30">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpenMonth(!isOpenMonth)}
                                        className="w-full flex justify-between items-center bg-yellow-400 border border-slate-700 text-black px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 transition-colors"
                                    >
                                        <span className="truncate">{month || 'Month'}</span>
                                        <ChevronDown
                                        color='black'
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-200 ${
                                            isOpenMonth ? 'rotate-180' : ''
                                        }`}
                                        />
                                    </button>
                                    {isOpenMonth && (
                                        <div className="absolute top-full mt-1 w-full bg-yellow-400 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                                        <div className="max-h-50 overflow-y-auto">
                                            {months.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {setMonth(option);
                                                setIsOpenMonth(false);
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
                                        onClick={() => setIsOpenYear(!isOpenYear)}
                                        className="w-full flex justify-between items-center bg-yellow-400 border border-slate-700 text-black px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 transition-colors"
                                    >
                                        <span className="truncate">{String(year || 'Year')}</span>
                                        <ChevronDown
                                        color='black'
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-200 ${
                                            isOpenYear ? 'rotate-180' : ''
                                        }`}
                                        />
                                    </button>
                                    {isOpenYear && (
                                        <div className="absolute top-full mt-1 w-full bg-yellow-400 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                                        <div className="max-h-60 overflow-y-auto">
                                            {years.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {setYear(option);
                                                setIsOpenYear(false);
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
                                        onClick={() => setIsOpenType(!isOpenType)}
                                        className="w-full flex justify-between items-center bg-yellow-400 border border-slate-700 text-black px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 transition-colors"
                                    >
                                        <span className="truncate">{type || "Type"}</span>
                                        <ChevronDown
                                        color='black'
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-200 ${
                                            isOpenType ? 'rotate-180' : ''
                                        }`}
                                        />
                                    </button>
                                    {isOpenType && (
                                        <div className="absolute top-full mt-1 w-full bg-yellow-400 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                                        <div className="max-h-60 overflow-y-auto">
                                            {types.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {setType(option);
                                                setIsOpenType(false);
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
                                        type="submit"
                                        className="w-full flex justify-center items-center bg-green-500 border border-slate-700 text-black px-4 py-2 rounded-lg text-sm focus:outline-none hover:border-slate-500 hover:bg-green-400 transition-colors"
                                    >
                                        <span className="truncate">Submit Quote</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
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

    )
    }   
}