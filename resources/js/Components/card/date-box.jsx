import ProfilePic from "../other/profile-pic"
import { useRef, useState, useEffect, useContext } from "react"
import AuthContext from "@/context-provider/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

const DateBox = (props) => {
    const { usr } = useContext(AuthContext)

    const renderProfile = (arr) => {
        const l = []
        let x = 0
        const path = window.location.pathname.includes('prefect') ? '../' : '../../',
              anonymous = (usr.user_type != 'prefect') ? 'anonymous-' : ''


        for(let i = 0; i < arr.length; i++) {
            if(i < 2) {
                l.push(
                    <div className="relative">
                        <div 
                            className={`flex-shrink-0 rounded-[100%] relative `} 
                            style={{left: `-${x}px`}}
                        >
                            <div className="p-[1px] bg-white rounded-[100%]">
                                <ProfilePic 
                                    src={`${path}user-assets/${arr[i].user.username}/${anonymous}profile-${arr[i].user.username}.jpg`}
                                    size={1.6} 
                                />
                            </div>
                        </div>
                    </div>
                )
            }else {
                l.push(
                    <div className="relative">
                        <div 
                            className={`flex-shrink-0 rounded-[100%] relative `} 
                            style={{left: `-${x}px`}}
                        >
                            <div className="p-[1px] bg-gray-400 rounded-[100%]">
                                <div className="w-[1.6rem] rounded-[100%] h-[1.6rem] bg-white text-black grid place-items-center text-[0.7em]">
                                    <div className="flex gap-[1px] items-center justify-center">
                                        <div>2</div><i className="fa-solid fa-plus text-[0.8em]"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break
            }
            x+=10
        }
        return l.map((e, i) => <div key={i}>{e}</div>)
    }

    const isDateBefore = (props.date <= new Date()) ? 'bg-gray-300' : '';

    const inputDate = new Date(props.date);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isTodayOrFuture = inputDate >= today;

    return (
        <div
            key={props.date}
            popoverTarget="option-cal"
            onClick={(e) => {
                if(props.event != null && isTodayOrFuture) {
                    if(3 != 0) props.popup(props.i, e);
                    else {
                        props.handleTogglePanel(props.i + 1)
                        props.event(props.date.toDateString())
                    }
                }
            }}
            className={`p-2 border ${(props.appointedUsers.length <= 5) ? '' : 'bg-gray-500'} ${isDateBefore} h-[5rem] rounded ${(props.event != null) ? 'cursor-pointer' : ''} relative ${props.current}`}
        >
            <div className="w-full h-full relative grid">
                <div className="justify-self-end">{props.date.getDate()}</div>
                <div className={`flex w-full relative ${(props.event != null) ? 'mt-3' : 'justify-center'}`}>
                    {((props.event != null)
                    ? 
                    (((props.appointedUsers.length <= 5) ? (usr.user_type == 'prefect') ? renderProfile(props.appointedUsers) : '' : ''))
                    :
                    <div className="text-[0.7em] text-center px-3 py-[1px] bg-green-500 text-white rounded-lg">
                        <h1 className="text-[1em]"><b>Appoint</b></h1>
                        <p>8:30 am</p>
                    </div>)}
                </div>
                {props.event &&
                <OptionPanel 
                    click={props.option === (props.i + 1)} 
                    ref={(el) => (props.pane.current[props.i + 1] = el)} 
                    event={[()=>props.event[0](props.date), ()=>props.event[1](props.date), ()=>props.event[2](true)]}
                />}
            </div>
        </div>
    )
}

const OptionPanel = (props) => {
    const popup = (props.click),
          l = 'py-2 px-3 text-start hover:bg-gray-200 cursor-pointer text-[0.8em]'

    return (
        <AnimatePresence>
            {popup &&
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`absolute cursor-default z-[1] text-black rounded-md w-[15rem] top-[3rem] bg-white shadow-black/20 shadow-md self-end justify-self-end`}
                ref={props.ref}
            >
                <div className="w-full">
                    <ul className="p-0">
                        <li className={l} onClick={props.event[1]}><i className="fa-solid fa-calendar-plus"></i> Schedule an Appointment</li>
                        <li className={l} onClick={props.event[0]}><i className="fa-solid fa-eye"></i> View Scheduled Users</li>
                    </ul>
                </div>
            </motion.div>}
        </AnimatePresence>
    )
}
export default DateBox
/**
 * <div className="flex-shrink-0 border-2 border-blue-700 rounded-[100%]">
        <ProfilePic size={1.5} />
    </div>
 */