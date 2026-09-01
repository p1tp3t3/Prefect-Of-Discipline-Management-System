import SidebarNav from "../sidebar-nav"

const GuidanceSideBar = () => {
    const list = [
        { type: "link", id: "dashboard", href: "/dashboard", icon: "fa-chart-line", label: "Dashboard" },
    ]

    return <SidebarNav list={list} height="h-[20rem]" />
}
export default GuidanceSideBar
