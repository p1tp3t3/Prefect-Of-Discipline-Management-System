import { useState, useContext } from "react"
import AuthContext from "@/context-provider/auth-provider";
import { ArrowLeft, ArrowRight } from "lucide-react";

const AvailabilityCalendar = ({ event = (d) => console.log(d) }) => {
    const { usr } = useContext(AuthContext)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointment_list, setAppointmentList] = useState([])

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const daysInMonth = []
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
    }

    const emptySlots = new Array(firstDayOfMonth.getDay()).fill(null)

    function handleMonth(m) {
        let d = null
        switch(m) {
            case 'prev':
                d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                break
            case 'next':
                d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                break
            default:
                d = new Date()
                break
        }
        setCurrentDate(d)
        //const currentMonth = { month: `${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}` }
        //api.setData(currentMonth)
        //api.fetchData()
    }
    const handleMonthChange = (event) => {
        const newDate = new Date(event.target.value + "-01")
        //const currentMonth = { month_year: `${String(newDate.getMonth() + 1).padStart(2, "0")}-${newDate.getFullYear()}` }
        setCurrentDate(newDate)
        //api.setData(currentMonth)
        //api.fetchData()
    }

    return (    
        <div className="flex gap-7 bg-white p-5 rounded-md shadow-md shadow-black/20 h-full">
            <div className="w-full">
                <div className="w-full flex gap-5 justify-end pb-4">
                    <div className="flex h-[2rem] bg-gray-200">
                        <button 
                            type="button" 
                            className="py-1 px-4" 
                            onClick={() => handleMonth('prev')}>
                            <ArrowLeft size={14} />
                        </button>
                        <input  
                            className="border-none w-[10rem] bg-gray-200 text-[0.9em]"
                            type="month"
                            value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`}
                            name="" 
                            id=""
                            onChange={handleMonthChange} />
                        <button 
                            type="button" 
                            className="py-1 px-4" 
                            onClick={() => handleMonth('next')}>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
                <div className="w-full h-full">
                    <div className="grid gap-3">
                        <div className="grid border-blue-400 rounded-md border-[1px] py-3 grid-cols-7 gap-1 text-center">
                            {daysOfWeek.map((day) => (
                            <div key={day} className="font-medium">
                                {day}
                            </div>
                            ))}
                        </div>
                        <div className="border w-full">
                            <div className="grid gap-1 grid-cols-7 text-center w-full relative h-full">
                                {emptySlots.map((_, index) => (
                                    <div key={index} className="h-full w-full"></div>
                                ))}
                                {daysInMonth.map((date) => {
                                    const isCurrent = date.toDateString() == new Date().toDateString()
                                    const current = (isCurrent) ? 'bg-blue-500 text-white' : ''
                                    return (
                                        <div
                                            key={date}
                                            onClick={() => event(date)}
                                            className={`p-3 h-[5rem] border rounded cursor-pointer relative text-end ${current}`}
                                        >
                                            {date.getDate()}
                                        </div>
                                    )
                                })}
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AvailabilityCalendar