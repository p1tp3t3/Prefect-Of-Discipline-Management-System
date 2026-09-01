import { motion } from "framer-motion";
const CircleReload = ({ size = 10.3 }) => {
    return (
        <div className="flex justify-center items-center">
            <motion.div
                className="border-4 border-blue-500 border-t-transparent rounded-full"
                style={{ width: `${size}rem`, height: `${size}rem` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    )
}
export default CircleReload