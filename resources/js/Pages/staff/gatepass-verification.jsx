import SearchUserBar from "@/Components/input/search-user-bar"
import GatePassApprovedList from "@/Components/list/gatepass-approved-list"
import AuthLayout from "@/Layouts/auth-layout"
import { APIRequest } from "@/others/classes/api-req"
import { useState, useEffect } from "react"


const StaffGatePassVerification = (props) => {
    const [gatepassApprovedList, setGatePassApprovedList] = useState(null),
            [search, setSearch] = useState(''),
            [searchedApprovedUser, setSearchedApprovedUser] = useState(null),
            [focus, setFocus] = useState(false)

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }
    const getApprovedUser = (s) => {
        const f = gatepassApprovedList.filter((e, i) => e.id == s)
        setSearchedApprovedUser(f)
        setSearch('')
    }
    useEffect(() => {
        fetchApprovedUsers()
    }, [])
    
    const fetchApprovedUsers = () => {
        setGatePassApprovedList(null)
        setSearchedApprovedUser(null)
        const api = new APIRequest('/gatepass/approved-users', 'post')
        api.setSetter(setGatePassApprovedList)
        api.fetchData()
        setSearch('')
    }

    return (
        <>
            <div className="sticky w-full z-10 py-5 flex gap-3">
                <div className="w-full">
                    <SearchUserBar
                        setSearch={setSearch}
                        name="search_approved_user"
                        search={search}
                        isFocus={focus}
                        plc="Search Gate Pass Approved User"
                        focus={setFocus}
                        handleSearch={handleSearch}
                        lim={5}
                        list={props.gatepass_approved_list}
                        def='User Not Found'
                        withLink={false}
                        click={getApprovedUser}
                    />
                </div>
                <div>
                    <button 
                        type="button" 
                        onClick={() => fetchApprovedUsers()}
                        className="bg-blue-600 text-white w-[2.5rem] h-[2.5rem] rounded-full text-[1.4em]"
                    >
                        <i className="fa-solid fa-refresh"></i>
                    </button>
                </div>
            </div>
            <div className="">
                <div className="grid gap-5 w-full justify-self-center">
                    <div className="flex gap-5 justify-center w-full">
                        <div className="w-full">
                            <GatePassApprovedList 
                                list={(searchedApprovedUser != null) ? searchedApprovedUser : gatepassApprovedList} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

StaffGatePassVerification.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>

export default StaffGatePassVerification