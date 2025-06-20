import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-4 mt-auto">
      <div className="max-w-6xl mx-auto px-6 text-center">
        &copy; {new Date().getFullYear()} Notes App. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer