import { motion } from "framer-motion"

const ActionBtn = ({
    children,
    onClick,
    className,
}) => {
    return (
        <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            className={`text-white text-[0.9em] px-3 py-2 rounded-md transition-all ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.button>
    )
}

export default ActionBtn