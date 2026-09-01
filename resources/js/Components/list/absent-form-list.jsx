import AuthContext from "@/context-provider/auth-provider"
import { useContext } from "react"


const AbsentFormList = (props) => {
    const { usr } = useContext(AuthContext)

    return (
        <div className={props.style && "w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm"}>
            <table className="w-full border-collapse">
                <thead className="border-b-[1px] border-gray-400">
                    <th className="py-3">#</th>
                    <th className="py-3">ID No.</th>
                    {(usr.user_type == 'prefect') &&
                    <th className="py-3">Student</th>}
                    <th className="py-3">Requested Since</th>
                    <th className="py-3">Approved Since</th>
                    <th className="py-3">Action</th>
                </thead>
                <tbody>
                    <Row type={usr.user_type} />
                    <Row type={usr.user_type} />
                    <Row type={usr.user_type} />
                    <Row type={usr.user_type} />
                    <Row type={usr.user_type} />
                    <Row type={usr.user_type} />
                    <Row type={usr.user_type} />
                </tbody>
            </table>
        </div>
    )
}
const Row = ({ type, data }) => {
    return (
        <tr>
            <td className="py-2">text</td>
            <td className="py-2">text</td>
            {(type == 'prefect') &&
            <td className="py-2">Student Name</td>}
            <td className="py-2">text</td>
            <td className="py-2">text</td>
            <td className="py-2">text</td>
        </tr>
    )
}
export default AbsentFormList