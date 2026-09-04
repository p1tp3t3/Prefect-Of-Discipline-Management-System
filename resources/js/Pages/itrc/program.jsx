import { useEffect, useState } from "react";
import ManageProgram from "./maintenance/manage-program";
import ManageViolation from "./maintenance/manage-violation";
import SetProgramModal from "@/Components/modal/submission-form/set-program-modal";
import { useReload } from "@/context-provider/reload-provider";
import SetViolationModal from "@/Components/modal/submission-form/set-violation-modal";
import AuthLayout from "@/Layouts/auth-layout";
import Btn from "@/Components/button/normal-btn";

const ITRCProgram = (props) => {
    const [program, openProgram] = useState(false),
          [action, setAction] = useState("create"),
          [data, setData] = useState(null),
          [program_list, setProgramList] = useState(props.program),
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
        if(type === 'program') {
            openProgram(true);
        } else if(type === 'violation') {
            openViolation(true);
        }
    }


    return (
        <>
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
