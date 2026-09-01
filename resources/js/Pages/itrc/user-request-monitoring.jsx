import AuthLayout from "@/Layouts/auth-layout"

const UserRequestMonitoring = (props) => {
    return (
        <div>
            <div className="w-full py-10">
                <div className="w-full grid gap-10 relative">
                    <div className="flex items-center">
                        <h1 className="text-[1.7em]">
                            <b>User Request Monitoring</b>
                        </h1>
                    </div>
                    <div className="w-full">
                        <div>
                            <div>

                            </div>
                        </div>
                        {/* Content for user request monitoring goes here */}
                    </div>
                </div>
            </div>
        </div>
    )
}

UserRequestMonitoring.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default UserRequestMonitoring