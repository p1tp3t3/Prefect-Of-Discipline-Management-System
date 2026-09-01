import { useState } from "react"
import UpModal from "../up-modal"
import CheckBoxButton from "@/Components/input/checkbox"
import SearchUserBar from "@/Components/input/search-user-bar"
import SelectedUser from "@/Components/other/selected-user"
import { change, showOutputModal, getProfilePic } from "@/others/function"
import DropdownField from "@/Components/input/dropdown"
import BetweenTextfield from "@/Components/input/between-input"
import RadioButton from "@/Components/input/radio"
import FormButton from "@/Components/button/button"
import { APIRequest } from "@/others/classes/api-req"

const GenerateActionLogReportMoodal = (props) => {
    const [data, setData] = useState({
        report_type: '',
        individual: false,
        file_type: 'pdf',
        date_from: '',
        date_to: '',
        user_id: ''
    })

    const [individual, setIndividual] = useState(false),
            
            [searchComplainant, setSearchComplainant] = useState(""),
            [searchedComplainant, setSearchedComplainant] = useState(null),
            [reload, setReload] = useState(false)

    const handleSearchComplainant = (e) => {
        const val = e.target.value;
        setSearchComplainant(val);
    }
    const handleChange = (e) => {
        change(e, setData)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const query = new URLSearchParams(data).toString()
        const downloadUrl = `/super-admin/report/generate?${query}`
        setReload(true)
        const api = new APIRequest(downloadUrl, 'get', {}, (e)=>{}, () => {
            setReload(false)
            showOutputModal(
                'Action Log Report Generated Successfully',
                's',
                () => {
                    props.closeModal(false)
                }
            )
            },
        () => {
            setReload(false)
            showOutputModal(
                'Failed to Generate Action Log Report',
                'e'
            )
        })
        const f = data.file_type == 'excel' ? 'action-log-report.xlsx' : 'action-log-report.pdf'
        api.downloadFile(f)
    }
    const getSearchedComplainant = (s) => {
        const f = props.students.filter((e, i) => e.id == s)
        setSearchedComplainant(f)
        setSearchComplainant('')
        setData((prev) => ({
            ...prev,
            user_id: f[0].id
        }))
    }
    const actionList = [
        { val: 'login', label: 'Login' },
        { val: 'logout', label: 'Logout' },
        { val: 'register', label: 'Register' },
        { val: 'account activation', label: 'Account Activation' },
        { val: 'account update', label: 'Account Update' },
        { val: 'profile update', label: 'Profile Update' },
        { val: 'complaint', label: 'Complaint' },
        { val: 'referral', label: 'Referral' },
        { val: 'appointment', label: 'Appointment' },
        { val: 'gatepass', label: 'Gatepass' },
    ]

    return (
        <UpModal
            close={props.close}
            pd={["px-10", "py-4"]}
            isEnableOuterClose={props.close}
            closeModal={props.closeModal}
            bgColor="bg-white"
            w="w-[40rem]"
        >
            <div className="w-full grid gap-3">
                <div className="pt-3 text-[1.2em] text-center">
                    <h1><b>Generate New Report</b></h1>
                </div>
                <div className="py-3 w-full">
                    <form onSubmit={handleSubmit} method="post">
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <CheckBoxButton.CheckBox
                                    label='Individual User Report'
                                    id='individual'
                                    name='individual'
                                    checked={data.individual}
                                    change={(e) => {
                                        setIndividual(e.target.checked)
                                        setData((prev) => ({
                                            ...prev, 
                                            individual: e.target.checked,
                                            user_id: ''
                                        }))
                                        setSearchedComplainant(null)
                                    }}
                                />
                                {individual &&
                                <div className="grid gap-2">
                                    <div className="w-full relative">
                                        <SearchUserBar
                                            setSearch={setSearchComplainant}
                                            name="search_complainant"
                                            search={searchComplainant}
                                            plc="Search User"
                                            handleSearch={handleSearchComplainant}
                                            lim={5}
                                            def='User Not Found'
                                            withLink={false}
                                            click={getSearchedComplainant}
                                            apiLink="/api/all-users/all-2"
                                        />
                                    </div>
                                    {(searchedComplainant) &&
                                    <div>
                                    <div className="text-[0.8em]">User:</div>
                                        <SelectedUser 
                                            src={getProfilePic(searchedComplainant[0].profile?.profile_picture, searchedComplainant[0].profile?.sex)}
                                            name={[searchedComplainant[0].profile?.first_name, searchedComplainant[0].profile?.last_name]}
                                            user={searchedComplainant[0]}
                                            unselect={setSearchedComplainant}
                                        />
                                    </div>}
                                </div>}
                            </div>
                            <div className="w-full">
                                <DropdownField
                                    default={{ val: '', label: 'Select Action Type' }}
                                    list={[
                                        { val: 'all', label: 'All Action Type' },
                                        ...actionList
                                    ]}
                                    onChange={handleChange}
                                    name="report_type"
                                    val={data.report_type}
                                    titleCase={true}
                                />
                            </div>
                            <div>
                                <BetweenTextfield
                                    type="date"
                                    labels={['Date From', 'Date To']}
                                    name={['date_from',  'date_to']}
                                    id={['date_from',  'date_to']}
                                    data={[data.date_from, data.date_to]}
                                    setData={setData}
                                />
                            </div>
                            <div>
                                <RadioButton
                                    list={[
                                        { val: 'pdf', label: 'PDF File' },
                                        { val: 'excel', label: 'Excel File' },
                                    ]}
                                    change={handleChange}
                                    name="file_type"
                                    id='file_type'
                                    val={data.file_type}
                                />
                            </div>
                            <div className="grid">
                                <FormButton type="submit" label='Export File' loading={reload} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </UpModal>
    )
}

export default GenerateActionLogReportMoodal