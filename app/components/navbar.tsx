import React from 'react'

const NAV_ITEMS = [
    {id: 1, title: "Home", url: "/"},
    {id: 2, title: "About", url: "/about"},
]


const Navbar = () => {

    
  return (
    <div>
        {NAV_ITEMS.map((item) => (
            <a key={item.id} href={item.url}>{item.title}</a>
        ))}
    </div>
  )
}

export default Navbar