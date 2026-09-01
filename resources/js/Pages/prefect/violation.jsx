import DropdownField from "@/Components/input/dropdown"
import StudentViolationList from "@/Components/list/student-violation-list"
import ProgramLegend from "@/Components/other/program-legend";
import AuthLayout from "@/Layouts/auth-layout"
import { router } from "@inertiajs/react";

const Violation = (props) => {
    const params = new URLSearchParams(window.location.search)

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
    const handleSelect = (field, value) => {
        const link = window.location.pathname
    
        const program = params.get("program") || "all"
        const yearLevel = params.get("school-year") || "all"
    
        router.visit(
          `${link}?program=${
            field === "program" ? value : program
          }&school-year=${field === "school-year" ? value : yearLevel}`
        )
    }
    return (
            <div className="w-full py-4">
                <div className="w-full grid gap-5 relative">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                        <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">STUDENT VIOLATIONS</h1>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <div>
                                <DropdownField
                                    default={{ val: "all", label: "Select Program" }}
                                    list={props.program}
                                    val={params.get("program")}
                                    onChange={(e) => handleSelect("program", e.target.value)}
                                />
                            </div>
                            <div>
                                <DropdownField
                                    default={{ val: "all", label: "Select School Year" }}
                                    list={generateSchoolYears()}
                                    val={params.get("school-year")}
                                    onChange={(e) => handleSelect("school-year", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-auto">
                            <ProgramLegend list={props.program} />
                        </div>
                    </div>
                    <div className="w-full bg-white rounded-md shadow-black/20 shadow-sm overflow-x-auto">
                        <div className="w-full px-5 py-3 min-w-[800px]">
                            <StudentViolationList list={props.student_violation_list} />
                        </div>
                    </div>
                </div>
            </div>
    )
}

Violation.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default Violation