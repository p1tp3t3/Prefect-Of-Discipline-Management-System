import { AuthProvider } from "@/context-provider/auth-provider";
import { useContext, useEffect } from "react";
import AuthHeader from "@/Components/other/header";
import { APIRequest } from "@/others/classes/api-req";

const NotifDisplayLayout = ({ user, children }) => {
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id')

        if(id != null) {
            const api = new APIRequest(`/notification/read`, 'post', { id: id, type: 'select-one' })
            api.sendPostData()
        }
    }, [])

    return (
        <AuthProvider usr={user}>
            <div className="w-full bg-gray-100">
                <AuthHeader profile={true} user={user} />
                <div className="w-full max-w-[60rem] mx-auto px-3 sm:px-6 md:px-8">
                    {children}
                </div>
            </div>
        </AuthProvider>
    );
}
export default NotifDisplayLayout;