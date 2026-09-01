import { change } from "@/others/function"
import FormTextfield from "./form-input"

const BetweenTextfield = ({ 
    type = 'datetime-local',
    labels = ['From', 'To'], 
    name = ['name1', 'name2'], 
    id = ['id1', 'id2'], 
    data = ['', ''], 
    setData
}) => {
    const renderField = () => {
        const l = []
        for(let a = 0; a < 2; a++) {
            l.push(
                <FormTextfield 
                    label={labels[a]}
                    name={name[a]} 
                    id={id[a]}
                    val={data[a]}
                    type={type}
                    change={(e) => change(e, setData)} 
                    req={false}
                    color={{ border: 'border-blue-700', bg: 'bg-gray-200' }} 
                />
            )
        }
        return l.map((e, i) => <div key={i} className="w-full">{e}</div>)
    }
    return (
        <div className="flex gap-2">
            {renderField()}
        </div>
    )
}
export default BetweenTextfield