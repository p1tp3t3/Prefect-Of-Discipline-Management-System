import { motion } from "framer-motion"

const OptionButton = ({
    ls,
    option,
    icon,
    label,
    onClick,
    round,
    colorHighlight = "bg-blue-600 text-white",
    textColor = "text-blue-600",
    borderColor = "border-blue-600",
    hover = "hover:bg-blue-50",
    className = "",
}) => {
    const isActive = option === ls;

    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileTap={{ scale: 0.97 }}
            className={`
                flex items-center gap-2 px-4 py-2 border
                ${isActive ? colorHighlight : `${textColor} ${borderColor} ${hover}`}
                ${round ? "rounded-md" : "rounded-full"}
                font-medium
                ${className}
            `}
        >
            {icon && <i className={`fa-solid fa-${icon} text-[0.9em]`}></i>}
            {label && <span>{label}</span>}
        </motion.button>
    );
};

export default OptionButton;
