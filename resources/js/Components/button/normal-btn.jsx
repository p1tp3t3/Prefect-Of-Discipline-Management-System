import { motion } from "framer-motion"

const Btn = ({ children, onclick, className }) => {
    return (
        <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 bg-blue-700 text-[0.9em] text-white rounded transition-colors hover:bg-blue-800 ${className}`}
            onClick={onclick}
        >
            {children}
        </motion.button>
    )
}
export default Btn