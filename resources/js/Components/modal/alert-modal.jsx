import { useEffect } from "react"
import { motion } from "framer-motion"

const AlertModal = ({
    children,
    close = false,
    w = "w-[25rem]",
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
    
    const enableOuterClose = () => {
        console.log(isEnableOuterClose)
        if(isEnableOuterClose) {
            closeModal(!close)
        }else {
            return
        }
    }
    return (
        <motion.div
            className="fixed z-50 inset-0 grid place-items-center"
            style={{ pointerEvents: close ? 'auto' : 'none' }}
            initial={false}
            animate={{ opacity: close ? 1 : 0, backgroundColor: close ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.2 }}
            onClick={() => enableOuterClose()}
        >
            <motion.div
                initial={false}
                animate={{ scale: close ? 1 : 1.05, opacity: close ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`${w} overflow-hidden shadow ${pd[0]} ${pd[1]} ${bgColor} ${textColor} rounded-[5px]`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
export default AlertModal