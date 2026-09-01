import SidebarNav from "../sidebar-nav"

const TeachingStaffSideBar = ({ isProgramHead }) => {
    const list = [
        { type: "link", id: "dashboard", href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
        {
            type: "dropdown", id: "user-list", icon: "fa-user", label: "User List", show: isProgramHead,
            items: [
                { id: "faculty-list", href: "/teaching-staff/faculty-list", icon: "fa-user-tie", label: "Faculty" },
                { id: "student-list", href: "/teaching-staff/student-list", icon: "fa-user-graduate", label: "Student" },
            ],
        },
        { type: "link", id: "student-list", href: "/teaching-staff/student-list", icon: "fa-user-graduate", label: "Student List", show: !isProgramHead },
        { type: "link", id: "complaint", href: "/complaint", icon: "fa-file", label: "Complaint" },
        { type: "link", id: "referral", href: "/referral", icon: "fa-file", label: "Referral", show: isProgramHead },
    ]

    return <SidebarNav list={list} height="h-[26rem]" />
}
export default TeachingStaffSideBar
