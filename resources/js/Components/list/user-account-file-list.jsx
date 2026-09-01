import { APIRequest } from "@/others/classes/api-req";
import ActionBtn from "../button/action-btn";

const UserAccountFileList = ({ list = null, deleteFile }) => {
    return (
        <div className="w-full py-3 bg-white rounded-md shadow-black/20 shadow-sm grid gap-3">
            <div>
                <table className="w-full border-collapse">
                    <thead>
                        <th className="py-3 sticky top-0 bg-white text-[0.9em] border-b">#</th>
                        <th className="py-3 sticky top-0 bg-white text-[0.9em] border-b">File Name</th>
                        <th className="py-3 sticky top-0 bg-white text-[0.9em] border-b">Last Modified</th>
                        <th className="py-3 sticky top-0 bg-white text-[0.9em] border-b">Action</th>
                    </thead>
                    <tbody>
                        {(list != null)
                        ?
                        ((list.length != 0)
                        ?
                        list.map((e, i) => <Row data={e} i={i} deleteFile={deleteFile} />)
                        :
                        <tr>
                            <td colspan={4} className="w-full">
                                <div className="grid place-items-center w-full text-[1em] text-gray-500">
                                    <div className="text-[4em]">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                    </div>
                                    <div>No Files Uploaded Yet</div>
                                </div>
                            </td>
                        </tr>)
                        :
                        <tr className="text-[1em] text-gray-500 w-full grid place-items-center h-full">
                            <div className="grid place-items-center">
                                <div className="text-[4em]">
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                </div>
                                <div>Loading...</div>
                            </div>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const Row = ({ data, i, deleteFile }) => {
    const downloadFile = (fileName) => {
        const link = `/download/user/account/${fileName}`
        window.open(link, '_blank');
    }

    return (
        <tr key={data.id} className="border-b">
            <td className="text-[0.8em]">
                {i + 1}.
            </td>
            <td className="flex gap-3 items-center py-3">
                <div>
                    <i className="fa-solid fa-file text-[1.1em] text-green-600"></i>
                </div>
                <div className="text-[0.8em]">{data.name}</div>
            </td>
            <td className="py-3">
                <div className="text-[0.8em]">
                    {data.last_modified}
                </div>
            </td>
            <td className="py-3 flex items-center gap-2 text-[0.8em]">
                <ActionBtn onClick={() => downloadFile(data.name)} className={"bg-blue-600 text-white hover:bg-blue-700"}>
                    Download File
                </ActionBtn>
            </td>
        </tr>
    )
}

export default UserAccountFileList