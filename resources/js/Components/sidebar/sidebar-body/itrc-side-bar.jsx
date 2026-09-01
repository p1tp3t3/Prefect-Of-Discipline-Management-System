import SidebarNav from "../sidebar-nav"

const ITRCSideBar = () => {
    const list = [
        { type: "link", id: "dashboard", href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
        {
            type: "dropdown", id: "user-management", icon: "fa-user", label: "User Management",
            items: [
                { id: "accounts/register", href: "/super-admin/accounts/register", icon: "fa-user-plus", label: "New User" },
                { id: "user-accounts", href: "/super-admin/user-accounts", icon: "fa-list", label: "User List" },
                { id: "student-list", href: "/super-admin/student-list", icon: "fa-user-graduate", label: "Students" },
                { id: "parent-request-list", href: "/super-admin/parent-request-list", icon: "fa-user", label: "Parent Request" },
            ],
        },
        { type: "link", id: "program", href: "/super-admin/program", icon: "fa-user-graduate", label: "College Programs" },
        { type: "link", id: "report", href: "/super-admin/report", icon: "fa-file", label: "Reports" },
        { type: "link", id: "violation-management", href: "/violation-management", icon: "fa-triangle-exclamation", label: "Violation Management" },
        {
            type: "dropdown", id: "system-administrator", icon: "fa-gear", label: "System Administrator",
            items: [
                { id: "system-settings", href: "/system-settings", icon: "fa-sliders", label: "System Settings" },
                { id: "maintenance", href: "/maintenance", icon: "fa-screwdriver-wrench", label: "Maintenance" },
            ],
        },
    ]

    return <SidebarNav list={list} height="h-[26rem]" />
}
export default ITRCSideBar
