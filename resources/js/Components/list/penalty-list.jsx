import { useEffect, useState } from "react"
import CircleReload from "../reload/circle-reload"
import { toTitleCase } from "@/others/function"
import { APIRequest } from "@/others/classes/api-req";
const PenaltyList = () => {
    const [penaltyList, setPenaltyList] = useState(null);

    useEffect(() => {
        const api = new APIRequest('/api/penalty-list', 'get', {}, setPenaltyList)
        api.fetchData()
    }, []);

    return (
        <div className="w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr>
                        <th className="py-2 border-b">#</th>
                        <th className="py-2 border-b">Penalty Name</th>
                    </tr>
                </thead>

                <tbody>
                    {penaltyList ? (
                        penaltyList.length !== 0 ? (
                            penaltyList.map((e, i) => <Row key={i} i={i} data={e} />)
                        ) : (
                            <tr>
                                <td colSpan={4}>
                                    <div className="flex justify-center items-center w-full py-10 text-[0.9em]">
                                        No Penalty Yet
                                    </div>
                                </td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan={4}>
                                <div className="flex justify-center items-center w-full py-10 text-[0.9em]">
                                    <CircleReload size={3} />
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const Row = ({ i, data }) => {
    return (
        <tr className="border-b text-[0.9em]">
            <td className="py-2">{i + 1}.</td>
            <td className="py-2">{toTitleCase(data.description)}</td>
        </tr>
    );
};

export default PenaltyList;




