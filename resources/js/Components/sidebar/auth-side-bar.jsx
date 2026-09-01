import ProfilePic from "../other/profile-pic"
import { getProfilePic, highlightNav } from "@/others/function"
import { useEffect } from "react"
import ITRCSideBar from "./sidebar-body/itrc-side-bar"
import StudentSideBar from "./sidebar-body/student-side-bar"
import PrefectSideBar from "./sidebar-body/prefect-side-bar"
import TeachingStaffSideBar from "./sidebar-body/teaching-staff-side-bar"
import StaffSideBar from "./sidebar-body/staff-side-bar"
import ParentSideBar from "./sidebar-body/parent-side-bar"
import GuidanceSideBar from "./sidebar-body/guidance-side-bar"
import "@/Responsive/sidebar-responsive.css"
import { Link, usePage } from "@inertiajs/react"
import bg from "@/images/bg-pilar.jpg"

const AuthSideBar = ({ usr }) => {
  const { url, props } = usePage()
  const appName = props.app_name || 'PilarPODHED'
  useEffect(() => highlightNav(url), [url])

  const roleLabel = () => {
    switch (usr.role) {
      case "super_admin":
        return "System Admin"
      case "sub_admin":
        return "Prefect of Discipline"
      case "student":
        return "Student"
      case "teaching_staff":
        return usr.teaching_staff?.position === "program_head" ? "Program Head" : "Faculty"
      case "non_teaching_staff":
        return "Staff"
      case "guard":
        return "Guard"
      case "guidance":
        return "Guidance"
      case "parent":
        return "Parent"
    }
  }

  return (
    <>
    <aside
      className={`
        flex-shrink-0 flex-grow-0
        w-[19rem] transition-all h-screen bg-gray-950 sticky top-0
        max-[768px]:fixed max-[768px]:top-0 max-[768px]:left-0 max-[768px]:w-0 max-[768px]:z-[100]
      `}
    >
      <div className="w-full grid gap-5 overflow-hidden">
        {/* Header Section */}
        <div>
          <div
            className="flex text-white items-center gap-3 px-5 py-2 bg-no-repeat bg-center bg-cover relative"
            style={{ backgroundImage: `url(${bg})` }}
          >
            {/* dark overlay */}
            <div className="bg-black/70 absolute w-full h-full left-0 top-0"></div>

            {/* profile */}
            <div className="z-10">
              <ProfilePic size={2.5} />
            </div>

            {/* text */}
            <div className="w-full z-10">
              <h1 className="text-[1em] font-bold">{appName}</h1>
              <h1 className="text-[0.7em]">Pilar College of Zamboanga City, Inc.</h1>
            </div>

            {/* arrow button — visible only on mobile */}
            <button
              onClick={() => {
                const aside = document.querySelector("aside"),
                      bg = document.querySelector("#sidebar-overlay")
                aside.classList.toggle("max-[768px]:w-0")
                bg.classList.toggle('hidden')
              }} // define this function to close/collapse sidebar
              className="z-20 md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition"
            >
              <i className="fa-solid fa-arrow-left text-[1.2em]"></i>
            </button>
          </div>



          {/* User Section */}
          <div className="text-white px-5 transition-all border-gray-400/50 border-b hover:bg-white/5 cursor-pointer">
            <Link href={`/profile/${usr.username}`}>
              <div className="w-full flex items-center gap-3 py-2">
                <ProfilePic
                  src={getProfilePic(usr.profile?.profile_picture, usr.profile?.sex)}
                  size={2.5}
                />
                <div>
                  <h1 className="text-[1.1em] font-bold">{usr.profile?.first_name}</h1>
                  <h1 className="text-[0.8em]">{roleLabel()}</h1>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Menu Section */}
        <div>
          <div className="grid gap-2 overflow-hidden overflow-y-auto">
            <h1 className="px-10 text-gray-400 text-[0.9em]">Menu</h1>
            <SidebarBody usr={usr} />
          </div>
        </div>
      </div>
    </aside>
    {/* MOBILE OVERLAY */}
    <div
      id="sidebar-overlay"
      className="hidden fixed inset-0 bg-black/60 z-[90]"
      onClick={(e) => {
        document.querySelector("aside").classList.toggle("max-[768px]:w-0")
        e.target.classList.toggle("hidden")
      }}
    ></div>
    </>
  )
}

const SidebarBody = ({ usr }) => {
  switch (usr.role) {
    case "super_admin":
      return <ITRCSideBar usr={usr} />
    case "sub_admin":
      return <PrefectSideBar />
    case "student":
      return <StudentSideBar />
    case "teaching_staff":
      return <TeachingStaffSideBar isProgramHead={usr.teaching_staff?.position === "program_head"} />
    case "non_teaching_staff":
      return <StaffSideBar isGuard={false} />
    case "guard":
      return <StaffSideBar isGuard={true} />
    case "guidance":
      return <GuidanceSideBar />
    case "parent":
      return <ParentSideBar />
  }
}

export default AuthSideBar
