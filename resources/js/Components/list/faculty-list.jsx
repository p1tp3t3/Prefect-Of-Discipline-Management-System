import ProfilePic from "../other/profile-pic"
import { checkActiveStatus, getProfilePic, readableActiveDuration, readableDate, readableTime } from "../../others/function"
import { Link } from "@inertiajs/react"
import PaginationButton from "../button/pagination-btn"
import { useEffect, useState, useContext } from "react"
import ActionBtn from "../button/action-btn"
import AuthContext from "@/context-provider/auth-provider"

const FacultyList = ({ list, style = true, type = 'prefect', paginate = true }) => {
    
    const l = (paginate) ? list.data : list
    return (
        <div className={style && "w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm"}>
            <div className="grid gap-4">
                <table className="w-full">
                    <thead>
                        <th className="text-start py-3">#</th>
                        <th className="text-start py-3">Faculty ID</th>
                        <th className="text-start py-3">Faculty Member</th>
                        <th className="text-start py-3">Registered Since</th>
                        <th className="text-start py-3">Active Since</th>
                        <th className="text-start py-3">Action</th>
                    </thead>
                    <tbody>
                        {( l.length != 0 )
                        ?
                        l.map((e, i) => 
                            <Row obj={e} type={type} i={i} />
                        )
                        :
                        <tr>
                            <td className="text-center py-10 text-[0.9em]" colSpan={5}>
                                <div>No Faculty Yet</div>
                            </td>
                        </tr>}
                    </tbody>
                </table>
                {paginate &&
                <div className="justify-self-end">
                    <PaginationButton list={(list.links.length > 3) ? list.links : []} />
                </div>}
            </div>
        </div>
    )
}


const Row = ({ obj, type, i }) => {
    const { isUserOnline } = useContext(AuthContext)
    const d = {
        id: obj.id,
        user_id: obj.id_number,
        username: obj.username,
        name: `${obj.profile?.first_name ?? ""} ${obj.profile?.last_name ?? ""}`,
        profile_picture: obj.profile?.profile_picture,
        sex: obj.profile?.sex,
        program: obj.teaching_staff?.program?.name ?? "",
        created_at: obj.created_at,
        last_seen: obj.last_seen,
    }

    const [lastSeenText, setLastSeenText] = useState(
        readableActiveDuration(d.last_seen)
    )
    const [lastSeenStatus, setLastSeenStatus] = useState(
        checkActiveStatus(d.last_seen)
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setLastSeenText(readableActiveDuration(d.last_seen));
        }, 5000)

        return () => clearInterval(interval)
    }, [d.last_seen])

    useEffect(() => {
        const interval = setInterval(() => {
            setLastSeenStatus(checkActiveStatus(d.last_seen));
        }, 5000)

        return () => clearInterval(interval)
    }, [d.last_seen])


    return (
        <tr key={obj.id} className="border-t">
            <td className="py-2 text-[0.8rem]">
                {i + 1}.
            </td>
            <td className="py-2 text-[0.8rem]">
                {d.user_id}
            </td>
            <td className="py-2">
                <div className="flex gap-3 items-center">
                    <ProfilePic 
                        size={1.9}
                        src={getProfilePic(d.profile_picture, d.sex)}
                        showActive={true}
                        isActive={isUserOnline(d.id) || lastSeenStatus}
                        activeSize={0.9}
                    />
                    <div>
                        <h1 className="text-[0.8rem]"><b>{d.name}</b></h1>
                        <p className="text-[0.7rem]">{`${d.program}`}</p>
                    </div> 
                </div>
            </td>  
            <td className="py-2">
                <div className="text-[0.8rem]">{readableDate(d.created_at)}</div>
                <div className="text-[0.7em]">{readableTime(d.created_at)}</div>
            </td>
            <td className="text-[0.8em] py-2">
                <div>{lastSeenText}</div>
            </td>
            <td className="py-2">
                <Link href={`/profile/${d.username}`}>
                    <ActionBtn 
                        className={"bg-blue-600 text-white hover:bg-blue-700"}
                    >
                        View
                    </ActionBtn>
                </Link>
            </td>
        </tr>
    )
}


export default FacultyList