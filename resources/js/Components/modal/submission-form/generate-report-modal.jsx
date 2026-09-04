import { useEffect, useState } from "react"
import UpModal from "../up-modal"
import { change, showOutputModal, getProfilePic, configBroadcast } from "@/others/function"
import { ReportArchiveService } from "@/others/services/report-archive-service"
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
        school_year: '',
        student_id: '',
        report_name: ''
    })

    const [filterBy, setFilterBy] = useState('date') // 'date' | 'school_year'
    const [duplicate, setDuplicate] = useState(null) // { report, download_url } | null

    const [individual, setIndividual] = useState(false),

          [searchComplainant, setSearchComplainant] = useState(""),
          [searchedComplainant, setSearchedComplainant] = useState(null),
          [reload, setReload] = useState(false),

          // 'idle' -> 'queued' -> 'ready' | 'failed'
          [status, setStatus] = useState('idle'),
          [downloadUrl, setDownloadUrl] = useState(null),
          [viewUrl, setViewUrl] = useState(null),
          [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        if (!props.close || !props.userId) return

        setStatus('idle')
        setDownloadUrl(null)
        setViewUrl(null)
        setErrorMessage(null)
        setDuplicate(null)

        configBroadcast(
            'private',
            `job-status.progress.user.${props.userId}`,
            'Report generation status',
            '.ReportGenerated',
            (e) => {
                if (e.status === 'ready') {
                    setStatus('ready')
                    setDownloadUrl(e.download_url)
                    setViewUrl(e.view_url)
                } else if (e.status === 'failed') {
                    setStatus('failed')
                    setErrorMessage(e.message || 'Failed to generate report.')
                }
                setReload(false)
            }
        )
    }, [props.close, props.userId])

    const handleSearchComplainant = (e) => {
        const val = e.target.value;
        setSearchComplainant(val);
    }
    const handleChange = (e) => {
        change(e, setData)
    }
    const dispatchGeneration = () => {
        setReload(true)
        setDuplicate(null)
        setStatus('idle')
        setDownloadUrl(null)
        setViewUrl(null)
        setErrorMessage(null)

        ReportArchiveService.generateReport(data, () => {
            setStatus('queued')
        }, () => {
            setReload(false)
            showOutputModal(
                'Failed to Queue Report Generation',
                'e'
            )
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        if (filterBy === 'school_year' && !data.school_year) {
            showOutputModal('Please select a school year.', 'e')
            return
        }

        setReload(true)
        setDuplicate(null)

        ReportArchiveService.checkDuplicateReport(data, (res) => {
            setReload(false)

            if (res?.exists) {
                setDuplicate(res)
                return
            }

            dispatchGeneration()
        })
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

    const hasSubType = data.type == 'incident' || data.type == 'violation'

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
                                <FormTextfield
                                    label="Report Name (Optional)"
                                    name="report_name"
                                    id="report_name"
                                    val={data.report_name}
                                    change={handleChange}
                                />
                            </div>
                            <div>
                                <RadioButton
                                    list={[
                                        { val: 'incident', label: 'Incident' },
                                        { val: 'violation', label: 'Violation' },
                                        { val: 'tardy', label: 'Tardy' },
                                        { val: 'appointment', label: 'Appointment' },
                                        { val: 'gatepass', label: 'Gate Pass' },
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
                            {hasSubType &&
                            <div className="w-full">
                                <DropdownField.Search
                                    default={{ val: '', label: `Select ${data.type == 'incident' ? 'Incidents' : 'Violations'}` }}
                                    list={list}
                                    onChange={handleChange}
                                    name="report_type"
                                    val={data.report_type}
                                />
                            </div>}
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
                                <RadioButton
                                    list={[
                                        { val: 'date', label: 'Date Range' },
                                        { val: 'school_year', label: 'School Year' },
                                    ]}
                                    id="filter_by"
                                    name="filter_by"
                                    val={filterBy}
                                    change={(e) => {
                                        const val = e.target.value
                                        setFilterBy(val)
                                        setData((prev) => ({
                                            ...prev,
                                            date_from: '',
                                            date_to: '',
                                            school_year: '',
                                        }))
                                    }}
                                />
                            </div>
                            {filterBy === 'date' &&
                            <div>
                                <BetweenTextfield
                                    type="date"
                                    labels={['Date From', 'Date To']}
                                    name={['date_from',  'date_to']}
                                    id={['date_from',  'date_to']}
                                    data={[data.date_from, data.date_to]}
                                    setData={setData}
                                />
                            </div>}
                            {filterBy === 'school_year' &&
                            <div className="w-full">
                                <DropdownField
                                    default={{ val: '', label: 'Select School Year' }}
                                    list={(props.schoolYears || []).map((y) => ({ val: y, label: y }))}
                                    onChange={handleChange}
                                    name="school_year"
                                    val={data.school_year}
                                />
                            </div>}
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
                            {duplicate &&
                            <div className="px-3 py-2 rounded bg-amber-50 text-amber-800 text-[0.85em] grid gap-2">
                                <span>
                                    A matching report was already generated on{' '}
                                    {new Date(duplicate.report.created_at).toLocaleString()}.
                                </span>
                                <div className="flex gap-2">
                                    {duplicate.view_url &&
                                    <a
                                        href={duplicate.view_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1 rounded border border-amber-600 text-amber-700 hover:bg-amber-100"
                                    >
                                        View Existing
                                    </a>}
                                    <a
                                        href={duplicate.download_url}
                                        className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-700"
                                    >
                                        Download Existing
                                    </a>
                                    <button
                                        type="button"
                                        onClick={dispatchGeneration}
                                        className="px-3 py-1 rounded border border-amber-600 text-amber-700 hover:bg-amber-100"
                                    >
                                        Generate New Anyway
                                    </button>
                                </div>
                            </div>}
                            {status === 'ready' && downloadUrl &&
                            <div className="px-3 py-2 rounded bg-green-50 text-green-700 text-[0.85em] flex items-center justify-between gap-2">
                                <span>Your report is ready.</span>
                                <div className="flex gap-2">
                                    {viewUrl &&
                                    <a
                                        href={viewUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1 rounded border border-green-600 text-green-700 hover:bg-green-100"
                                    >
                                        View
                                    </a>}
                                    <a
                                        href={downloadUrl}
                                        className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>}
                            {status === 'failed' &&
                            <div className="px-3 py-2 rounded bg-red-50 text-red-700 text-[0.85em]">
                                {errorMessage || 'Failed to generate report.'}
                            </div>}
                            {status === 'queued' &&
                            <div className="px-3 py-2 rounded bg-blue-50 text-blue-700 text-[0.85em]">
                                Generating your report… this will only take a moment.
                            </div>}
                            {!duplicate &&
                            <div className="grid">
                                <FormButton
                                    type="submit"
                                    label={status === 'queued' ? 'Generating…' : 'Export File'}
                                    loading={reload}
                                    disabled={status === 'queued'}
                                />
                            </div>}
                        </div>
                    </form>
                </div>
            </div>
        </UpModal>
    )
}

export default GenerateReportModal