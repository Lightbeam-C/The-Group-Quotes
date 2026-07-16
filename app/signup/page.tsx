'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient('https://qyopevrsgdidmvnjhdxs.supabase.co', 'sb_publishable_9VlSAFNLdM7T6BLjkrXzWQ_h7lAuXqM')



export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')

  const signup = async (email: string, password: string, e: React.FormEvent) => {
    e.preventDefault()
    const {data, error} = await supabase.auth.signUp({email: email, password: password, options: {data: {name: name, username: username}}})
    
    if (error) {
      setError(error.message)
      setPassword('')
    } else {
      router.push('/login')
    }
  }
  
  return (
    <div className='flex flex-col items-center justify-center min-h-screen min-w-screen' >
      <embed type='image/png' src='/TheGroupLogo.png' width='100' height='100'/>
      <h1 className='text-lg'>Sign up to The Group</h1>
      <p><br></br></p>
      {error && 
        <div className='flex flex-row space-x-2 items-center'>
          <p className='text-red-500 mt-2'>{error}</p>
        </div>
      } 
      {step === 1 ? (
        <div className='w-full min-w-[px] max-w-[350] p-4 mx-auto'>
          <form onSubmit={(e) => {e.preventDefault(); setStep(2)}}>
            <div className='flex flex-col items-left justify-left '>
              <label htmlFor='email'>Email:</label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                id='email' 
                type='email' 
                autoComplete="email" 
                className='border rounded-md border-solid browsercolor h-[40] w-full p-4 mx-auto'
                required
              />
            </div>
            <p className='h-[15]'><br></br></p>
            <div className='flex flex-col items-left justify-left'>
              <label htmlFor='email'>Password:</label>
              <input 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                id='password' 
                type='password' 
                autoComplete="password" 
                className='border rounded-md border-solid browsercolor h-[40] w-full p-4 mx-auto'
                required
              />
            </div>
            <p className='h-[15]'><br></br></p>
            <input 
            type='submit' 
            value='Next'
            className='bg-[#238636] text-white h-[40] w-full min-w-[280px] max-w-[400] mx-auto rounded-md text-center align-middle hover:bg-[#29903b] transition'
            />
          </form>
        </div>
      ) : (
        <div className='w-full min-w-[px] max-w-[350] p-4 mx-auto'>
            <form onSubmit={(e) => {signup(email, password, e)}}>
              <div className='flex flex-col items-left justify-left '>
                <label htmlFor='email'>Name:</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  id='name' 
                  type='text' 
                  autoComplete="name" 
                  className='border rounded-md border-solid browsercolor h-[40] w-full p-4 mx-auto'
                  required
                />
              </div>
              <p className='h-[15]'><br></br></p>
              <div className='flex flex-col items-left justify-left'>
                <label htmlFor='email'>Username:</label>
                <input 
                  value={username} onChange={(e) => setUsername(e.target.value)} 
                  id='username' 
                  type='text' 
                  autoComplete="username" 
                  className='border rounded-md border-solid browsercolor h-[40] w-full p-4 mx-auto'
                  required
                />
              </div>
              <p className='h-[15]'><br></br></p>
              <input 
              type='submit' 
              value='Sign Up!'
              className='bg-[#238636] text-white h-[40] w-full min-w-[280px] max-w-[400] mx-auto rounded-md text-center align-middle hover:bg-[#29903b] transition'
              />
            </form>
          </div>
      )
      } 
      <p>Already have an account? <a href='/login' className='text-blue-600 hover:underline'> Log in!</a></p>
    </div>
  )
}