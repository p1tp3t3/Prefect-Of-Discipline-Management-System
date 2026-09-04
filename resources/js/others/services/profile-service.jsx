import { APIRequest } from "../classes/api-req";

export const ProfileService = {
    updateProfile(username, data, success, error) {
        const api = new APIRequest(`/profile/${username}/edit`, "post", data, () => {}, success, error);
        api.sendPostData();
    },
};
