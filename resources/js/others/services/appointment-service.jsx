import { APIRequest } from "../classes/api-req";

export const AppointmentService = {
    schedule(isResched, appointmentId, data, setter, success, error) {
        const url = isResched ? `/appointment/update/${appointmentId}` : "/appointment/request";
        const api = new APIRequest(url, "post", data, setter, success, error);
        api.fetchData();
    },
    cancel(appointmentId, success, error) {
        const api = new APIRequest("/appointment/cancel", "post", { appointment_id: appointmentId }, () => {}, success, error);
        api.fetchData();
    },
    respond(id, action, reason, success, error) {
        const api = new APIRequest("/appointment/action", "post", { id, action, reason }, () => {}, success, error);
        api.sendPostData();
    },
    respondWithSetter(data, setter, success, error) {
        const api = new APIRequest("/appointment/action", "post", data, setter, success, error);
        api.sendPostData();
    },
    callIn(data, success, error) {
        const api = new APIRequest("/prefect/call-in", "post", data, () => {}, success, error);
        api.sendPostData();
    },
};
