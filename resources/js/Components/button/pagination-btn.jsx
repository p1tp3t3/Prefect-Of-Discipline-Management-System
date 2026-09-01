import { Link } from "@inertiajs/react"
import { motion } from "framer-motion"

const PaginationButton = ({ list = [] }) => {
    return (
        // ✅ Added responsiveness & scroll
        <div className="flex justify-center gap-2 mt-4 flex-wrap overflow-x-auto max-w-full px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {list.map((e, i) => {
                const isActive =
                    e.active ||
                    e.url === null ||
                    e.label.includes("current") // fallback safety

                const label = e.label
                    .replace("&laquo;", "«")
                    .replace("&raquo;", "»")
                    .replace(/(<([^>]+)>)/gi, "") // remove HTML tags if present

                return (
                    <Btn
                        key={i}
                        href={e.url}
                        selected={isActive}
                        disabled={!e.url}
                    >
                        {label}
                    </Btn>
                )
            })}
        </div>
    )
}

const Btn = ({ children, href, selected = false, disabled = false }) => {
    const baseStyle =
        "px-3 py-1 rounded-md text-[0.8em] whitespace-nowrap"
    const selectedStyle = selected
        ? "bg-blue-700 text-white font-semibold shadow"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : ""

    return (
        <Link href={href || "#"} preserveScroll>
            <motion.button
                type="button"
                disabled={disabled}
                whileTap={{ scale: 0.95 }}
                className={`${baseStyle} ${selectedStyle} ${disabledStyle}`}
            >
                {children}
            </motion.button>
        </Link>
    )
}

export default PaginationButton
