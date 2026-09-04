import { APIRequest } from "../classes/api-req";

export const TransactionService = {
    getLimit(setter) {
        const api = new APIRequest("/transaction/limit", "get");
        api.setSetter(setter);
        api.fetchData();
    },
    getStatus(setter) {
        const api = new APIRequest("/transaction/status", "get");
        api.setSetter(setter);
        api.fetchData();
    },
};
