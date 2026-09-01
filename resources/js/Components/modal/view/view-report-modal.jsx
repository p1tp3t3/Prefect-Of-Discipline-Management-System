import UpModal from "../up-modal"
import IncidentTrendBody from "./report/incident-trend"
import Top3OffendersBody from "./report/top-3-offender"

const ViewReportModal = (props) => {
    return (
        <UpModal
            close={props.close} 
            closeModal={props.closeModal}
            isEnableOuterClose={props.isEnableOuterClose}
            pd={props.pd}
            bgColor='bg-white'
            w='w-[50rem]'> 
            <div>
                view report
                <Body type='incident_trend' />
            </div>
        </UpModal>
    )
}

const Body = (props) => {
    switch(props.type) {
        case 'incident_trend':
            return <IncidentTrendBody />
        case 'top3-offender':
            return <Top3OffendersBody />
    }
}

ViewReportModal.Body = Body
export default ViewReportModal