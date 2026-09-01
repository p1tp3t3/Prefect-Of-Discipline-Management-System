import { motion } from "framer-motion"

const Switch = ({
    checked = false, 
    onChange = () => {}, 
    effect = ['bg-gray-600', 'bg-gray-800'], 
    btnSize = [1.8, 3.1], 
    circleSize = 1.3 
}) => {
    return (
        <label className="flex items-center cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={onChange}
                />
                <div className={`block ${checked ? effect[1] : effect[0]} rounded-full`}
                    style={{
                        height: `${btnSize[0]}rem`,
                        width: `${btnSize[1]}rem`,
                    }}></div>
                <motion.div
                    className="absolute left-1 top-1 bg-white rounded-full"
                    style={{
                        height: `${circleSize}rem`,
                        width: `${circleSize}rem`,
                    }}
                    animate={{ x: checked ? '100%' : '0%' }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                />
            </div>
        </label>
    );
}
export default Switch;