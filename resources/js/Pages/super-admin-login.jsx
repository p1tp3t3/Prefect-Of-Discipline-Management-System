import LogInForm from "@/Components/log-in-form";
import { Head } from "@inertiajs/react";
import Reload from "@/Components/reload/reload";
import "./style.css";
import { useState } from "react";
import axios from "axios";
import { showOutputModal } from "@/others/function";
import background from '@/images/bg-pilar2.jpg'


const SuperAdminLogin = (props) => {
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    const [reload, setReload] = useState(false);
    const [validationErr, setValidationError] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};

        if (!data.username) {
            errors.username = "Username is required"
            errors.usernameAsterisk = true
        }
        if (!data.password) {
            errors.password = "Password is required"
            errors.passwordAsterisk = true
        };

        setValidationError(errors);

        if (Object.keys(errors).length > 0) return;
        if (submitting) return;

        setSubmitting(true);
        setReload(true);

        axios
            .post(`/super-admin/login/${props.password}`, data)
            .then((res) => {
                showOutputModal("Login Successfully", "s", () => {
                    localStorage.setItem("show-login-success", "1");
                    setData({
                        username: '',
                        password: ''
                    })
                    setReload(false)
                    window.location.reload();
                });
            })
            .catch((err) => {
                setReload(false);
                setSubmitting(false);

                const backend = err.response.data;
                setValidationError({
                    username: backend.username || "",
                    password: backend.password || "",
                });
            });
    };

    return (
        <>
            <Head title="Super Admin Access - Maintenance" />

            <Reload transition={reload ? "opacity-1 z-20" : "opacity-0"} type="logo" />

            <div className="w-full h-[100vh]">
                <div className="flex w-full h-full">
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full bg-[#000000a6]"></div>
                        <p className="text-white text-[3em] font-bold absolute frm px-10 mt-10">
                            System Under Maintenance — Super Admin Access Only
                        </p>
                        <img src={background} alt="" className="h-full object-cover" />
                    </div>
                    <LogInForm
                        submit={handleSubmit}
                        data={data}
                        onchange={handleChange}
                        validationErr={validationErr}
                    />
                </div>
            </div>
        </>
    );
};

export default SuperAdminLogin;
