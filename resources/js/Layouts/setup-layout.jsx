import bg from "@/images/bg-pilar.jpg"
import ProfilePic from "@/Components/other/profile-pic"
import { Link, router } from "@inertiajs/react"
import { ReloadProvider } from "@/context-provider/reload-provider"
import { LogOut, Info } from "lucide-react"

const SetupLayout = ({ children, user }) => {
    // Profile and password are only actually saved together, at the very
    // end (AccountSetupController::complete) — so the step shown here comes
    // from which page we're on, not from a DB flag that doesn't flip until
    // that final submit.
    const step = window.location.pathname.startsWith('/verify-email')
        ? 1
        : window.location.pathname.startsWith('/settings/')
        ? 3
        : 2

    return (
        <ReloadProvider>
        <div className="w-full min-h-screen bg-gray-100">
            <header
                className="w-full relative bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <div className="bg-black/70 absolute w-full h-full left-0 top-0"></div>
                <div className="relative z-10 w-full px-5 py-3 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <ProfilePic src={"/default-pic/pilar.png"} size={2.5} />
                        <div>
                            <h1 className="text-[1em] font-bold">PilarPODHED</h1>
                            <h1 className="text-[0.7em]">Pilar College of Zamboanga City, Inc.</h1>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.visit('/log-out')}
                        className="text-[0.85em] px-3 py-1.5 rounded border border-white/50 hover:bg-white/10"
                    >
                        <LogOut size={14} className="mr-1 inline" /> Log Out
                    </button>
                </div>
            </header>

            <div className="w-full max-w-[45rem] mx-auto px-4 py-6">
                <div className="w-full bg-blue-50 border border-blue-200 text-blue-900 text-[0.85em] rounded-md px-4 py-3 mb-5 flex gap-2 items-start justify-between">
                    <div className="flex gap-2 items-start">
                        <Info size={14} className="mt-0.5" />
                        <span>
                            Step {step} of 3 &mdash; {step === 1 ? "verify your email" : step === 2 ? "complete your profile information" : "set a new password"} before continuing.
                            This account was created with default details and must be updated first.
                        </span>
                    </div>
                    {step === 3 && (
                        <Link href={`/profile/${user.username}/edit`} className="whitespace-nowrap underline shrink-0">
                            Back to Profile
                        </Link>
                    )}
                </div>
                {children}
            </div>
        </div>
        </ReloadProvider>
    )
}
export default SetupLayout
