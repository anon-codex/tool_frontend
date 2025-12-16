import React from 'react'
import { useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { SearchContext } from '../context/SearchContext';
import { useContext } from 'react';
import "./search.css";


const Search = () => {
    const {setSearch} = useContext(SearchContext);
    const [value,setValue] = useState("");
    

    const Add_search = () => {
        setSearch(value);
        // console.log(search);
    }

  return (
    <div className='w-full flex justify-center items-center mt-5 flex-col gap-4'>
     <div className='w-full flex justify-center items-center gap-4'>
      <input value={value} onChange={(e)=>{
         setValue(e.target.value);
      }} style={{border:"2px solid green"}} className="outline-none w-[40vw] p-1.5 pl-3 rounded-2xl text-2xl" type="text" placeholder='Search domain :- google.com'/>
      <button onClick={Add_search} className='cursor-pointer'><IoMdSearch size={35}/></button>
      </div>
      <div className='loader'></div>
    </div>
  )
}

export default Search