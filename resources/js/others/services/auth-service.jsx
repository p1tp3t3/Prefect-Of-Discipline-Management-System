import { APIRequest } from "../classes/api-req";

export const AuthService = {
    resendVerificationEmail(success, error) {
        const api = new APIRequest("/email/verification-notification", "post", {}, () => {}, success, error);
        api.sendPostData();
    },
    sendOtp(pin, username, email, type, success, error) {
        const api = new APIRequest(
            "/forgot-password/otp",
            "post",
            { pin, username, email, type: type != null ? type : "email" },
            () => {},
            success,
            error
        );
        api.sendPostData();
    },
    verifyOtp(pin, email, success, error) {
        const api = new APIRequest("/otp/verify", "post", { pin, email }, null, success, error);
        api.sendPostData();
    },
};
