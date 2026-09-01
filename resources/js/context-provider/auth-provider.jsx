import { createContext, useState, useEffect } from "react"


const AuthContext = createContext()

export function AuthProvider ({ children , usr }) {
    const  [toast, openToast] = useState(false),
           [toastLabel, setToastLabel] = useState(''),
           [toastIcon, setToastIcon] = useState(''),
           [onlineUserIds, setOnlineUserIds] = useState(new Set())

    const showToast = (label, icon) => {
        openToast(true)
        setToastLabel(label)
        setToastIcon(icon)
        setTimeout(() => openToast(false), 5000)
    }

    useEffect(() => {
        if (!usr?.id || typeof window === 'undefined' || !window.Echo) return

        const channel = window.Echo.join('online-users')
            .here((users) => {
                setOnlineUserIds(new Set(users.map((u) => u.id)))
            })
            .joining((user) => {
                setOnlineUserIds((prev) => new Set(prev).add(user.id))
            })
            .leaving((user) => {
                setOnlineUserIds((prev) => {
                    const next = new Set(prev)
                    next.delete(user.id)
                    return next
                })
            })

        return () => window.Echo.leave('online-users')
    }, [usr?.id])

    const isUserOnline = (userId) => onlineUserIds.has(userId)

    return (
        <AuthContext.Provider value={{ usr , toast, toastLabel, toastIcon, showToast, openToast, onlineUserIds, isUserOnline }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext