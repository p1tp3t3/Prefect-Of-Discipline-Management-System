import { Link } from "@inertiajs/react"

const NotificationWrapper = ({ link, children }) => {
    return (
        <Link href={link}>
            <div>   
                <div className="group w-full p-2 hover:bg-gray-100 cursor-pointer rounded-md">
                    <div className="flex gap-2 items-center">
                        {children}
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default NotificationWrapper