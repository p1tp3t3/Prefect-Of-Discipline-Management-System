import LogInForm from "@/Components/log-in-form";
import { Head } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import Reload from "@/Components/reload/reload";
import "./style.css";
import { useState } from "react";
import GuestLayout from "@/Layouts/guest-layout";
import axios from "axios";
import { showOutputModal } from "@/others/function";
import background from '@/images/bg-pilar2.jpg'


const LogIn = () => {
    const route = useRoute();

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
        if (submitting) return; // avoid double submit

        setSubmitting(true);
        setReload(true);

        axios
            .post(route("log-in"), data)
            .then((res) => {

                // Show success modal FIRST
                showOutputModal("Login Successfully", "s", () => {
                    localStorage.setItem("show-login-success", "1");
                    localStorage.setItem("is-unresolved-complaint-modal-clicked", true)
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
                console.log(backend)
                setValidationError({
                    username: backend.username || "",
                    password: backend.password || "",
                });
            });
    };

    return (
        <>
            <Head title="Pilar College Prefect of Discipline of the Higher Education Department" />

            <Reload transition={reload ? "opacity-1 z-20" : "opacity-0"} type="logo" />

            <div className="w-full h-[100vh]">
                <div className="flex w-full h-full">
                    <div className="w-full h-full relative">
                        <div className="absolute w-full h-full bg-[#000000a6]"></div>
                        <p className="text-white text-[3em] font-bold absolute frm px-10 mt-10">Hello Welcome! Praised Be Jesus And Mary</p>
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

export default LogIn;
