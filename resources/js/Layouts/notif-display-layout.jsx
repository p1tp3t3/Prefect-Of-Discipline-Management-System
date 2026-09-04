import { AuthProvider } from "@/context-provider/auth-provider";
import { ReloadProvider } from "@/context-provider/reload-provider";
import { useContext, useEffect } from "react";
import AuthHeader from "@/Components/other/header";
import { NotificationService } from "@/others/services/notification-service";

const NotifDisplayLayout = ({ user, children }) => {
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id')

        if(id != null) {
            NotificationService.markOneRead(id)
        }
    }, [])

    return (
        <AuthProvider usr={user}>
        <ReloadProvider>
            <div className="w-full bg-gray-100">
                <AuthHeader profile={true} user={user} />
                <div className="w-full max-w-[60rem] mx-auto px-3 sm:px-6 md:px-8">
                    {children}
                </div>
            </div>
        </ReloadProvider>
        </AuthProvider>
    );
}
export default NotifDisplayLayout;