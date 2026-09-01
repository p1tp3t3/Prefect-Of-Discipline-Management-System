import SidebarNav from "../sidebar-nav"

const PrefectSideBar = () => {
    const list = [
        { type: "link", id: "dashboard", href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
        {
            type: "dropdown", id: "user-list", icon: "fa-user", label: "User List",
            items: [
                { id: "student-list", href: "/prefect/student-list", icon: "fa-user-graduate", label: "Student List" },
                { id: "family", href: "/prefect/family", icon: "fa-users", label: "Family List" },
            ],
        },
        {
            type: "dropdown", id: "incident", icon: "fa-triangle-exclamation", label: "Incident Management",
            items: [
                { id: "complaints", href: "/prefect/complaints", icon: "fa-file", label: "Complaints" },
                { id: "referrals", href: "/prefect/referrals", icon: "fa-file", label: "Referrals" },
                { id: "absent-form", href: "/prefect/absent-form", icon: "fa-file", label: "Absent Forms" },
                { id: "archives", href: "/prefect/archive", icon: "fa-archive", label: "Archives" },
            ],
        },
        {
            type: "dropdown", id: "violation-management-toggle", icon: "fa-triangle-exclamation", label: "Violation Management",
            items: [
                { id: "prefect/violation", href: "/prefect/violation", icon: "fa-user-graduate", label: "Student Violations" },
                { id: "violation-management", href: "/violation-management", icon: "fa-gavel", label: "Manage Violations & Penalties" },
            ],
        },
        { type: "link", id: "appointment", href: "/prefect/appointment", icon: "fa-calendar", label: "Appointment" },
        { type: "link", id: "gatepass", href: "/prefect/gatepass", icon: "fa-file", label: "Gate-Pass" },
        { type: "link", id: "report", href: "/prefect/report", icon: "fa-chart-simple", label: "Reports" },
    ]

    return <SidebarNav list={list} height="h-[20rem]" />
}
export default PrefectSideBar
