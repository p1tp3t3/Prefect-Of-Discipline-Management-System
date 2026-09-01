import { change } from "@/others/function"

const CheckBoxButton = ({ list, label, flex, name, id, change }) => {
    const objConvert = () => {
        return list.map(e => {
            const [value = null, label = null] = Object.values(e) || []
            return { value, label }
        })
    }
    return (
        <div className="text-[0.9em]">
            <div className="sticky top-0 bg-white">
                <label htmlFor="">{label}</label>
            </div>
            <div className={`${(flex) ? 'flex gap-2 items-center flex-wrap' : ''}`}>
                {objConvert().map((e, i) =>     
                <div className={`flex gap-2 items-center`}>
                    <input type="checkbox" onChange={change} value={e.value} name={`${name}[]`} id={`${id}${i}`} />
                    <label htmlFor={`${id}${i}`}>{e.label}</label>
                </div>)}
            </div>
        </div>
    )
}
const CheckBox = ({ 
    label, 
    name, 
    id, 
    change, 
    checked 
}) => {
    return (
        <div className="flex items-center gap-3">
            <input type="checkbox" name={name} id={id} checked={checked} onChange={change} />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

CheckBoxButton.CheckBox = CheckBox

export default CheckBoxButton