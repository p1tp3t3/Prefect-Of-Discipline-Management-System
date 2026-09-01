import SearchBar from "../input/search-bar"
import UserProfileList from "../list/search-user-list"
import LabelList from "../list/label-list"
import { useEffect, useState } from "react"
import { APIRequest } from "@/others/classes/api-req"

const SearchUserBar = ({ 
    setSearch, 
    search, 
    plc, 
    name,
    isSearchFocus, 
    focusSearch, 
    handleSearch, 
    list, 
    userType, 
    withLink,
    click,
    param = false,
    link,
    lim,
    def,
    profile = true,
    label = null,
    apiLink = '',
    type = 'id'
}) => {
    
    const [typingTimeout, setTypingTimeout] = useState(null)
    const [searchList, setSearchList] = useState((apiLink != '') ? null : list)

    useEffect(() => {
        if (search === '') return;

        if(apiLink != '') {
            setSearchList(null)
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            const timeout = setTimeout(() => {
                console.log('Go');
                const api = new APIRequest(`${apiLink}?search=${search}`, 'get')
                api.setSetter(setSearchList)
                api.fetchData()
            }, 2000);

            setTypingTimeout(timeout);

            return () => clearTimeout(timeout);
        }
    }, (apiLink != '') ? [search] : [])


    return (
        <>
        <SearchBar
            setSearch={setSearch}
            name={name}
            search={search}
            isFocus={isSearchFocus}
            plc={plc}
            focus={focusSearch}
            handleSearch={handleSearch}
            w="w-full"
        />
        {search.length != 0 && (
            <div className="mt-2 absolute w-full">
                {profile
                ?
                <UserProfileList
                    list={searchList}
                    lim={lim}
                    search={search}
                    authType={userType}
                    withLink={withLink}
                    event={click}
                    type={type}
                    param={param}
                    default={def}
                    link={link}
                />
                :
                <LabelList
                    list={searchList}
                    lim={lim}
                    search={search}
                    withLink={withLink}
                    event={click}
                    default={def}
                    link={link}
                    isProfile={false}
                    label={label}
                />}
            </div>
        )}
        </>
    )
}
export default SearchUserBar