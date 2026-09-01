import logo from "../../images/pilar.png";
import './style.css'
import CircleReload from "./circle-reload";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { showOutputModal } from "@/others/function";

const Reload = ({ transition, type, label = "Successfully", p = null, onClose }) => {
    return (
        <div
            className={`${transition} reload w-[100%] transition-[0.3s] h-[100%] fixed bg-[#000000e5] flex justify-center items-center`}
        >
            <Type t={type} l={label} p={p} onClose={onClose} />
        </div>
    );
};

const outputTypeCode = { success: 's', error: 'e', warning: 'w' };

const Type = ({ t, l, p, onClose }) => {
    useEffect(() => {
        const code = outputTypeCode[t];
        if (code) {
            showOutputModal(l, code, () => onClose(false));
        }
    }, [t]);

    switch (t) {
        case "text-wait":
            return (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg w-11/12 max-w-sm text-center"
                >
                    <div className="relative w-12 h-12 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-t-blue-500"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        ></motion.div>
                    </div>

                    <p className="text-gray-700 text-base font-medium leading-snug">
                        Please wait while <span className="text-blue-600 font-semibold">{l}</span> {p}...
                    </p>

                    <div className="mt-3 flex gap-1 justify-center">
                        <motion.span
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        ></motion.span>
                        <motion.span
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                        ></motion.span>
                        <motion.span
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                        ></motion.span>
                    </div>
                </motion.div>
            );
        case "logo":
            return (
                <>
                    <div className="loader"></div>
                    <div className="absolute w-[10.3rem] h-[10.3rem]">
                        {/**<img src={logo} className="w-full h-full" alt="" /> */}
                    </div>
                </>
            );
        case "success":
        case "error":
        case "warning":
            return null;
    }
};

export default Reload;
