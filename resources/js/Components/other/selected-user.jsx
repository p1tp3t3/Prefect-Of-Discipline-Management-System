import { showUserType } from "../../others/function"
import ProfilePic from "./profile-pic"

const SelectedUser = (props) => {
    const showActive = (props.showActive) ? { showActive: true, isActive: props.activeStatus } : {}
    return (
        <div className="grid relative">
            {(props.unselect != null) &&
            <div className="absolute">
                <button 
                    type="button" 
                    className="bg-gray-300 relative top-[-0.3rem] z-[5] w-[1.2rem] h-[1.2rem] rounded-full text-[0.8em]"
                    onClick={() => props.unselect(null)}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>}
            <div className="flex gap-2">
                <div>
                    <ProfilePic 
                        src={props.src} 
                        size={2.5} 
                        {...showActive}
                    />
                </div>
                <div className="text-[0.8em]">
                    <h1 className="text-[1.2em]"><b>{`${props.name[0]} ${props.name[1]}`}</b></h1>
                    <h1 className="text-[0.9em]">{showUserType(props.user, true)}</h1>
                </div>
            </div>
        </div>
    )
}
export default SelectedUser