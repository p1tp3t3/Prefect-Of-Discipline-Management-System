import { useEffect } from "react";
import { motion } from "framer-motion";

const FadeModal = ({
    children,
    close = false,
    cntr = false,
    w = "w-auto",
    pd = ["px-3", "py-2"],
    bgColor = "bg-white",
    textColor = "text-black",
    isEnableOuterClose = false,
    closeModal = () => {},
}) => {
    useEffect(() => {
        if (close) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }
    , [close]);
    const center = cntr ? "grid place-items-center" : "grid justify-center";

    const enableOuterClose = () => {
        if (isEnableOuterClose) {
            closeModal(!close);
        } else {
            return;
        }
    };

    return (
        <motion.div
            className={`fixed z-[200] inset-0 ${center} overflow-hidden overflow-y-auto`}
            style={{ pointerEvents: close ? 'auto' : 'none' }}
            initial={false}
            animate={{ opacity: close ? 1 : 0, backgroundColor: close ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.2 }}
            onClick={() => enableOuterClose()}
        >
            <div className="px-3 py-5">
                <motion.div
                    initial={false}
                    animate={{ opacity: close ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`${w} shadow ${pd[0]} ${pd[1]} ${bgColor} ${textColor} rounded-[5px]`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </div>
        </motion.div>
    );
};
export default FadeModal;
