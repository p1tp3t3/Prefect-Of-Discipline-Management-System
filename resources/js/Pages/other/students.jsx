import Btn from "@/Components/button/normal-btn"
import DropdownField from "@/Components/input/dropdown"
import SearchBar from "@/Components/input/search-bar"
import SearchUserBar from "@/Components/input/search-user-bar"
import StudentList from "@/Components/list/student-list"
import AuthLayout from "@/Layouts/auth-layout"
import { Head, router } from "@inertiajs/react"
import { useState } from "react"

const Students = (props) => {

    const fileName = props.file_name
    
    const [search, setSearch] = useState('')
    const params = new URLSearchParams(window.location.search);

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }
    const handleSelect = (field, value) => {
        const link = window.location.pathname

        const program = params.get('program') || "all"
        const yearLevel = params.get('school-year') || "all"

        router.visit(
            `${link}?program=${field === "program" ? value : program}&school-year=${field === "school-year" ? value : yearLevel}`
        )
    }
    
    // Generate last X school years dynamically
    const generateSchoolYears = (count = 6) => {
        const years = [];
        const currentYear = new Date().getFullYear();

        for (let i = 0; i < count; i++) {
        const start = currentYear - i;
        const end = start + 1;
        years.push({
            val: `${start}-${end}`,
            label: `${start}-${end}`,
        });
        }

        return years;
    };
    return (
        <>
        <Head title="Student List" />
        <div className="w-full py-10">
            <div className="w-full grid gap-10 relative">
                <div className="flex justify-between items-center">
                    <h1 className="text-[1.4em]">
                        <b>Student List</b>
                    </h1>
                </div>
                <div className="flex gap-3 justify-between items-center">
                    <div className="flex gap-3">
                        <div className="w-[18rem] relative">
                            <SearchUserBar
                                setSearch={setSearch}
                                name="search"
                                search={search}
                                plc="Search Student"
                                handleSearch={handleSearch}
                                lim={5}
                                def='Student Not Found'
                                withLink={true}
                                link={`/${props.user.user_type}/student-list`}
                                param={true}
                                apiLink={`/api/all-users/${(props.user.role == 'administrative' || props.user.role == 'teaching_staff') ? 'program_student' : 'student'}`}
                            />
                        </div>
                        <div>
                            <DropdownField
                                default={{ val: "all", label: "All School Years" }}
                                list={generateSchoolYears()}
                                val={params.get("school-year")}
                                onChange={(e) => handleSelect("school-year", e.target.value)}
                            />
                        </div>
                    </div>
                    {props.user.user_type == 'administrative' &&
                    <div className="flex gap-3 items-center">
                        <a href={`/download/user/account/${fileName}`} download={fileName}>
                            <Btn>
                                <i className="fa-solid fa-download"></i> Download Student Accounts
                            </Btn>
                        </a>
                    </div>}
                </div>
                <div>
                    <StudentList list={props.students} />
                </div>
            </div>
        </div>
        </>
    )
}

Students.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>

export default Students