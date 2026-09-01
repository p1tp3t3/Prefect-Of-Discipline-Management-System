import axios from "axios";

export class APIRequest {
    constructor(
        link = null, 
        method = 'get', 
        data = null, 
        setter = (e) => {},
        success = () => {}, 
        error = () => {}
    ) {
        this.link = link;
        this.data = data;
        this.method = method;
        this.setter = setter;
        this.success = success;
        this.error = error;
        this.headers = {
            "Content-Type": "multipart/form-data",
        };
    }
    sendPostData() {
        axios.post(this.getLink(), this.getData(), {
            headers: this.getHeaders(),
        })
        .then(() => {
            this.getSuccess()();
        })
        .catch((e) => {
            console.log(e);
            this.getError()(e);
        });
    }
    fetchData() {
        switch(this.getMethod()) {
            case "get":
                axios
                    .get(this.getLink(), this.getData(), {
                        headers: this.getHeaders()
                    })
                    .then((data) => {
                        this.getSetter()(data.data);
                        this.getSuccess()();
                    })
                    .catch((e) => {
                        console.log(e);
                        this.getError()(e);
                    });
                break;
            case "post":
                 axios
                    .post(this.getLink(), this.getData(), {
                        headers: this.getHeaders(),
                    })
                    .then((data) => {
                        this.getSetter()(data.data);
                        this.getSuccess()();
                    })
                    .catch((e) => {
                        console.log(e);
                        this.getError()(e);
                    });
                break;
        }
    }
    downloadFile(file) {
        axios({
            url: this.getLink(),
            method: "GET",
            responseType: "blob", // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file); // file name
            document.body.appendChild(link);
            link.click();
            this.getSuccess()()
        })
        .catch((e) => {
            console.log(e);
            this.getError()(e)
        })
    }
    setAPIKey(key) {
        this.apiKey = key
    }
    setLink(link) {
        this.link = link;
    }
    setData(data) {
        this.data = data;
    }
    setMethod(method) {
        this.method = method;
    }
    setHeaders(headers) {
        this.headers = headers;
    }
    setSetter(setter) {
        this.setter = setter;
    }
    setSuccess(success) {
        this.success = success;
    }
    setError(error) {
        this.error = error;
    }
    getAPIKey() {
        return this.apiKey
    }
    getLink() {
        return this.link;
    }
    getData() {
        return this.data;
    }
    getMethod() {
        return this.method;
    }
    getHeaders() {
        return this.headers;
    }
    getSetter() {
        return this.setter;
    }
    getSuccess() {
        return this.success;
    }
    getError() {
        return this.error;
    }
}