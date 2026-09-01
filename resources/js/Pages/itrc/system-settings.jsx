import { useState } from "react";
import AuthLayout from "@/Layouts/auth-layout";
import FormTextfield from "@/Components/input/form-input";
import FormButton from "@/Components/button/button";
import Reload from "@/Components/reload/reload";
import AccountSettingsForm from "@/Components/other/account-settings-form";
import { APIRequest } from "@/others/classes/api-req";
import { change, showOutputModal } from "@/others/function";

const SystemSettings = (props) => {
    const [activeTab, setActiveTab] = useState("login_portal");
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

            <div className="grid gap-8 px-4 sm:px-6 lg:px-10">
                <div className="pt-6 sm:pt-10 grid w-full gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                        System Settings
                    </h1>

                    {/* Tabs */}
                    <div className="flex flex-wrap border-b border-gray-200">
                        <button
                            className={`px-3 sm:px-4 py-2 ${
                                activeTab === "system_name"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("system_name")}
                        >
                            System Name
                        </button>
                        <button
                            className={`px-3 sm:px-4 py-2 ${
                                activeTab === "login_portal"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("login_portal")}
                        >
                            Super Admin Login Portal
                        </button>
                        <button
                            className={`px-3 sm:px-4 py-2 ${
                                activeTab === "mail"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("mail")}
                        >
                            Mail Configuration
                        </button>
                        <button
                            className={`px-3 sm:px-4 py-2 ${
                                activeTab === "account"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => setActiveTab("account")}
                        >
                            Account Settings
                        </button>
                    </div>

                    <div className="py-6 sm:py-10">
                        {activeTab === "system_name" && (
                            <SystemNameTab
                                appName={props.app_name}
                                reload={loadRegister}
                            />
                        )}

                        {activeTab === "login_portal" && (
                            <LoginPortalPasswordTab
                                hasPassword={props.has_login_portal_password}
                                reload={loadRegister}
                            />
                        )}

                        {activeTab === "mail" && (
                            <MailConfigTab
                                mailConfig={props.mail_config}
                                reload={loadRegister}
                            />
                        )}

                        {activeTab === "account" && (
                            <AccountSettingsForm
                                user={props.user}
                                targetAccount={props.user}
                                reload={loadRegister}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const SystemNameTab = ({ appName, reload }) => {
    const [name, setName] = useState(appName || "");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("System name is required");
            return;
        }
        setError("");

        reload(true, "text-wait", "Updating system name...");

        const api = new APIRequest(
            "/system-settings/app-name",
            "post",
            { app_name: name },
            () => {},
            () => {
                reload(true, "success", "System Name Updated Successfully");
            },
            () => {
                reload(true, "error", "Failed to Update System Name");
            }
        );
        api.fetchData();
    };

    return (
        <div className="max-w-[30rem]">
            <div className="bg-white rounded-md shadow-black/20 shadow-sm p-5 sm:p-8 grid gap-6">
                <p className="text-gray-700">
                    This is the system's branded name shown in the sidebar across the app.
                </p>
                <form onSubmit={handleSubmit} className="grid gap-5">
                    <FormTextfield
                        label="System Name"
                        name="app_name"
                        val={name}
                        change={(e) => setName(e.target.value)}
                        error={error}
                        errorAsterisk={!!error}
                    />
                    <div className="grid justify-end">
                        <FormButton type="submit" label="Save System Name" />
                    </div>
                </form>
            </div>
        </div>
    );
};

const LoginPortalPasswordTab = ({ hasPassword, reload }) => {
    const [data, setData] = useState({ password: "", password_confirmation: "" });
    const [error, setError] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        reload(true, "text-wait", "Updating login portal password...");

        const api = new APIRequest(
            "/system-settings/login-portal-password",
            "post",
            data,
            () => {},
            () => {
                reload(true, "success", "Login Portal Password Updated Successfully");
                setData({ password: "", password_confirmation: "" });
                setError({});
            },
            (err) => {
                reload(false);
                setError(err?.response?.data?.errors || {});
                if (err?.response?.data?.message && !err?.response?.data?.errors) {
                    showOutputModal(err.response.data.message, "e");
                }
            }
        );
        api.fetchData();
    };

    return (
        <div className="max-w-[30rem]">
            <div className="bg-white rounded-md shadow-black/20 shadow-sm p-5 sm:p-8 grid gap-6">
                <div>
                    <p className="text-gray-700">
                        This password unlocks the super-admin-only login form at{" "}
                        <code className="bg-gray-100 px-1 rounded">/super-admin/login/&lt;password&gt;</code>{" "}
                        while the system is in maintenance mode.
                    </p>
                    <p className="text-[0.85em] text-gray-500 mt-2">
                        {hasPassword
                            ? "A login portal password is currently set."
                            : "No password has been set yet — the default from your environment configuration is in use."}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-5">
                    <FormTextfield
                        label="New Password"
                        name="password"
                        type="password"
                        val={data.password}
                        change={(e) => change(e, setData)}
                        enableShowPassword={true}
                        error={error.password?.[0]}
                    />
                    <FormTextfield
                        label="Confirm New Password"
                        name="password_confirmation"
                        type="password"
                        val={data.password_confirmation}
                        change={(e) => change(e, setData)}
                        enableShowPassword={true}
                    />
                    <div className="grid justify-end">
                        <FormButton type="submit" label="Update Password" />
                    </div>
                </form>
            </div>
        </div>
    );
};

const MailConfigTab = ({ mailConfig, reload }) => {
    const [data, setData] = useState({
        username: mailConfig?.username || "",
        password: "",
    });
    const [testEmail, setTestEmail] = useState("");
    const [error, setError] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        reload(true, "text-wait", "Saving mail configuration...");

        const api = new APIRequest(
            "/system-settings/mail-config",
            "post",
            data,
            () => {},
            () => {
                reload(true, "success", "Mail Configuration Saved Successfully");
                setData((prev) => ({ ...prev, password: "" }));
                setError({});
            },
            (err) => {
                reload(false);
                setError(err?.response?.data?.errors || {});
            }
        );
        api.fetchData();
    };

    const handleSendTest = (e) => {
        e.preventDefault();
        if (!testEmail) return;

        reload(true, "text-wait", "Sending test email...");

        const api = new APIRequest(
            "/system-settings/mail-config/test",
            "post",
            { test_email: testEmail },
            () => {},
            () => {
                reload(true, "success", "Test Email Sent Successfully. Please Check The Inbox.");
            },
            (err) => {
                reload(true, "error", err?.response?.data?.message || "Failed To Send Test Email");
            }
        );
        api.fetchData();
    };

    return (
        <div className="max-w-[40rem] grid gap-8">
            <div className="bg-white rounded-md shadow-black/20 shadow-sm p-5 sm:p-8">
                <h2 className="text-lg font-semibold mb-1">SMTP Configuration</h2>
                <p className="text-[0.85em] text-gray-500 mb-5">
                    Host, port, encryption, and the from-address are fixed in the server's environment configuration.
                    Only the SMTP account credentials are editable here.
                </p>
                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormTextfield
                            label="SMTP Username"
                            name="username"
                            val={data.username}
                            change={(e) => change(e, setData)}
                            error={error.username?.[0]}
                        />
                        <FormTextfield
                            label="SMTP Password"
                            name="password"
                            type="password"
                            val={data.password}
                            change={(e) => change(e, setData)}
                            enableShowPassword={true}
                            error={error.password?.[0]}
                        />
                    </div>
                    <div className="grid justify-end">
                        <FormButton type="submit" label="Save Mail Configuration" />
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-md shadow-black/20 shadow-sm p-5 sm:p-8">
                <h2 className="text-lg font-semibold mb-2">Send Test Email</h2>
                <p className="text-[0.85em] text-gray-500 mb-5">
                    Send a test message using the mail configuration saved above to confirm it can actually deliver mail.
                </p>
                <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row gap-3 sm:items-end">
                    <div className="w-full sm:max-w-[20rem]">
                        <FormTextfield
                            label="Send To"
                            name="test_email"
                            val={testEmail}
                            change={(e) => setTestEmail(e.target.value)}
                        />
                    </div>
                    <FormButton type="submit" label="Send Test Email" />
                </form>
            </div>
        </div>
    );
};

SystemSettings.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default SystemSettings;
