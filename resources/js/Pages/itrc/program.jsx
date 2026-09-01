import { useState } from "react";
import ManageProgram from "./maintenance/manage-program";
import ManageViolation from "./maintenance/manage-violation";
import SetProgramModal from "@/Components/modal/submission-form/set-program-modal";
import Reload from "@/Components/reload/reload";
import SetViolationModal from "@/Components/modal/submission-form/set-violation-modal";
import AuthLayout from "@/Layouts/auth-layout";
import Btn from "@/Components/button/normal-btn";

const ITRCProgram = (props) => {
    const [program, openProgram] = useState(false),
          [reload, setReload] = useState(false),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState(""),
          [action, setAction] = useState("create"),
          [data, setData] = useState(null),
          [program_list, setProgramList] = useState(props.program),
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
        if(type === 'program') {
            openProgram(true);
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
        <SetProgramModal
            close={program} 
            closeModal={openProgram} 
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
            reload={loadRegister}
            action={action}
            data={data}
            setClickOk={setClickOk}
            setter={setProgramList}
        />
        <div className="grid gap-8">
            <div className="flex-shrink-0 h-full">
                <div className="pt-10">
                    <div className="grid w-full gap-3">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800">College Programs</h1>
                            <Btn onclick={() => openActionModal('program', 'add')}>
                                Add Program
                            </Btn>
                        </div>
                        <div className="">
                            <ManageProgram list={program_list} original_list={props.program} events={[openActionModal]} setter={setProgramList} reload={loadRegister} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

ITRCProgram.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default ITRCProgram;
