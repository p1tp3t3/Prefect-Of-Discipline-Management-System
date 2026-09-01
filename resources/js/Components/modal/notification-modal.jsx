import { useState, useEffect, useContext } from "react"
import { APIRequest } from "@/others/classes/api-req"
import AuthContext from "@/context-provider/auth-provider"
import { Link } from "@inertiajs/react"
import NotificationList from "../list/notification-list"
import TabBtn from "../button/tab-btn"
import { motion } from "framer-motion"

const NotificationModal = (props) => {

    const [choose, setChoose] = useState('all')
    const api = new APIRequest()

    const { usr } = useContext(AuthContext)
    const optionTab = [
        { val: 'all', label: 'All' },
        { val: 'unread', label: 'Unread' },
    ]
    
    const handlePaginate = () => {
        api.setLink(`/api/notification/list/${choose}/${props.user.id}/${props.list.length + 2}`)
        api.setMethod('get')
        api.setSetter((e) => {
            props.setter[0](e.notif)
            props.setter[1](e.unread_count)
        })
        api.fetchData()
    }
    const displayAll = (type) => {
        if(type != choose) {
            const t = type == 'all' ? 'all' : 'unread'

            setChoose(type)
            api.setLink(`/api/notification/list/${t}/${props.user.id}/4`)
        }
        props.setter[0](null)
        props.setter[1](0)
        api.setMethod('get')
        api.setSetter((e) => {
            props.setter[0](e.notif)
            props.setter[1](e.unread_count)
            props.setter[2](e.size)
        })
        api.fetchData()
    }
    const markAllAsRead = () => {   
        api.setLink('/notification/read')
        api.setMethod('post')
        api.setData({ type: 'select-all' })
        api.setSetter((e) => {
            props.setter[0](e.notif)
            props.setter[1](e.unread_count)
        })
        api.fetchData()
    }



    return (
        (props.click) &&
        <motion.div
            onClick={(e) => e.stopPropagation()}
            ref={props.ref}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`absolute right-0 py-4 rounded w-full sm:w-[22rem]  border-[1px] shadow-md px-3 flex-shrink-0 flex-grow-0 bg-white justify-self-end mt-[2.8rem]`}
        >
            <div className="w-full">
                <div className="w-full flex justify-between pb-1 items-center">
                    <h1 className="text-[1.2em]"><b>Notifications</b></h1>
                    <div className="text-[0.9em]">
                        <button type="button" className="hover:underline" onClick={markAllAsRead}>
                            <i className="fa-solid fa-check"></i> Mark All as Read
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-[1em] flex gap-1 py-2">
                        <TabBtn
                            option={choose}
                            list={optionTab}
                            handleSelect={displayAll}
                        />
                    </div>
                    <div className="text-[0.8em]">
                        <Link className="hover:underline" href="/notifications">
                            View All
                        </Link>
                    </div>
                </div>
                <NotificationList 
                    list={props.list} 
                    handlePaginate={handlePaginate} 
                    size={props.size}
                />
            </div>
        </motion.div>
    )
}
export default NotificationModal

