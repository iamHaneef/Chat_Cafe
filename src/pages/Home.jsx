import React from 'react'
import Sidebar from '../component/Sidebar'
import Chatbar from '../component/Chatbar'

const Home = () => {
  return (
    <div className='home'>
        <div className="container">
        <Sidebar/>
        <Chatbar/>
        </div>
    </div>
  )
}

export default Home;
