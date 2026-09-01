import FormTextfield from "@/Components/input/form-input"
import DropdownField from "@/Components/input/dropdown"
import { useState } from "react"

const StaffFields = ({ data, handleChange, validationErr }) => {
    const [current, setCurrent] = useState("")
    const [other, setOther] = useState(false)
    

    const handleDropdownChange = (e) => {
        const { name, value } = e.target
        setOther(value == "other")
        handleChange({ name, value })
    }

    return (
        <div className="grid gap-5">
            <DropdownField
                default={{ val: "", label: "Select Work" }}
                list={[
                    { val: "guard", label: "Guard" },
                    { val: "other", label: "Others" },
                ]}
                val={data.work_type}
                onChange={handleDropdownChange}
                name="work_type"
                error={!other ? validationErr.work_type : null}
            />

            {other && (
                <FormTextfield
                    label="Work Type"
                    name="other_work_type"
                    id="other_work_type"
                    val={data.other_work_type}
                    error={validationErr.other_work_type}
                    change={handleChange}
                    errorAsterisk={validationErr.other_work_typeAsterisk}
                    req={true}
                />
            )}
        </div>
    )
}


export default StaffFields
