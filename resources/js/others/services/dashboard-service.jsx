import { APIRequest } from "../classes/api-req";

export const DashboardService = {
    getBargraph(filter, setter) {
        const api = new APIRequest("/api/bargraph", "post", { filter }, setter);
        api.fetchData();
    },
    getActiveUsers(setter) {
        const api = new APIRequest("/dashboard/active-users", "get", {}, setter);
        api.fetchData();
    },
};
