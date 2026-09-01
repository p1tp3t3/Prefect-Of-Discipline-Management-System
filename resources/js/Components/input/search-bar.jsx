import { useState } from "react"

const SearchBar = (props) => {
    return (
        <label htmlFor={props.name} className={`text-[0.9em]`}>
            <div className={`${props.w} ${(props.h) ? props.h : ''} flex rounded-[10rem] gap-3 py-2 items-center px-5 border-[1px] border-gray-500 bg-gray-200 hover:border-gray-900`}>
                <div>
                    <i className="fa-solid fa-search"></i>
                </div>
                <input 
                    className={`w-full h-full p-0 border-none focus:ring-0 focus:border-none text-[0.9em]`} 
                    type="text" 
                    name={props.name} 
                    id={props.name} 
                    onChange={props.handleSearch} 
                    value={props.search} 
                    placeholder={props.plc}
                    style={{background: 'none'}}
                />
                {props.search &&
                <div className="">
                    <button type="button" onClick={() => props.setSearch('')}><i className="fa-solid fa-xmark"></i></button>
                </div>}
            </div>
        </label>
    )
}
/*
*/
export default SearchBar