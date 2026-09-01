import OptionButton from "./option-btn";

const TabBtn = ({ list, option, handleSelect, className }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {list.map((e, i) => (
                <div key={i}>
                    <OptionButton
                        option={option}
                        ls={e.val}
                        label={e.label}
                        icon={e.icon}
                        colorHighlight={e.colorHighlight || "bg-blue-600 text-white"}
                        textColor={e.textColor || "text-blue-600"}
                        borderColor={e.borderColor || "border-blue-600"}
                        hover={e.hover || "hover:bg-blue-50"}
                        onClick={() => handleSelect(e.val)}
                        className={`rounded-full border text-[0.85em] py-1 px-4 ${className || ""}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default TabBtn;
