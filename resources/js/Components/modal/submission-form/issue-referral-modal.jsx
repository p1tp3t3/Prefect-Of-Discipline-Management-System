import UpModal from "../up-modal"
import SearchUserBar from "@/Components/input/search-user-bar"
import ProfilePic from "../../other/profile-pic"
import FormTextfield from "@/Components/input/form-input"
import FormButton from "../../button/button"
import { useState } from "react"
import { change, getProfilePic, showWarningModal, showOutputModal } from "../../../others/function"
import { APIRequest } from "@/others/classes/api-req"

const IssueReferralModal = (props) => {
    const [search, setSearch] = useState(""),
          [searchedStudent, setSearchedStudent] = useState(null),
          [searchedStudent2, setSearchedStudent2] = useState([])

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
    };
    const getSelectedStudent = (i) => {
        const select = props.student_list.find((e) => e.id == i);
        setSearchedStudent2((prev) => {
            const alreadyExists = prev.some((student) => student.id === select.id);
            if (alreadyExists) return prev;
            return [...prev, select];
        });
        setSearch('')
    }
    const removeStudent = (i) => {
        const newList = searchedStudent2.filter((e, index) => index !== i)
        setSearchedStudent2(newList)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const f = new FormData()

        f.append('referrer_id', props.val.referrer_id)
        f.append('referred_student_id', searchedStudent2[0]['id'])
        searchedStudent2.forEach((e, i) => f.append(`referred_students[${i}]`, e['id']))
        f.append('referral_reason', props.val.referral_reason)
        showWarningModal(
            'Are You Want to Refer a Student?',
            'Refer Student',
            'Cancel',
            () => {
                props.reload(true, "text-wait", "Your Referral is Processing");
                const api = new APIRequest('/referral/create',  'post', f, ()=>{}, success, error)
                api.sendPostData()
            }
        )
    }
    const success = () => {
        props.reload(true, '');
        showOutputModal(
            "Referral Created Successfully",
            "s",
            () => {
                props.reload(false);
                props.closeModal(false);
            }
        )
    }
    const error = () => {
        props.reload(true, "");
        showOutputModal(
            "Failed to Process Referral. Please Try Again",
            "e",
            () => {
                props.reload(false)
            }
        )
        //
    }
    const removeReload = () => {
        setTimeout(() => {
            props.reload(false);
        }, 3000);
    }
    const getSearchedStudent = (s) => {
        const f = props.student_list.filter((e, i) => e.id == s)
        setSearchedStudent(f)
        setSearch('')
        props.setter((prev) => ({
            ...prev,
            referred_student_id: f[0].id
        }))
    }
    const handleChange = (e) => {
        change(e, props.setter)
    }
    return (
        <UpModal
            close={props.close}
            pd={["px-10", "py-4"]}
            isEnableOuterClose={props.close}
            closeModal={props.closeModal}
            bgColor="bg-white"
            w="w-[40rem]">
            <div className="w-full">
                <div className="pt-3 text-[1.2em]">
                    <h1><b>Who do you want to Refer?</b></h1>
                </div>
                <div className="py-3 w-full">
                    <form onSubmit={handleSubmit} method="post">
                        <div className="grid gap-3">
                            <div className="w-full relative z-10">
                                <SearchUserSection
                                    label=""
                                    setSearch={setSearch}
                                    name="student_search"
                                    search={search}
                                    plc="Search Student/s as the Referred Student"
                                    handleSearch={handleSearch}
                                    searchList={searchedStudent2}
                                    def="Student Not Found"
                                    getSelect={getSelectedStudent}         
                                    unselect={removeStudent}    
                                    user={props.user}
                                />
                                {/*
                                <SearchUserBar
                                    setSearch={setSearch}
                                    name="search_referred_student"
                                    search={search}
                                    isFocus={isSearchFocus}
                                    plc="Search Student Full Name"
                                    focus={focusSearch}
                                    handleSearch={handleSearch}
                                    lim={5}
                                    list={props.student_list}
                                    def='Students Not Found'
                                    withLink={false}
                                    click={getSearchedStudent}
                                    apiLink="/api/all-users/student"
                                /> */}
                            </div>
                            <div>
                                {(searchedStudent) &&
                                <SelectedReferStudent 
                                    src={getProfilePic(searchedStudent[0].profile?.profile_picture, searchedStudent[0].profile?.sex)}
                                    name={[searchedStudent[0].profile?.first_name, searchedStudent[0].profile?.last_name]}
                                    student={searchedStudent[0].student}
                                    unselect={setSearchedStudent}
                                />}
                            </div>
                            <div>
                                <FormTextfield 
                                    label="Reason to Refer" 
                                    name="referral_reason" 
                                    id="referral_reason"
                                    type="textarea"
                                    val={props.val.referral_reason}
                                    change={handleChange} 
                                    req={true}
                                    color={{ border: 'border-blue-700', bg: 'bg-gray-200' }} 
                                />
                            </div>
                            <div className="grid justify-end">
                                <FormButton type="submit" label="Submit" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>        
        </UpModal>
    )
}
const SearchUserSection = ({ 
    label, 
    setSearch, 
    isSearchFocus, 
    name, 
    plc, 
    focusSearch, 
    handleSearch, 
    search, 
    searchList,
    list, 
    def, 
    getSelect,
    unselect,
    user
}) => {
    return (
        <div className="grid gap-2">
            <div className="text-[0.9em]">{label}</div>
            <div className="relative">
                <SearchUserBar
                    setSearch={setSearch}
                    name={name}
                    search={search}
                    isFocus={isSearchFocus}
                    plc={plc}
                    focus={focusSearch}
                    handleSearch={handleSearch}
                    lim={4}
                    list={searchList}
                    def={def}
                    withLink={false}
                    click={getSelect}
                    apiLink={`/api/all-users/${user.role == 'administrative' ? 'program_student' : 'student'}`}
                />
            </div>
            <div className="flex overflow-y-hidden overflow-x-auto w-full">
                {searchList.length != 0
                    ? searchList.map((e, i) => (
                        <SelectedUser2
                            key={i} 
                            src={getProfilePic(e.profile?.profile_picture, e.profile?.sex)}
                            name={[e.profile?.first_name, e.profile?.last_name]}
                            user={e}
                            unselect={unselect}
                            index={i}
                        />
                    ))
                    : ""}                
            </div>
        </div>
    )
}
const SelectedUser2 = (props) => {

    const isStudent = (props.user.user_type == 'student') 
                      ? `${props.user.program.name}`
                      : toTitleCase(props.user.parent.parent_role)
    return (
        <div className="flex-shrink-0 grid relative w-[5rem]">
            <div className="justify-self-center grid">
                <div>
                    <div className="grid w-[2.5rem] justify-self-center">
                        {props.unselect &&
                        <div className="absolute">
                            <button 
                                type="button" 
                                className="bg-gray-300 relative top-[-0.3rem] z-[5] w-[1.2rem] h-[1.2rem] rounded-full text-[0.8em]"
                                onClick={() => props.unselect(props.index)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>}
                        <div className="justify-self-center">
                            <ProfilePic 
                                src={props.src} 
                                size={2.5} 
                            />
                        </div>
                    </div>
                    <div className="text-[0.7em] text-center">
                        <h1><b>{`${props.name[0]} ${props.name[1]} (${isStudent})`}</b></h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
const SelectedReferStudent = (props) => {
    return (
        <>
        <div className="text-[0.8em]">Referred Student:</div>
        <div className="grid relative">
            <div className="absolute">
                <button 
                    type="button" 
                    className="bg-gray-300 relative top-[-0.3rem] z-[5] w-[1.2rem] h-[1.2rem] rounded-full text-[0.8em]"
                    onClick={() => props.unselect(null)}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <ProfilePic 
                        activeBorderColor='border-white border-[3px]'  
                        src={props.src} 
                        size={2.5} 
                    />
                </div>
                <div className="text-[0.8em]">
                    <h1 className="text-[1.2em]"><b>{props.name[0] + ' ' + props.name[1]}</b></h1>
                    <h1 className="text-[0.9em]">{props.student.program.name} {props.student.year_level}</h1>
                </div>
            </div>
        </div>
        </>
    )
}
export default IssueReferralModal