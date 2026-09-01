import AuthHeader from "@/Components/other/header";
import { AuthProvider } from "@/context-provider/auth-provider";
import '@/Responsive/sidebar-responsive.css'
import AuthSideBar from "@/Components/sidebar/auth-side-bar";
import { useEffect } from "react";
import { showOutputModal } from "@/others/function";

const AuthLayout = ({ children, user, program = '' }) => {
    const path = window.location.pathname
    useEffect(() => {
        if(localStorage.getItem('show-login-success') == 1) {
            showOutputModal(
                `Welcome ${user.profile?.first_name} ${user.profile?.last_name}`,
                'g',
                () => {
                    localStorage.removeItem('show-login-success')
                }
            )
        }
    }, [])
    
    return (
        <>
        <AuthProvider usr={user} >
            <div className="w-full flex bg-gray-100">
                <AuthSideBar 
                    usr={user} 
                    program={program}
                    addPicRoute={(path.includes('register')) ? '../' : ''} 
                />
                <div className="w-full">
                    <AuthHeader 
                        user={user} 
                        addPicRoute={(path.includes('register')) ? '../' : ''} 
                    />
                    <div className="w-[95%]" style={{margin: '0 auto'}}>
                        {children}
                    </div>
                </div>
            </div>
        </AuthProvider>
        </>
    )   
}
export default AuthLayout