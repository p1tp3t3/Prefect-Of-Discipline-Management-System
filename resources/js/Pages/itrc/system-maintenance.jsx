import AuthLayout from "@/Layouts/auth-layout";
import { useState, useEffect } from "react";
import Switch from "@/Components/button/switch-btn";
import ActionBtn from "@/Components/button/action-btn";
import Reload from "@/Components/reload/reload";
import { APIRequest } from "@/others/classes/api-req";
import { Broadcast } from "@/others/classes/broadcast-cofiguration";
import { readableDate, readableTime, showOutputModal, showWarningModal } from "@/others/function";

const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const backupTypeLabel = { database: "Database", storage: "Storage", full: "Full System" };

const SystemMaintenance = (props) => {
    const [activeTab, setActiveTab] = useState("maintenance_mode");

    const [maintenanceMode, setMaintenanceMode] = useState(!!props.maintenance_mode),
          [togglingMode, setTogglingMode] = useState(false);

    const [reload, setReload] = useState(false),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState("");

    const loadRegister = (r, t = "", l = "") => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };

    useEffect(() => {
        new Broadcast(
            'public',
            'maintenance',
            'MaintenanceModeToggled',
            (e) => setMaintenanceMode(!!e.enabled)
        ).configure('maintenance mode status');
    }, []);

    const handleToggleMaintenanceMode = () => {
        if (togglingMode) return;
        setTogglingMode(true);

        const next = !maintenanceMode;
        const api = new APIRequest(
            '/maintenance/mode/toggle',
            'post',
            { enabled: next },
            (res) => {
                setMaintenanceMode(!!res.maintenance_mode);
                setTogglingMode(false);
            },
            () => {},
            () => setTogglingMode(false)
        );
        api.fetchData();
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

                {/* Page Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    System Maintenance
                </h1>

                {/* Tabs */}
                <div className="flex flex-wrap border-b border-gray-200">
                    <button
                        className={`px-3 sm:px-4 py-2 ${
                            activeTab === "maintenance_mode"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-600"
                        }`}
                        onClick={() => setActiveTab("maintenance_mode")}
                    >
                        Maintenance Mode
                    </button>
                    <button
                        className={`px-3 sm:px-4 py-2 ${
                            activeTab === "backup"
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-600"
                        }`}
                        onClick={() => setActiveTab("backup")}
                    >
                        Backup
                    </button>
                </div>

                <div className="py-6 sm:py-10">
                    {activeTab === "maintenance_mode" && (
                        <div className="grid gap-5">
                            <div className="max-w-[35rem] flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-md px-5 py-4">
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        Maintenance Mode
                                    </div>
                                    <p className="text-[0.85em] text-gray-500">
                                        {maintenanceMode
                                            ? 'The system is currently locked down. Only super admins can sign in.'
                                            : 'The system is accessible to everyone as normal.'}
                                    </p>
                                </div>
                                <Switch
                                    checked={maintenanceMode}
                                    onChange={handleToggleMaintenanceMode}
                                    effect={['bg-gray-300', 'bg-red-600']}
                                />
                            </div>

                            <div className="w-full grid gap-2">
                                <div className="text-[0.85em] font-semibold text-gray-700">
                                    Live Preview — what a regular visitor sees right now
                                </div>
                                <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                                    <iframe
                                        key={maintenanceMode}
                                        src="/maintenance/preview"
                                        title="Maintenance preview"
                                        className="w-full h-[24rem] border-0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "backup" && (
                        <BackupTab reload={loadRegister} />
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

const BackupTab = ({ reload }) => {
    const [tab, setTab] = useState("create");
    const [backups, setBackups] = useState([]);
    const [creating, setCreating] = useState(null);

    const fetchBackups = () => {
        const api = new APIRequest("/maintenance/backups", "get", {}, (res) => {
            setBackups(res.backups || []);
        });
        api.fetchData();
    };

    useEffect(() => {
        fetchBackups();
    }, []);

    const createBackup = (type, endpoint, label) => {
        if (creating) return;
        setCreating(type);
        reload(true, "text-wait", `Creating ${label} backup. This may take a while`);

        const api = new APIRequest(
            endpoint,
            "post",
            {},
            () => {},
            () => {
                reload(true, "success", `${label} Backup Created Successfully`);
                setCreating(null);
                fetchBackups();
            },
            (err) => {
                reload(true, "error", err?.response?.data?.message || `Failed To Create ${label} Backup`);
                setCreating(null);
            }
        );
        api.sendPostData();
    };

    const deleteBackup = (name) => {
        showWarningModal(
            `Are You Sure You Want To Delete "${name}"?`,
            "Delete Backup",
            "Cancel",
            () => {
                const api = new APIRequest(
                    `/maintenance/backups/${name}/delete`,
                    "post",
                    {},
                    () => {},
                    () => {
                        showOutputModal("Backup Deleted Successfully", "s");
                        fetchBackups();
                    },
                    () => showOutputModal("Failed To Delete Backup", "e")
                );
                api.sendPostData();
            }
        );
    };

    return (
        <div className="grid gap-5">
            {/* Sub Tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    className={`px-3 py-1.5 rounded-full text-[0.85em] border ${
                        tab === "create"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setTab("create")}
                >
                    Create Backup
                </button>
                <button
                    className={`px-3 py-1.5 rounded-full text-[0.85em] border ${
                        tab === "history"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setTab("history")}
                >
                    Backup History
                </button>
            </div>

            {tab === "create" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <BackupCard
                        icon="fa-database"
                        title="Database"
                        description="Export a full SQL dump of the database."
                        buttonLabel="Backup Database"
                        loading={creating === "database"}
                        disabled={!!creating}
                        onClick={() => createBackup("database", "/maintenance/backups/database", "Database")}
                    />
                    <BackupCard
                        icon="fa-folder"
                        title="Storage"
                        description="Zip all uploaded files (profile pictures, evidence, documents)."
                        buttonLabel="Backup Storage"
                        loading={creating === "storage"}
                        disabled={!!creating}
                        onClick={() => createBackup("storage", "/maintenance/backups/storage", "Storage")}
                    />
                    <BackupCard
                        icon="fa-box-archive"
                        title="Full System"
                        description="Database and storage combined into a single archive."
                        buttonLabel="Full System Backup"
                        loading={creating === "full"}
                        disabled={!!creating}
                        onClick={() => createBackup("full", "/maintenance/backups/full", "Full System")}
                    />
                </div>
            )}

            {tab === "history" && (
                <div className="bg-white border border-gray-200 rounded-md px-5 py-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[0.85em]">
                            <thead>
                                <tr className="text-left border-b border-gray-200 text-gray-600">
                                    <th className="py-2 pr-3">Name</th>
                                    <th className="py-2 pr-3">Type</th>
                                    <th className="py-2 pr-3">Size</th>
                                    <th className="py-2 pr-3">Created</th>
                                    <th className="py-2 pr-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {backups.length !== 0 ? (
                                    backups.map((b, i) => (
                                        <tr key={i} className="border-b border-gray-100">
                                            <td className="py-2 pr-3 break-all">{b.name}</td>
                                            <td className="py-2 pr-3">{backupTypeLabel[b.type] ?? b.type}</td>
                                            <td className="py-2 pr-3">{formatBytes(b.size)}</td>
                                            <td className="py-2 pr-3">
                                                {readableDate(b.created_at)} ({readableTime(b.created_at)})
                                            </td>
                                            <td className="py-2 pr-3">
                                                <div className="flex gap-2">
                                                    <a href={`/maintenance/backups/${b.name}/download`}>
                                                        <ActionBtn className="bg-green-600 hover:bg-green-700">
                                                            Download
                                                        </ActionBtn>
                                                    </a>
                                                    <ActionBtn
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={() => deleteBackup(b.name)}
                                                    >
                                                        Delete
                                                    </ActionBtn>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-gray-500">
                                            No Backups Yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const BackupCard = ({ icon, title, description, buttonLabel, loading, disabled, onClick }) => (
    <div className="bg-white border border-gray-200 rounded-md p-5 grid gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 grid place-items-center text-lg">
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
            <div className="font-semibold text-gray-800">{title}</div>
            <p className="text-[0.85em] text-gray-500">{description}</p>
        </div>
        <ActionBtn
            className={`bg-blue-600 hover:bg-blue-700 justify-self-start ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={disabled ? () => {} : onClick}
        >
            {loading ? "Creating..." : buttonLabel}
        </ActionBtn>
    </div>
);

SystemMaintenance.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default SystemMaintenance;
