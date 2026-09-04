import SetAppointmentReasonModal from "@/Components/modal/submission-form/set-appointment-reason-modal";
import { useReload } from "@/context-provider/reload-provider";
import NotifDisplayLayout from "@/Layouts/notif-display-layout";
import { AppointmentService } from "@/others/services/appointment-service";
import { showOutputModal, showWarningModal } from "@/others/function";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const AppointmentNotification = (props) => {
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const { loadRegister } = useReload();
  const [data, setData] = useState(props.notif);
  const [data2, setData2] = useState({
    user_id: props.user.id,
    reason: ''
  })

  // Fix malformed JSON
  const content = JSON.parse(data.content.replace(/'/g, '"'));

  const isAppointment = data.notif_type === "appointment";
  const isPending = content.accept === null;

  // Student who receives the notification
  const receiver =
    props.user.id === data.receiver_id &&
    props.user.role !== "sub_admin";

  // Prefect who sent the notification
  const isSender = props.user.id === data.receiver_id;

  // ----------------------------------------
  // FIXED TITLE LOGIC FOR BOTH SCHED & RESCHED
  // ----------------------------------------
  const getMessageTitle = () => {
    const studentName = `${data.sender.first_name} ${data.sender.middle_name} ${data.sender.last_name}`;
    const responded = content.accept !== null;
    const isAccepted = content.accept === true;
    const typeText =
      content.type === "sched" ? "appointment" : "rescheduled appointment";

    // -----------------------------
    // RECEIVER VIEW (student)
    // -----------------------------
    if (receiver) {
      if (responded) {
        return isAccepted
          ? `You have accepted the ${typeText}.`
          : `You have declined the ${typeText}.`;
      }
      return content.receiver_notif_message; // original message
    }

    // -----------------------------
    // SENDER VIEW (prefect)
    // -----------------------------
    if (isSender) {
      if (!responded) {
        return content.sender_notif_message; // original scheduling message
      }

      return isAccepted
        ? `${studentName} has accepted the ${typeText}.`
        : `${studentName} has declined the ${typeText}.`;
    }

    return "Appointment Notification";
  };


  // ----------------------------------------
  // ACCEPT / DECLINE LOGIC
  // ----------------------------------------
  const handleResponse = (action, type, notifId) => {
    const isAccept = action === "accept";
    const isSched = type === "sched"; // sched or resched

    const title = isAccept
      ? isSched
        ? "Accept the Appointment?"
        : "Accept the Rescheduled Appointment?"
      : isSched
      ? "Decline the Appointment?"
      : "Decline the Rescheduled Appointment?";

    const buttonText = isAccept
      ? isSched
        ? "Accept Appointment"
        : "Accept Reschedule"
      : isSched
      ? "Decline Appointment"
      : "Decline Reschedule";

    const successMsg = isAccept
      ? isSched
        ? "Appointment Accepted Successfully"
        : "Rescheduled Appointment Accepted Successfully"
      : isSched
      ? "Appointment Declined Successfully"
      : "Rescheduled Appointment Declined Successfully";

    const errorMsg = isAccept
      ? isSched
        ? "Error Accepting Appointment"
        : "Error Accepting Reschedule"
      : isSched
      ? "Error Declining Appointment"
      : "Error Declining Reschedule";

    // ACCEPT LOGIC
    if (isAccept) {
      showWarningModal(
        title,
        buttonText,
        "Cancel",
        () => {
          loadRegister(true, "text-wait", "Processing Request...");

          AppointmentService.respondWithSetter(
            {
              id: notifId,
              action: "accept",
              appointment_id: content?.id ?? 0,
            },
            (response) => setData(response.notif),
            () => {
              showOutputModal(
                successMsg,
                's',
                () => {
                  loadRegister(false)
                  window.location.reload()
                }
              )
            },
            () => {
              showOutputModal(
                errorMsg,
                'e',
                () => {
                  loadRegister(false)
                }
              )
            }
          );
        }
      );
      return;
    }

    // DECLINE → show modal
    setReasonModalOpen(true);
  };

  return (
    <>
      {/* DECLINE MODAL */}
      <SetAppointmentReasonModal
        close={reasonModalOpen}
        closeModal={setReasonModalOpen}
        pd={["px-10", "py-7"]}
        isEnableOuterClose={true}
        user_id={props.user.user_id}
        data={data2}
        setData={setData2}
        decline_title={
          content.type === "sched"
            ? "Are You Sure You Want to Decline the Appointment?"
            : "Are You Sure You Want to Decline the Rescheduled Appointment?"
        }
        decline_btn={
          content.type === "sched"
            ? "Decline Appointment"
            : "Decline Reschedule"
        }
        sendData={() => {
          const successMsg =
            content.type === "sched"
              ? "Appointment Declined Successfully"
              : "Rescheduled Appointment Declined Successfully";

          const errorMsg =
            content.type === "sched"
              ? "Error Declining Appointment"
              : "Error Declining Reschedule";

          loadRegister(
            true,
            "text-wait",
            content.type === "sched"
              ? "Declining Appointment..."
              : "Declining Rescheduled Appointment..."
          );

          AppointmentService.respondWithSetter(
            {
              id: props.notif.id,
              reason: data2.reason,
              action: "decline",
            },
            (response) => setData(response.notif),
            () => {
              showOutputModal(
                successMsg,
                's',
                () => {
                  loadRegister(false)
                  window.location.reload()
                }
              )
            },
            () => {
              showOutputModal(
                errorMsg,
                'e',
                () => {
                  loadRegister(false)
                }
              )
            }
          );
        }}
      />

        <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
          <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-8">

            {/* TITLE */}
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              {getMessageTitle()}
            </h1>

            {/* DETAILS */}
            <div className="border-t border-b py-5 mb-6">
              <p className="mb-3 text-gray-700">
                <span className="font-semibold">Date of Appointment:</span>{" "}
                {content.date_appoint}
              </p>
              <p className="mb-3 text-gray-700">
                <span className="font-semibold">Time:</span>{" "}
                {content.time_appoint}
              </p>
              <p className="text-gray-700 italic">{content.reason}</p>
            </div>

            {/* ACTION BUTTONS FOR STUDENT */}
            {isAppointment && isPending && receiver && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  onClick={() => setReasonModalOpen(true)}
                >
                  {content.type === "sched"
                    ? "Decline Appointment"
                    : "Decline Reschedule"}
                </button>

                <button
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  onClick={() =>
                    handleResponse("accept", content.type, data.id)
                  }
                >
                  {content.type === "sched"
                    ? "Accept Appointment"
                    : "Accept Reschedule"}
                </button>
              </div>
            )}

            {/* FINAL STATUS */}
            {isAppointment && !isPending && (
              <div className="text-center mt-8">
                <div
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg shadow-sm 
                  ${content.accept 
                    ? "bg-green-100 text-green-700 border border-green-300" 
                    : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {content.accept ? <CheckCircle2 size={20} /> : <XCircle size={20} />}

                  <span className="font-semibold text-lg">
                    {content.type === "sched"
                      ? `Appointment ${content.accept ? "Accepted" : "Declined"}`
                      : `Rescheduled Appointment ${
                          content.accept ? "Accepted" : "Declined"
                        }`}
                  </span>
                </div>
              </div>

            )}
          </div>
        </div>
    </>
  );
}

AppointmentNotification.layout = (page) => <NotifDisplayLayout user={page.props.user}>{page}</NotifDisplayLayout>

export default AppointmentNotification;
