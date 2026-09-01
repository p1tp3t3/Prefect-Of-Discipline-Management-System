import LineGraph from "@/Components/card/line-graph-statistic"
import BarGraph from "@/Components/card/bar-graph-statistic-card"
import TabBtn from "@/Components/button/tab-btn"
import { useState, useEffect } from "react"
import { APIRequest } from "@/others/classes/api-req"
import { getWebLink, splitStr, toTitleCase } from "@/others/function"
import DoughnutChart from "@/Components/card/pie-chart-statistic-card"
import GaugeChart from "@/Components/card/gauge-chart-statistic-card"
import DropdownField from "@/Components/input/dropdown"
import IncidentList from "@/Components/list/incident-list"
import PossibleIncidentList from "@/Components/list/possible-incident-commit-list"
import { data } from "autoprefixer"
import RecentViolationOccurenceList from "@/Components/list/recent-violation-occurence-list"
import IncidentGroupList from "@/Components/list/incident-group-list"

const Incident = (props) => {
    const [option, setOption] = useState('recent_incidents')

    const optionList = [
        { val: 'recent_incidents', label: 'Recent Incidents' },
        { val: 'occurence', label: 'Occurences' },
    ]
    const handleSelect = (type) => {
        setOption(type)
    }

    const renderContent = () => {
        switch (option) {
            case 'recent_incidents':
                return <IncidentGroupList user_id={props.data.id} />
            case 'occurence':
                return <RecentViolationOccurenceList user_id={props.data.id} />
        }
    }
    return (
        <>
        <div className="px-10 py-6 bg-white shadow shadow-black/20">
            <div className="grid gap-5">
                <div className="">
                    <TabBtn 
                        list={optionList} 
                        option={option} 
                        handleSelect={handleSelect} 
                        className="text-[0.9em] py-2"
                    />
                </div>
                {renderContent()}
            </div>
        </div>
        </>
    )
}



const RecentIncident = ({ link, option, setIncident, list }) => {
    useEffect(() => {
        const api = new APIRequest(link, 'get', {}, setIncident)
        setIncident(null)
        api.fetchData()
    }, [option])

    return (
        <div className="w-full">
            <IncidentList list={list} isIncident={link.includes('incident')} />
        </div>
    )
}
export default Incident