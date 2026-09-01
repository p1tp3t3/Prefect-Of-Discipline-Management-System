import ViewStudentIncidentListModal from "@/Components/modal/view/view-student-incident-list-modal"
import CircleReload from "@/Components/reload/circle-reload"
import { useEffect, useState } from "react"
import { APIRequest } from "@/others/classes/api-req"
import Reload from "@/Components/reload/reload"
import AuthLayout from "@/Layouts/auth-layout"

const StudentRiskPrediction = (props) => {
    const [data, setData] = useState(null),
          [reload, setReload] = useState(false),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState("")
    
    useEffect(() => {
        const api = new APIRequest(`/api/student/incident/list/${props.student.id}`, 'get', {}, setData)
        api.fetchData()
    }, [])


    const isReload = () => {
        return reload ? "opacity-1 z-50" : "opacity-0 z-[-1]";
    };
    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };
    

    return (
        <>
        <Reload
            transition={isReload()}
            type={reloadType}
            label={reloadLabel}
            onClose={setReload}
        />
            <div className="py-8">
                <div className="py-8 px-10 bg-white">
                    {data != null
                    ?
                    (data != '')
                    ?
                    <ViewStudentIncidentListModal.Body data={data} usr={props.student} reload={loadRegister} type={props.user.user_type} />
                    :
                    <div className="text-[1.2em] text-gray-500 w-full grid place-items-center h-full">
                        <div className="grid place-items-center">
                            <div className="text-[4em]">
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <h1 className="text-[1.2em]">No Student Found</h1>
                        </div>
                    </div>
                    :
                    <CircleReload size={5} />}
                </div>
            </div>
        </>
    )
}

StudentRiskPrediction.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default StudentRiskPrediction