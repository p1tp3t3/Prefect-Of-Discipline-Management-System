import FormTextfield from "@/Components/input/form-input";
import { change } from "@/others/function";
import FormButton from "@/Components/button/button";
import { useState } from "react";
import { APIRequest } from "@/others/classes/api-req";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

const UsernameVerify = (props) => {
  const [usernameError, setError] = useState("");

  const handleChange = (e) => {
    change(e, props.setData);
    if (usernameError) setError(""); // clear error on typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = props.data.username.trim().toLowerCase();

    if (username) {
      const api = new APIRequest(
        `/contact/${username}`,
        "post",
        {},
        props.setContact,
        success,
        error
      );
      api.fetchData();
    } else {
      setError("Username / User I.D is required");
    }
  };

  const success = () => props.showOtp("email");
  const error = (e) => setError(e.response?.data?.message || "An error occurred");

  return (
    <div className="flex justify-center items-center bg-gradient-to-br">
      <motion.div
        className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl"
        whileHover={{ scale: 1.01 }}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-justify">
            To recover your account, please enter your <b>Username</b> or <b>User I.D</b> in the field below.
            We’ll use this information to locate your registered account in the system and send a secure
            verification code to your associated email address. Make sure to enter your details accurately
            to avoid any delays in the password recovery process.
          </p>

        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FormTextfield
            label="Username / User I.D"
            type="text"
            name="username"
            id="username"
            val={props.data.username}
            error={usernameError}
            errorAsterisk={usernameError === "Username / User I.D is required"}
            icon="fa-solid fa-user"
            change={handleChange}
            req={true}
          />

          {/* Button */}
          <div className="w-full flex justify-end">
            <FormButton
              label="Next"
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all font-semibold"
            />
          </div>
        </form>

        {/* Optional footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Remember your password?{" "}
            <Link
              href="/"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UsernameVerify;
