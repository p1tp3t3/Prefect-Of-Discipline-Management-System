import UpModal from "../up-modal"
import { Button, Chip } from "@mui/material"
import { CalendarDays } from "lucide-react"

const AppointmentEventModal = ({ close, closeModal, event, onCancel, onReschedule }) => {
    if (!event) {
        return <UpModal close={close} closeModal={closeModal} isEnableOuterClose={true} bgColor="bg-white" w="w-[26rem]" />
    }

    const { title, start, extendedProps } = event
    const isAccepted = extendedProps.status === "accepted"

    return (
        <UpModal close={close} closeModal={closeModal} isEnableOuterClose={true} pd={["px-6", "py-6"]} bgColor="bg-white" w="w-[26rem]">
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-[1.1em] font-bold">{title.replace(" (Pending)", "")}</h1>
                    <Chip
                        label={isAccepted ? "Accepted" : "Pending"}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            backgroundColor: isAccepted ? "#dcfce7" : "#fef3c7",
                            color: isAccepted ? "#15803d" : "#b45309",
                        }}
                    />
                </div>

                <div className="text-[0.85em] text-gray-600 flex items-center gap-2">
                    <CalendarDays size="1em" />
                    {start?.toLocaleString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                </div>

                {(extendedProps.description || extendedProps.reason) && (
                    <div className="text-[0.85em] text-gray-700 bg-gray-50 rounded-md p-3">
                        {extendedProps.description || extendedProps.reason}
                    </div>
                )}

                {isAccepted ? (
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => onReschedule(start, extendedProps.user, extendedProps.appointment_id)}
                            sx={{ textTransform: "none", backgroundColor: "#2563eb", "&:hover": { backgroundColor: "#1d4ed8" } }}
                        >
                            Reschedule
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => onCancel(extendedProps.appointment_id)}
                            sx={{ textTransform: "none", backgroundColor: "#dc2626", "&:hover": { backgroundColor: "#b91c1c" } }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <p className="text-[0.8em] text-gray-500 italic">
                        Waiting for the recipient to accept or decline this appointment.
                    </p>
                )}
            </div>
        </UpModal>
    )
}

export default AppointmentEventModal
