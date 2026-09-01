import AuthLayout from "@/Layouts/auth-layout";
import { useState, useEffect } from "react";
import AppointmentList from "@/Components/list/appointment-available-slot-list";
import ScheduledUserModal from "@/Components/modal/view/view-scheduled-user-modal";
import { APIRequest } from "@/others/classes/api-req";
import AppointmentModal from "@/Components/modal/submission-form/set-appointment-modal";
import Reload from "@/Components/reload/reload";
import { showWarningModal } from "@/others/function";
import Calendar from "@/Components/schedule/calendar";
import ViewToggleBtn from "@/Components/button/view-toggle-btn";

const PrefectAppointment2 = (props) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthDates, setMonthDates] = useState(null);
  const [appointmentId, setAppointmentId] = useState("");
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [choose, setChoose] = useState('g')
  

  const [appoint, openAppoint] = useState(false);
  const [formLabel, setFormLabel] = useState("");

  const [valid, isValid] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [reload, setReload] = useState(false);
  const [reloadType, setReloadType] = useState("");
  const [reloadLabel, setReloadLabel] = useState("");
  const [status, setStatus] = useState('pending')

  // --- Month utilities ---
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  function formatToYMD(date) {
    // Match the "Mon Dec 01 2025" part
    const match = date.match(/[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}/);
    if (!match) return null;

    const dateObj = new Date(match[0]);  // JS Date object
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  useEffect(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    setMonthDates(null)
    const api = new APIRequest(
      '/calendar/appointment/get/list', 
      'post', 
      { month_year: getMonthValue(selectedMonth) }, 
        (response) => {
          // response = [{ appoint_date: "2025-01-01", user_count: 3 }, ...]

          // Convert API result into map for quick lookup
          const countMap = {};
          response.forEach((item) => {
            countMap[item.appoint_date] = item.user_count;
          });
          console.log(countMap)


          // 3. Merge data: build final object list
          const merged = daysInMonth
            .map((day) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const readable = formatToYMD(dateStr)



              return {
                date: dateStr,
                count: countMap[readable] ?? 0
              };
            });

          console.log(merged)
        setMonthDates(merged);
      }
    )
    api.fetchData()
  }, [selectedMonth])

  useEffect(() => {
    const date = new Date()
    const id =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

    const api = new APIRequest(
        `/appointment/schedule/${id}/pending`,
        "post",
        {},
        setData
    );
    api.fetchData();
  }, [])

  const handlePrevMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() - 1);
    setSelectedMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + 1);
    setSelectedMonth(newMonth);
  };

  const handleSelectDate = (e) => {
    const [year, month] = e.target.value.split("-"),
          newMonth = new Date(year, month - 1);
    setSelectedMonth(newMonth);
  };

  const getMonthValue = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  const selectViewAppointment = (date, type = 'pending') => {
    const d = new Date(date);
    const id =
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0");

    setDate(d);
    setStatus(type)
    setData(null);
    const api = new APIRequest(`/appointment/schedule/${id}/${type}`, "post", {}, setData);
    api.fetchData();
  };

  const actionEvent = (type, id) => {
    const api = new APIRequest(null, "post", {}, setData);
    switch (type) {
      case "cancel":
        showWarningModal(
          "Are You Sure You Want To Cancel This Appointment?",
          "Cancel Appointment",
          "Close",
          () => {
            api.setLink(`/appointment/cancel`);
            api.setData({ appointment_id: id });
            api.setSetter(setData);
            api.setSuccess(successCancel);
            api.setError(error);
            loadRegister(true, "text-wait", "Cancelling The Appointment.");
            api.fetchData();
          }
        )
        break;
    }
  };

  const openAppointmentModal = (date) => {
    openAppoint(true);
    setDate(date);
    setFormLabel(`Schedule for ${new Date(date).toDateString()} Appointment`);
  };

  const openReschedAppointmentModal = (d, reschedUser, id) => {
    openAppoint(true);
    setDate(d);
    setSelectedUser([reschedUser]);
    setAppointmentId(id);
    setFormLabel(`Re-Schedule for ${new Date(date).toDateString()} Appointment`);
  };

  const successSched = () => loadRegister(true, "success", "New Appointment Created Successfully");
  const successCancel = () => loadRegister(true, "success", "Appointment Canceled Successfully");
  const error = () => loadRegister(true, "error", "There was an Error. Please Try Again");

  const isReload = () => (reload ? "opacity-1 z-50" : "opacity-0 z-[-1]");
  const loadRegister = (r, t, l) => {
    setReload(r);
    setReloadType(t);
    setReloadLabel(l);
  };

  return (
    <>
      <Reload
        transition={isReload()}
        type={reloadType}
        label={reloadLabel}
        onClose={setReload}
      />

      <AppointmentModal
        label={formLabel}
        close={appoint}
        closeModal={openAppoint}
        pd={["px-5", "py-7"]}
        isEnableOuterClose={true}
        date={date}
        id={props.user.id}
        reload={loadRegister}
        user_type={props.user.role}
        student_parent_list={props.student_parent_list}
        isValid={isValid}
        reschedUser={selectedUser}
        appointmentId={appointmentId}
        setReschedUser={setSelectedUser}
        setData={setData}
      />

        <div className="w-full py-4">
            {/* Header */}
            <div className="flex flex-col pb-3 sm:flex-row w-full justify-between items-start gap-3">
              <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">APPOINTMENT</h1>

              {/* Month Picker */}
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white px-3 py-2 rounded-xl shadow-sm shadow-black/10">
                <button
                  onClick={handlePrevMonth}
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  ←
                </button>

                <input
                  type="month"
                  value={getMonthValue(selectedMonth)}
                  onChange={handleSelectDate}
                  className="cursor-pointer border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                  onClick={handleNextMonth}
                  className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  →
                </button>
              </div>
              <div className="flex sm:justify-end">
                <ViewToggleBtn
                  defaultView={choose}
                  onChange={setChoose}
                />
              </div>
            </div>
          </div>

          {/* ✅ Appointment Section */}
          <div className="flex flex-col lg:flex-row gap-5 w-full">
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md shadow-black/20 w-full lg:w-1/2">
              {choose == 'g'
              ?
              <Calendar
                list={monthDates}
                events={[selectViewAppointment, openAppointmentModal]}
              />
              :
              <AppointmentList
                list={monthDates}
                events={[selectViewAppointment, openAppointmentModal]}
              />}
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md shadow-black/20 w-full lg:w-1/2">
              <ScheduledUserModal.Body
                data={data}
                user={selectedUser}
                date={date}
                resched={openReschedAppointmentModal}
                actionEvent={actionEvent}
                statusEvent={selectViewAppointment}
                status={status}
                setStatus={setStatus}
              />
            </div>
          </div>
        </div>
    </>
  );
};

PrefectAppointment2.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default PrefectAppointment2;
