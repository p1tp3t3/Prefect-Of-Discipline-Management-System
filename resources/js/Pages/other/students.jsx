import Btn from "@/Components/button/normal-btn"
import StudentList from "@/Components/list/student-list"
import AuthLayout from "@/Layouts/auth-layout"
import { Head } from "@inertiajs/react"

const Students = (props) => {

    const fileName = props.file_name

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
                {props.user.user_type == 'administrative' &&
                <div className="flex justify-end">
                    <div className="flex gap-3 items-center">
                        <a href={`/download/user/account/${fileName}`} download={fileName}>
                            <Btn>
                                <i className="fa-solid fa-download"></i> Download Student Accounts
                            </Btn>
                        </a>
                    </div>
                </div>}
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