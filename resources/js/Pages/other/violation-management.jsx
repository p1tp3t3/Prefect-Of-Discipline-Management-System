import AuthLayout from "@/Layouts/auth-layout";
import { useEffect, useState } from "react";
import ManageViolation from "../itrc/maintenance/manage-violation";
import SetViolationModal from "@/Components/modal/submission-form/set-violation-modal";
import ManagePenalty from "../itrc/maintenance/manage-penalty";
import SetPenaltyModal from "@/Components/modal/submission-form/set-penalty-modal";
import TabSwitcher from "@/Components/other/tab-switcher";
import StudentViolationList from "@/Components/list/student-violation-list";
import { useReload } from "@/context-provider/reload-provider";

const ViolationManagement = (props) => {
    const [activeTab, setActiveTab] = useState('violations'),
          [penalty, openPenalty] = useState(false),
          [violation, openViolation] = useState(false),
          [action, setAction] = useState("create"),
          [data, setData] = useState(null),
          [violation_list, setViolationList] = useState(props.violation),
          [penalty_list, setPenaltyList] = useState(props.penalty),
          [clickedOk, setClickOk] = useState(false);

    const { loadRegister, setReload, setOnClose } = useReload();

    useEffect(() => {
        setOnClose(() => (e) => {
            if(action != 'add') {
                setReload(e)
                if(clickedOk) window.location.href = '/'
                setClickOk(false)
            }else setReload(e)
        });
    }, [action, clickedOk]);

    const openActionModal = (type, act, editData = null) => {
        setAction(act);
        if(act != 'add') setData(editData);
        if(type === 'penalty') {
            openPenalty(true);
        } else if(type === 'violation') {
            openViolation(true);
        }
    }


    return (
        <>
        <SetViolationModal
            close={violation}
            closeModal={openViolation}
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
            reload={loadRegister}
            action={action}
            data={data}
            setClickOk={setClickOk}
            setter={setViolationList}
            penalty={props.penalty}
        />
        <SetPenaltyModal
            close={penalty}
            closeModal={openPenalty}
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
            reload={loadRegister}
            action={action}
            data={data}
            setClickOk={setClickOk}
            setter={setPenaltyList}
        />
        <div className="grid gap-8">
            <div className="flex-shrink-0 h-full">
                <div className="pt-6 sm:pt-10">
                    <div className="grid w-full gap-3">

                        {/* Page Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Violation Management
                        </h1>

                        {/* Tabs */}
                        <TabSwitcher
                            tabs={[
                                { key: "violations", label: "Manage Violations" },
                                { key: "penalty", label: "Manage Penalties" },
                                { key: "student-violations", label: "Student Violations" },
                            ]}
                            value={activeTab}
                            onChange={setActiveTab}
                        />

                        {/* Content */}
                        <div className="py-6 sm:py-10">
                            {activeTab === "violations" && (
                                <ManageViolation
                                    list={violation_list}
                                    original_list={props.violation}
                                    setter={setViolationList}
                                    reload={loadRegister}
                                    events={[openActionModal]}
                                />
                            )}

                            {activeTab === "penalty" && (
                                <ManagePenalty
                                    list={penalty_list}
                                    original_list={props.penalty}
                                    setter={setPenaltyList}
                                    reload={loadRegister}
                                    events={[openActionModal]}
                                />
                            )}

                            {activeTab === "student-violations" && (
                                <div className="grid gap-4">
                                    <StudentViolationList list={props.student_violation_list} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
};

ViolationManagement.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default ViolationManagement;
