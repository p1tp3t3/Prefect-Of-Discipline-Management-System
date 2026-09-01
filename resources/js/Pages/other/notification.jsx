import ActionBtn from "@/Components/button/action-btn"
import TabBtn from "@/Components/button/tab-btn"
import NotificationList from "@/Components/list/notification-list"
import NotifDisplayLayout from "@/Layouts/notif-display-layout"
import { APIRequest } from "@/others/classes/api-req"
import { useState } from "react"

const Notification = (props) => {

    const [select, enableSelect] = useState(false),
          [choose, setChoose] = useState('all'),
          [notif_list, setNotifList] = useState(props.notification),
          [size, setSize] = useState(props.size)

    const tab = [
        { val: 'all', label: 'All' },
        { val: 'unread', label: 'Unread' },
    ]
    const handleSelect = (type) => {
        if(choose != type) {
            setNotifList(null)
            setChoose(type)
            const api = new APIRequest(`/api/notification/list/${type}/${props.user.id}/10`, 'get', {}, (e) =>  setNotifList(e.notif))

            api.fetchData()
        }
    }
    const deleteNotif = (e) => {
        const checkboxes = document.querySelectorAll('input[name="selected-row"]:checked')
        const ids = Array.from(checkboxes).map((checkbox) => checkbox.value)
        const data = { notif_id_list: ids }
        
        const api = new APIRequest(`/notifications/delete/select-multiple`, 'post', data, setNotifList)
        api.fetchData()

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false
        })
    }
    const selectAllRow = (e) => {
        const checked = e.target.checked
        const checkboxes = document.querySelectorAll('input[name="selected-row"]')
        checkboxes.forEach((checkbox) => {
            checkbox.checked = checked
        })
    }
    const handlePaginate = () => {
        const api = new APIRequest(`/api/notification/list/${choose}/${props.user.id}/${notif_list.length + 10}`,'get', {}, (e) => {
            setNotifList(e.notif)
            setSize(e.size)
        })
        api.fetchData()
    }

    return (
            <div className="w-full py-10">
                <div className="w-full grid gap-2 relative">
                    <div>
                        <h1 className="text-[1.4em]"><b>Notifications</b></h1>
                    </div>
                    <div>
                        <div className="py-5 flex justify-between items-center">
                            <div>
                                <TabBtn
                                    list={tab}
                                    option={choose}
                                    handleSelect={handleSelect}
                                    className='h-[2.2rem]'
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <ActionBtn
                                    className="bg-blue-700 hover:bg-blue-800"
                                    onClick={() => enableSelect(!select)}
                                >
                                    <i className={`fa-solid ${select ? 'fa-xmark' : 'fa-check'}`}></i>
                                </ActionBtn>
                                {select &&
                                <div className="flex items-center">
                                    <div className="flex gap-10 items-center]">
                                        <div className="flex gap-2 items-center text-[0.8em]">
                                            <input type="checkbox" id="select-all" onClick={selectAllRow} />
                                            <label htmlFor="select-all">Select All</label>
                                        </div>
                                        <ActionBtn className="bg-red-700 hover:bg-red-800"b onClick={deleteNotif}>
                                            <i className="fa-solid fa-trash"></i>
                                        </ActionBtn>
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className="bg-gray-100 flex justify-center">
                            <div className="bg-white shadow rounded-lg w-full p-6">
                                <NotificationList
                                    list={notif_list}
                                    overflow={false}
                                    enableDel={true}
                                    select={select}
                                    handlePaginate={handlePaginate}
                                    size={size}
                                    deleteNotif={(i) => {
                                        const api = new APIRequest(`/notifications/delete/select-one`, 'post', {
                                            id: i
                                        }, setNotifList)
                                        api.fetchData()
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

Notification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

export default Notification