import SidebarNav from "../sidebar-nav"

const StaffSideBar = ({ isGuard }) => {
    const list = [
        { type: "link", id: "dashboard", href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
        { type: "link", id: "complaint", href: "/complaint", icon: "fa-file", label: "Complaint" },
        { type: "link", id: "gatepass", href: "/gatepass-verification", icon: "fa-file", label: "Gate Pass Verification", show: isGuard },
    ]

    return <SidebarNav list={list} height="h-[26rem]" />
}
export default StaffSideBar
