import { APIRequest } from "../classes/api-req";

export const PasswordRecoveryService = {
    getContact(username, setter, success, error) {
        const api = new APIRequest(`/contact/${username}`, "post", {}, setter, success, error);
        api.fetchData();
    },
    recover(data, success, error) {
        const api = new APIRequest("/forgot-password/recover", "post", data, () => {}, success, error);
        api.sendPostData();
    },
    resendOtp(pin, type, username) {
        const api = new APIRequest("/forgot-password/otp", "post", { pin, type, username });
        api.sendPostData();
    },
};
