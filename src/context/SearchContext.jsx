import { createContext, useState } from "react";

export const SearchContext = createContext();

export function Provider({children})
{
    const [search,setSearch] = useState("hello");

    return (
    <SearchContext.Provider value={{search,setSearch}}>
      {children}
    </SearchContext.Provider>
);

}