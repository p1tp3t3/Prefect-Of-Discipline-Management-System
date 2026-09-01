import SidebarNav from "../sidebar-nav"

const StudentSideBar = () => {
    const list = [
        { type: "link", id: "dashboard", href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
        { type: "link", id: "complaint", href: "/complaint", icon: "fa-file", label: "Complaint" },
        { type: "link", id: "absent-form", href: "/absent-form", icon: "fa-file", label: "Absent Form" },
        { type: "link", id: "gatepass", href: "/gatepass", icon: "fa-file", label: "Gate-Pass" },
    ]

    return <SidebarNav list={list} height="h-[26rem]" />
}
export default StudentSideBar
