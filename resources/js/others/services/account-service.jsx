import { APIRequest } from "../classes/api-req";

export const AccountService = {
    deleteAccount(data, success, error) {
        const api = new APIRequest("/super-admin/user-accounts/del", "post", data, null, success, error);
        api.sendPostData();
    },
    activateAll(ids, status, page, setter) {
        const api = new APIRequest("/super-admin/accounts/activation/all-users", "post", { ids, status, page }, setter);
        api.fetchData();
    },
    toggleActivation(username, status) {
        const api = new APIRequest(`/super-admin/accounts/activation/${username}`, "post", { status });
        api.sendPostData();
    },
    updateUserInfo(data, success, error) {
        const api = new APIRequest("/super-admin/account/update", "post", data, () => {}, success, error);
        api.sendPostData();
    },
    updateAccountInfo(payload, success, error) {
        const api = new APIRequest("/account/update", "post", payload, () => {}, success, error);
        api.sendPostData();
    },
    submitPasswordChange(isForceSetup, data, success, error) {
        const url = isForceSetup ? "/account-setup/complete" : "/account/update";
        const api = new APIRequest(url, "post", data, () => {}, success, error);
        api.sendPostData();
    },
    deleteAccountFile(fileName, setter) {
        const api = new APIRequest("/super-admin/user-accounts/file/del", "post", { fileName }, setter);
        api.fetchData();
    },
    previewAccountFile(fileName, setter) {
        const api = new APIRequest(`/api/user-account/file/${fileName}/preview`, "get", {}, setter);
        api.fetchData();
    },
    previewAccountFileEntry(fileName, entry, setter) {
        const api = new APIRequest(`/api/user-account/file/${fileName}/preview-entry?entry=${encodeURIComponent(entry)}`, "get", {}, setter);
        api.fetchData();
    },
};
