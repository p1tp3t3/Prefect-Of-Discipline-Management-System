import { Head } from "@inertiajs/react";

const MaintenanceNotice = () => {
    return (
        <>
            <Head title="Under Maintenance" />

            <div className="w-full h-[100vh] grid place-items-center bg-gray-100 px-6">
                <div className="grid place-items-center gap-4 text-center max-w-[30rem]">
                    <i className="fa-solid fa-screwdriver-wrench text-[3em] text-gray-500"></i>
                    <h1 className="text-[1.5em] font-bold text-gray-800">
                        We'll Be Right Back
                    </h1>
                    <p className="text-gray-600">
                        The system is currently undergoing maintenance. Please check back
                        again shortly.
                    </p>
                </div>
            </div>
        </>
    );
};

export default MaintenanceNotice;
