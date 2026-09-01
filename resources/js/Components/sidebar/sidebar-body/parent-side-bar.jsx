import SidebarNav from "../sidebar-nav"

const ParentSideBar = () => {
    const list = [
        { type: "link", id: "dashboard", href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
        { type: "link", id: "monitor", href: "/children/monitor", icon: "fa-users", label: "Children Monitoring" },
        { type: "link", id: "complaint", href: "/complaint", icon: "fa-file", label: "Complaint" },
    ]

    return <SidebarNav list={list} height="h-[26rem]" />
}
export default ParentSideBar
