import { Link } from "@inertiajs/react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const listStyle =
        "px-5 w-full cursor-pointer flex gap-3 items-center py-2 text-white text-[0.9em] hover:bg-[#1e3a8a] hover:text-white transition-[0.3s] rounded-md",
    listStyle2 =
        "flex gap-3 items-center cursor-pointer px-5 pl-12 w-full py-2 text-white text-[1em] hover:bg-[#1e3a8a] hover:text-white transition-[0.3s] rounded-md"

// Renders a role's sidebar nav from a single declarative array of
// { type: 'link', id, href, icon, label, show? } or
// { type: 'dropdown', id, icon, label, items: [...], show? } entries,
// so every role's sidebar body is just data instead of repeated JSX + state.
const SidebarNav = ({ list, height = "h-[26rem]" }) => {
    const [open, setOpen] = useState({})
    const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

    return (
        <div className={`${height} overflow-auto overflow-x-hidden dropdown`}>
            <ul className="p-0 list-none px-5 nav-list">
                {list.filter((item) => item.show ?? true).map((item) =>
                    item.type === "dropdown" ? (
                        <DropdownItem
                            key={item.id}
                            item={item}
                            isOpen={!!open[item.id]}
                            toggle={() => toggle(item.id)}
                        />
                    ) : (
                        <NavLink key={item.id} item={item} />
                    )
                )}
            </ul>
        </div>
    )
}

const NavLink = ({ item }) => (
    <Link href={item.href}>
        <li className={`${listStyle} nav`} id={item.id}>
            <i className={`fa-solid ${item.icon}`}></i>
            <div>{item.label}</div>
        </li>
    </Link>
)

const DropdownItem = ({ item, isOpen, toggle }) => (
    <>
        <li className={listStyle} onClick={toggle}>
            <i className={`fa-solid ${item.icon}`}></i>
            <div className="flex justify-between w-full">
                <span>{item.label}</span>
                <span>
                    <motion.i
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="fa-solid fa-chevron-right"
                    />
                </span>
            </div>
        </li>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.li
                    key={`${item.id}-dropdown`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden text-[0.8em]"
                >
                    <ul className="p-0 dropdown-nav-list">
                        {item.items.filter((sub) => sub.show ?? true).map((sub) => (
                            <Link key={sub.id} href={sub.href}>
                                <li className={`${listStyle2} nav`} id={sub.id}>
                                    <i className={`fa-solid ${sub.icon}`}></i>
                                    <div>{sub.label}</div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </motion.li>
            )}
        </AnimatePresence>
    </>
)

export default SidebarNav
