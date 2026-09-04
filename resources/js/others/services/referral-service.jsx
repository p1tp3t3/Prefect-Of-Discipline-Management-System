import { APIRequest } from "../classes/api-req";

export const ReferralService = {
    create(formData, success, error) {
        const api = new APIRequest("/referral/create", "post", formData, () => {}, success, error);
        api.sendPostData();
    },
    getReferralInfo(id, setter) {
        const api = new APIRequest(`/referral/get/${id}`, "post", {}, setter, () => {}, () => {});
        api.fetchData();
    },
    verify(action, id, setter, success, error) {
        const api = new APIRequest(`/referral/verify/${id}/${action}`, "post", {}, setter, success, error);
        api.fetchData();
    },
};
