import FormTextfield from "@/Components/input/form-input";
import { change, showWarningModal, showOutputModal } from "@/others/function";
import { useForm } from "@inertiajs/react";
import FormButton from "@/Components/button/button";
import { APIRequest } from "@/others/classes/api-req";
import { useEffect, useState } from "react";

const RecoverPassword = (props) => {
    const { data, setData , post, processing, errors } = useForm({
        username: props.data.username,
        new_password: "",
        password_confirmation: "",
    });

    const [error_password, setErrorPassword] = useState("");
    const [error_new_password, setErrorNewPassword] = useState("");
    const [commonPasswordList, setCommonPasswordList] = useState([]);
    
    useEffect(() => {
        fetch("/storage/list/common-password.txt")
          .then((res) => res.text())
          .then((data) => {
            const lines = data.split(/\r?\n/).filter(Boolean);
            setCommonPasswordList(new Set(lines));
          })
          .catch((x) => console.log(x));
      }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.new_password === "" && data.password_confirmation === "") {
            setErrorNewPassword("New Password is required");
            setErrorPassword("Password Confirmation is required");
            return;
        }
        if (data.new_password === "") {
            setErrorNewPassword("New Password is required");
            setErrorPassword("");
            return;
        }
        if (data.password_confirmation === "") {
            setErrorPassword("Password Confirmation is required");
            setErrorNewPassword("");
            return;
        }
        if (data.new_password !== data.password_confirmation) {
            setErrorPassword("Passwords do not match. Please try again.");
            setErrorNewPassword("");
            return;
        }if (commonPasswordList && commonPasswordList.has(data.new_password.toLowerCase())) {
            setErrorNewPassword("This password is too common. Please choose a stronger one.");
            setErrorPassword("");
            return;
        }

        showWarningModal(
            "Are you sure you want to recover your account?",
            "Recover Account",
            "Cancel",
            () => {
                props.reload(true, "text-wait", "Updating password. Please wait…");
                const api = new APIRequest(
                    "/forgot-password/recover",
                    "post",
                    data,
                    () => {},
                    success,
                    failed
                );
                api.sendPostData();
            }
        );
    };

    const handleChange = (e) => {
        change(e, setData);
    };

    const success = () => {
        props.reload(true, "");
        showOutputModal(
            'Account recovered successfully',
            "s",
            () => {
                setData((prev) => ({
                    ...prev,
                    new_password: "",
                    password_confirmation: "",
                }));
                props.reload(false);
                window.location.href = `/`;
            }
        )
    };

    const failed = () => {
        props.reload(true, "");
        showOutputModal(
            'Failed to recover account. Please try again.',
            "e",
            () => {
                props.reload(false);
            }
        )
    };

    return (
        <div className="bg-white w-[90%] sm:w-[28rem] rounded-lg shadow-lg border border-gray-200">
            <div className="px-6 sm:px-10 py-7 grid gap-8">

                {/* Header Section */}
                <div className="grid gap-2 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Recover Your Password
                    </h1>
                    <p className="text-sm text-gray-600 leading-snug">
                        You’re almost done. Please enter your new password to recover your account.
                    </p>
                </div>

                {/* Form */}
                <form method="post" onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-5">
                        <FormTextfield
                            label="New Password"
                            type="password"
                            name="new_password"
                            id="password"
                            val={data.new_password}
                            error={error_new_password}
                            icon="fa-solid fa-lock"
                            change={handleChange}
                            enableShowPassword={true}
                            req={true}
                        />

                        <FormTextfield
                            label="Re-Enter New Password"
                            type="password"
                            name="password_confirmation"
                            id="password_confirmation"
                            val={data.password_confirmation}
                            error={error_password}
                            icon="fa-solid fa-lock"
                            change={handleChange}
                            enableShowPassword={true}
                            req={true}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <FormButton 
                            label="Save Changes" 
                            type="submit" 
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecoverPassword;
