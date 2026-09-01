import { replaceUnderScoreToSpace, toTitleCase } from "@/others/function"
import Reload from "@/Components/reload/reload"
import { useState } from "react";
import AuthLayout from "@/Layouts/auth-layout";
import AccountSettingsForm from "@/Components/other/account-settings-form";


const UserAccountSettings = (props) => {
    const [tab, setTab] = useState("account_settings");
    const [reload, setReload] = useState(false);
    const [reloadType, setReloadType] = useState("");
    const [reloadLabel, setReloadLabel] = useState("");

    const loadRegister = (r, t = "", l = "") => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };

    return (
        <>
            <Reload
                transition={reload ? "opacity-1 z-50" : "opacity-0 z-[-1]"}
                type={reloadType}
                label={reloadLabel}
                onClose={(e) => setReload(e)}
            />

            <div className="w-full md:w-[45rem] mx-auto py-4">
                <div className="w-full grid gap-5 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <h1 className="text-[1.5em] font-bold pb-4">
                            {toTitleCase(replaceUnderScoreToSpace(tab))}
                        </h1>
                    </div>
                </div>

                <AccountSettingsForm
                    user={props.user}
                    targetAccount={props.otherUserAccount}
                    reload={loadRegister}
                />
            </div>
        </>
    );
};

UserAccountSettings.layout = (page) => <AuthLayout user={page.props.user} program={page.props.program_name}>{page}</AuthLayout>



export default UserAccountSettings
