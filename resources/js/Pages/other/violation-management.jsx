import AuthLayout from "@/Layouts/auth-layout";
import { useState } from "react";
import ManageViolation from "../itrc/maintenance/manage-violation";
import Reload from "@/Components/reload/reload";
import SetViolationModal from "@/Components/modal/submission-form/set-violation-modal";
import ManagePenalty from "../itrc/maintenance/manage-penalty";
import SetPenaltyModal from "@/Components/modal/submission-form/set-penalty-modal";

const ViolationManagement = (props) => {
    const [activeTab, setActiveTab] = useState('violations'),
          [penalty, openPenalty] = useState(false),
          [violation, openViolation] = useState(false),
          [reload, setReload] = useState(false),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState(""),
          [action, setAction] = useState("create"),
          [data, setData] = useState(null),
          [violation_list, setViolationList] = useState(props.violation),
          [penalty_list, setPenaltyList] = useState(props.penalty),
          [clickedOk, setClickOk] = useState(false);

    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };
    const isReload = () => {
        return reload ? "opacity-1 z-[100]" : "opacity-0 z-[-1]";
    };
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
        <Reload
            transition={isReload()}
            type={reloadType}
            label={reloadLabel}
            onClose={(e) => {
                if(action != 'add') {
                    setReload(e)
                    if(clickedOk) window.location.href = '/'
                    setClickOk(false)
                }else setReload(e)
            }}
        />
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
        <div className="grid gap-8 px-4 sm:px-6 lg:px-10">
            <div className="flex-shrink-0 h-full">
                <div className="pt-6 sm:pt-10">
                    <div className="grid w-full gap-3">

                        {/* Page Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Violation Management
                        </h1>

                        {/* Tabs */}
                        <div className="flex flex-wrap border-b border-gray-200">
                            <button
                                className={`px-3 sm:px-4 py-2 ${
                                    activeTab === "violations"
                                        ? "border-b-2 border-blue-500 text-blue-500"
                                        : "text-gray-600"
                                }`}
                                onClick={() => setActiveTab("violations")}
                            >
                                Manage Violations
                            </button>

                            <button
                                className={`px-3 sm:px-4 py-2 ${
                                    activeTab === "penalty"
                                        ? "border-b-2 border-blue-500 text-blue-500"
                                        : "text-gray-600"
                                }`}
                                onClick={() => setActiveTab("penalty")}
                            >
                                Manage Penalties
                            </button>
                        </div>

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
