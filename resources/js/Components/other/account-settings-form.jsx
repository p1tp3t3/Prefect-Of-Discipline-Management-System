import FormButton from "@/Components/button/button";
import FormTextfield from "@/Components/input/form-input";
import OtpModal from "@/Components/modal/validation/show-otp-modal";
import { useEffect, useState } from "react";
import { change, checkUserExist, checkCurrentPassword, showOutputModal, showWarningModal } from "@/others/function";
import { APIRequest } from "@/others/classes/api-req";
import { Validator } from "@/others/classes/validator";

/**
 * Username/email and password are two independent submissions (separate
 * forms, separate API calls) — changing one never touches the other.
 */
const AccountSettingsForm = ({ user, targetAccount, reload }) => {
    const isAdmin = user.role === "super_admin";
    const isEditingOwnAccount = targetAccount.id === user.id;

    return (
        <div className="w-full pb-5 grid gap-6 relative">
            <AccountInfoForm
                authUser={user}
                targetAccount={targetAccount}
                isAdmin={isAdmin}
                reload={reload}
            />
            <PasswordForm
                authUser={user}
                targetAccount={targetAccount}
                isAdmin={isAdmin}
                isEditingOwnAccount={isEditingOwnAccount}
                reload={reload}
            />
        </div>
    );
};

const AccountInfoForm = ({ authUser, targetAccount, isAdmin, reload }) => {
    const [data, setData] = useState({
        user_id: targetAccount.id,
        username: targetAccount.username,
        email: targetAccount.email,
    });
    const [error, setError] = useState({});
    const [existUsername, setExistUsername] = useState(false);
    const [existEmail, setExistEmail] = useState(false);

    const validate = () => {
        const err = {};

        if (!data.username?.trim()) {
            err.username = "Username is required";
            err.usernameAsterisk = true;
        } else if (data.username.length < 8) {
            err.username = "Username must be at least 8 characters long";
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(data.username)) {
            err.username = "Username must contain both letters and numbers";
        }

        if (isAdmin) {
            if (!data.email?.trim()) {
                err.email = "Email is required";
                err.emailAsterisk = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                err.email = "Please enter a valid email address";
            }
        }

        setError(err);
        return !err.username && !err.email;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const usernameChanged = data.username !== targetAccount.username;
        const emailChanged = data.email !== targetAccount.email;

        if ((existUsername && usernameChanged) || (existEmail && emailChanged)) return;

        const isSelfUpdate = targetAccount.id === authUser.id;

        showWarningModal(
            isSelfUpdate
                ? "Are You Sure You Want To Update Your Username/Email?"
                : `Are You Sure You Want To Update ${targetAccount.profile?.first_name ?? "This User's"}'s Username/Email?`,
            "Update Account Info",
            "Cancel",
            () => {
                reload(true, "text-wait", "Updating account info...");

                const payload = { user_id: data.user_id, username: data.username };
                if (isAdmin) payload.email = data.email;

                const api = new APIRequest(
                    "/account/update",
                    "post",
                    payload,
                    () => {},
                    () => {
                        reload(true, "");
                        showOutputModal("Account Info Updated Successfully", "s", () => {
                            reload(false);
                            window.location.reload();
                        });
                    },
                    () => {
                        reload(true, "");
                        showOutputModal("Failed to Update Account Info", "e", () => reload(false));
                    }
                );

                api.sendPostData();
            }
        );
    };

    return (
        <div className="bg-white px-5 md:px-10 py-8 rounded-lg shadow-sm shadow-black/20">
            <h2 className="text-lg font-semibold mb-5">Username &amp; Email</h2>
            <form onSubmit={handleSubmit} className="grid gap-6">
                <FormTextfield
                    label="Username"
                    name="username"
                    val={data.username}
                    change={(e) => change(e, setData)}
                    checkExists={(e) => checkUserExist('username', e, data.user_id)}
                    setExist={setExistUsername}
                    error={error.username}
                    errorAsterisk={error.usernameAsterisk}
                />

                {isAdmin && (
                    <FormTextfield
                        label="Email"
                        name="email"
                        val={data.email}
                        change={(e) => change(e, setData)}
                        checkExists={(e) => checkUserExist('email', e, data.user_id)}
                        setExist={setExistEmail}
                        error={error.email}
                        errorAsterisk={error.emailAsterisk}
                    />
                )}

                <div className="grid justify-end">
                    <FormButton type="submit" label="Save Changes" />
                </div>
            </form>
        </div>
    );
};

const PasswordForm = ({ authUser, targetAccount, isAdmin, isEditingOwnAccount, reload }) => {
    const [commonPasswordList, setCommonPasswordList] = useState([]);
    const [data, setData] = useState({
        user_id: targetAccount.id,
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState({});
    const [verifyPass, setVerifyCurrentPassword] = useState(false);
    const [otp, openOtp] = useState(false);

    useEffect(() => {
        fetch("/storage/list/common-password.txt")
            .then((res) => res.text())
            .then((text) => setCommonPasswordList(new Set(text.split(/\r?\n/).filter(Boolean))))
            .catch((x) => console.log(x));
    }, []);

    // Only the account owner needs to prove their current password;
    // an admin editing someone else's account doesn't have it to give.
    const showCurrentPassword = isEditingOwnAccount;

    const validate = () => {
        const err = {};

        if (showCurrentPassword && !data.current_password) {
            err.current_password = "Current Password is required";
            err.current_passwordAsterisk = true;
        }

        if (!data.password) {
            err.password = "Password is required";
            err.passwordAsterisk = true;
        } else {
            const validator = new Validator({}, targetAccount.role);
            validator.validatePassword(
                {
                    ...data,
                    first_name: targetAccount.profile?.first_name,
                    middle_name: targetAccount.profile?.middle_name,
                    last_name: targetAccount.profile?.last_name,
                    username: targetAccount.username,
                    email: targetAccount.email,
                },
                err,
                commonPasswordList
            );
            if (err.password) err.passwordAsterisk = true;
        }

        if (!data.password_confirmation) {
            err.password_confirmation = "Password Confirmation is required";
            err.password_confirmationAsterisk = true;
        }

        if (data.password && data.password_confirmation && data.password !== data.password_confirmation) {
            err.password = "Password doesn't match";
            err.passwordAsterisk = true;
        }

        setError(err);
        return !err.current_password && !err.password && !err.password_confirmation;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        if (showCurrentPassword && !verifyPass) return;

        openOtp(true);
    };

    return (
        <>
            <OtpModal
                close={otp}
                isEnableOuterClose={false}
                closeModal={openOtp}
                username={authUser.username}
                contact={{
                    email: authUser.email,
                    contact_number: authUser.contact_number,
                }}
                proceedEvent={() => {
                    openOtp(false);
                    reload(true, "text-wait", "Updating password...");

                    const api = new APIRequest(
                        "/account/update",
                        "post",
                        data,
                        () => {},
                        () => {
                            reload(true, "");
                            showOutputModal("Password Updated Successfully", "s", () => {
                                reload(false);
                                window.location.reload();
                            });
                        },
                        () => {
                            reload(true, "");
                            showOutputModal("Failed to Update Password", "e", () => reload(false));
                        }
                    );

                    api.sendPostData();
                }}
                generatedPin={otp ? Math.floor(Math.random() * 900000) + 100000 : 0}
            />

            <div className="bg-white px-5 md:px-10 py-8 rounded-lg shadow-sm shadow-black/20">
                <h2 className="text-lg font-semibold mb-5">Password</h2>
                <form onSubmit={handleSubmit} className="grid gap-6">
                    {showCurrentPassword && (
                        <FormTextfield
                            label="Enter Your Current Password"
                            name="current_password"
                            id="current_password"
                            type="password"
                            val={data.current_password}
                            change={(e) => change(e, setData)}
                            checkExists={(e) => checkCurrentPassword(authUser.id, e)}
                            enableShowPassword={true}
                            setExist={setVerifyCurrentPassword}
                            error={error.current_password}
                            errorAsterisk={error.current_passwordAsterisk}
                        />
                    )}

                    <FormTextfield
                        label="Enter New Password"
                        name="password"
                        id="password"
                        type="password"
                        val={data.password}
                        change={(e) => change(e, setData)}
                        enableShowPassword={true}
                        error={error.password}
                        errorAsterisk={error.passwordAsterisk}
                    />

                    <FormTextfield
                        label="Confirm New Password"
                        name="password_confirmation"
                        id="password_confirmation"
                        type="password"
                        val={data.password_confirmation}
                        change={(e) => change(e, setData)}
                        enableShowPassword={true}
                        error={error.password_confirmation}
                        errorAsterisk={error.password_confirmationAsterisk}
                    />

                    <div className="grid justify-end">
                        <FormButton type="submit" label="Change Password" />
                    </div>
                </form>
            </div>
        </>
    );
};

export default AccountSettingsForm;
