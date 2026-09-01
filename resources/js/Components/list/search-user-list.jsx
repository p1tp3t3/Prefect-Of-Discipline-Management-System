import ProfilePic from "../other/profile-pic"
import { Link } from "@inertiajs/react"
import CircleReload from "../reload/circle-reload"
import { getProfilePic } from "@/others/function"

const UserProfileList = (props) => { 
    return (
        <div className="absolute w-full bg-white shadow-md shadow-black/20 px-3 py-3 z-10">
            <div className="w-full">
                {(props.list != null)
                ?
                ((props.list.length != 0)
                 ?
                  props.list.map((e, i) => 
                        <div className="w-full" key={i}>
                            <Row
                                src={getProfilePic(e.profile?.profile_picture, e.profile?.sex)}
                                name={`${e.profile?.first_name || ""} ${e.profile?.last_name || ""}`}
                                username={e.username} 
                                authType={props.authType}
                                withLink={props.withLink}
                                link={(props.param) ? `${props.link}?search=${e.id_number}` : null}
                                event={() => props.event(e[props.type])}
                            />
                        </div>
                    )
                  :<div className="w-full text-[0.9em] text-center py-3 text-gray-600">
                       <b><i className="fa-solid fa-search"></i> {(props.default) ? props.default : "User Not Found"}</b>
                   </div>)
                :
                <div className="flex justify-center items-center w-full">
                    <CircleReload size={2.5} />
                </div>}
            </div>
        </div>
    )
}
const Row = (props) => {
    return (
        <>
        {(props.withLink)
        ?
        <Link href={(props.link != null) ? props.link : `/profile/${props.username}`}>
            <div className="flex px-2 py-1 items-center gap-2 hover:bg-gray-200 rounded-lg">
                <div>
                    <ProfilePic 
                        activeBorderColor='border-white border-[3px]'  
                        src={props.src} 
                        size={1.9} 
                    />
                </div>
                <div className="text-[0.7em]">
                    <h1 className="text-[1.2em]"><b>{props.name}</b></h1>
                </div>
            </div>
        </Link>
        :
        <div 
            className="flex px-2 py-1 items-center gap-2 hover:bg-gray-200 rounded-lg cursor-pointer"
            onClick={props.event}
        >
            <div>
                <ProfilePic 
                    activeBorderColor='border-white border-[3px]'  
                    src={props.src} 
                    size={1.9} 
                />
            </div>
            <div className="text-[0.8em]">
                <h1 className="text-[1.2em]"><b>{props.name}</b></h1>
            </div>
        </div>}
        </>
    )
}
export default UserProfileList