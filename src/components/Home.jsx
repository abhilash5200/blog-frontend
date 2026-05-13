import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate()

  return (

    <div className='min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 flex justify-center items-center px-6'>

      <div className='bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-12 max-w-3xl text-center border border-gray-200'>

        <h1 className='text-6xl font-extrabold text-blue-600 mb-6 leading-tight'>
          Welcome to <br />
          Blog Platform
        </h1>

        <p className='text-gray-600 text-lg leading-9 mb-10'>
          Explore trending articles, publish your thoughts, and connect with a
          community of passionate writers and readers. Our platform provides a
          modern blogging experience with dedicated spaces for users, authors,
          and administrators.
        </p>

        <div className='flex flex-col sm:flex-row justify-center gap-5'>

          <button
            onClick={() => navigate('/register')}
            className='bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:scale-105 transition duration-300'
          >
            Get Started
          </button>

          <button
            onClick={() => navigate('/login')}
            className='bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:scale-105 transition duration-300'
          >
            Login
          </button>

        </div>

      </div>

    </div>

  )
}

export default Home