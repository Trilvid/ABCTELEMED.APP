import React from 'react'
import './404.css'
import Header from '../header/Header'

const NotFound = () => {
  return (
    <>
      <Header />
    <div className='NOtfound'>

      <span>
        <img src="/404.jpg" alt="" width={300} />
      </span>
      <span>
        oops sorry this page doesn't exist.
      </span>

      <div className="spaceme"></div>
      <div className="spaceme"></div>
    </div>
    </>
  )
}

export default NotFound