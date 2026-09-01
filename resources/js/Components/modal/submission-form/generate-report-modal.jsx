import { useState } from "react"
import UpModal from "../up-modal"
import { change, showOutputModal, getProfilePic } from "@/others/function"
import { APIRequest } from "@/others/classes/api-req"
import BetweenTextfield from "@/Components/input/between-input"
import FormTextfield from "@/Components/input/form-input"
import FormButton from "@/Components/button/button"
import DropdownField from "@/Components/input/dropdown"
import CheckBoxButton from "@/Components/input/checkbox"
import SearchUserBar from "@/Components/input/search-user-bar"
import SelectedUser from "@/Components/other/selected-user"
import RadioButton from "@/Components/input/radio"

const GenerateReportModal = (props) => {

    const [data, setData] = useState({
        type: 'incident',
        report_type: '',
        program: '',
        individual: false,
        file_type: 'pdf',
        date_from: '',
        date_to: '',
        student_id: ''
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
        const downloadUrl = `/prefect/report/generate?${query}`
        setReload(true)
        const api = new APIRequest(downloadUrl, 'get', {}, (e)=>{}, () => {
            setReload(false)
            showOutputModal(
                'Incident Report Generated Successfully',
                's',
                () => {
                    props.closeModal(false)
                }
            )
            },
        () => {
            setReload(false)
            showOutputModal(
                'Failed to Generate Incident Report',
                'e'
            )
        })
        const f = data.file_type == 'excel' ? 'incident-report.xlsx' : 'incident-report.pdf'
        api.downloadFile(f)
    }
    const setter = (e) => {
        props.setter(e.data)
    }
    const success = () => {
        props.reload(true, "success", "Report Generated Successfully")
        setTimeout(() => {
            props.reload(false)
        }, 3000)
    }
    const error = () => {
        props.reload(true, "error", "Failed to Generate Report")
        setTimeout(() => {
            props.reload(false)
        }, 3000)
    }
    const getSearchedComplainant = (s) => {
        const f = props.students.filter((e, i) => e.id == s)
        setSearchedComplainant(f)
        setSearchComplainant('')
        setData((prev) => ({
            ...prev,
            student_id: f[0].id
        }))
    }

    const list = (data.type == 'incident')
                ?
                [
                    { val: 'all', label: `All Incidents` },
                    ...props.incidents.map(v => ({
                        val: v.id,
                        label: v.violation_name
                    }))
                ]
                :
                [
                    { val: 'all', label: `All Violations` },
                    ...props.violations.map(v => ({
                        val: v.id,
                        label: v.violation_name
                    }))
                ]

    return (
        <UpModal
            close={props.close}
            pd={["px-10", "py-4"]}
            isEnableOuterClose={props.close}
            closeModal={props.closeModal}
            bgColor="bg-white"
            w="w-[30rem]"
        >
            <div className="w-full grid gap-3">
                <div className="pt-3 text-[1.2em] text-center">
                    <h1><b>Generate New Report</b></h1>
                </div>
                <div className="py-3 w-full">
                    <form onSubmit={handleSubmit} method="post">
                        <div className="grid gap-5">
                            <div>
                                <RadioButton
                                    list={[
                                        { val: 'incident', label: 'Incident' },
                                        { val: 'violation', label: 'Violation' },
                                    ]}
                                    id="type"
                                    name="type"
                                    val={data.type}
                                    change={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <CheckBoxButton.CheckBox
                                    label='Individual Student Report'
                                    id='individual'
                                    name='individual'
                                    checked={data.individual}
                                    change={(e) => {
                                        setIndividual(e.target.checked)
                                        setData((prev) => ({
                                            ...prev, 
                                            individual: e.target.checked
                                        }))
                                    }}
                                />
                                {data.individual &&
                                <div className="grid gap-2">
                                    <div className="w-full relative">
                                        <SearchUserBar
                                            setSearch={setSearchComplainant}
                                            name="search_complainant"
                                            search={searchComplainant}
                                            plc="Search Student"
                                            handleSearch={handleSearchComplainant}
                                            lim={5}
                                            def='User Not Found'
                                            withLink={false}
                                            click={getSearchedComplainant}
                                            apiLink="/api/all-users/student"
                                        />
                                    </div>
                                    {(searchedComplainant) &&
                                    <div>
                                    <div className="text-[0.8em]">Student:</div>
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
                                <DropdownField.Search
                                    default={{ val: '', label: `Select ${data.type == 'incident' ? 'Incidents' : 'Violations'}` }}
                                    list={list}
                                    onChange={handleChange}
                                    name="report_type"
                                    val={data.report_type}
                                />
                            </div>
                            {!individual &&
                            <div className="w-full">
                                <DropdownField
                                    default={{ val: '', label: 'Select Program' }}
                                    list={[
                                        { val: 'all', label: 'All Programs' },
                                        ...props.programs
                                    ]}
                                    onChange={handleChange}
                                    name="program"
                                    val={data.program}
                                />
                            </div>}
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

export default GenerateReportModal