import UpModal from "../up-modal"
import FormTextfield from "@/Components/input/form-input"
import { change, showOutputModal, showWarningModal } from "@/others/function"
import { useState, useEffect } from "react"
import FormButton from "@/Components/button/button"
import { APIRequest } from "@/others/classes/api-req"

const SetProgramModal = (props) => {
    const action = props.action || 'add'
    const editData = props.data || {}

    const [data, setData] = useState({
        id: '',
        name: '',
        description: '',
        color: '',
    })

    const [validationErr, setValidationErr] = useState({
        name: "",
        nameAsterisk: false,
        description: "",
        descriptionAsterisk: false,
        color: "",
        colorAsterisk: false,
    })

    useEffect(() => {
        if (action === 'edit' && editData) {
            setData({
                id: editData.id || '',
                name: editData.name || '',
                description: editData.description || '',
                color: editData.color_code || '',
            })
        }
    }, [action, editData])

    const validate = () => {
        let err = {
            name: "",
            nameAsterisk: false,
            description: "",
            descriptionAsterisk: false,
            color: "",
            colorAsterisk: false,
        }

        if (!data.name.trim()) {
            err.name = "Program name is required."
            err.nameAsterisk = true
        }

        if (!data.description.trim()) {
            err.description = "Program acronym is required."
            err.descriptionAsterisk = true
        }

        if (!data.color || !/^#([0-9A-F]{3}){1,2}$/i.test(data.color)) {
            err.color = "Invalid color code."
            err.colorAsterisk = true
        }

        setValidationErr(err)
        return !(err.name || err.description || err.color)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        const url = action === 'add'
            ? '/maintenance/program/create'
            : `/maintenance/program/update`

        const loadingMsg = action === 'add'
            ? 'Creating New Program. Please Wait'
            : 'Updating Program. Please Wait'

        const successMsg = action === 'add'
            ? 'New Program Created Successfully'
            : 'Program Updated Successfully'

        showWarningModal(
            action === 'add' ? 'Are You Sure You Want To Add A Program?' : 'Are You Sure You Want To Update A Program?',
            action === 'add' ? 'Add Program' : 'Update Program',
            'Cancel',
            () => {
                props.reload(true, 'text-wait', loadingMsg)

                const api = new APIRequest(url, 'post', data, props.setter,
                    () => props.reload(true, 'success', successMsg),
                    (e) => props.reload(true, 'error', 'Failed. ' + (e?.response.data.message || ''))
                )

                api.fetchData()
            }
        )
    }

    const handleChange = (e) => {
        change(e, setData)
        validate()
    }

    return (
        <UpModal
            close={props.close}
            closeModal={props.closeModal}
            isEnableOuterClose={props.isEnableOuterClose}
            pd={props.pd}
            bgColor='bg-white'
            w='w-[25rem]'
            cntr={true}
        >
            <div className="w-full">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-5">
                        <div className="text-[1.2em] text-center">
                            <h1><b>{action === 'add' ? "Add New Program" : "Edit Program"}</b></h1>
                        </div>

                        <div className="grid gap-5">
                            <div className="grid gap-3">

                                <FormTextfield
                                    label='Program Name'
                                    name='name'
                                    val={data.name}
                                    change={handleChange}
                                    errorEmpty="Please enter program name."
                                    error={validationErr.name}
                                    errorAsterisk={validationErr.nameAsterisk}
                                />

                                <div className="flex flex-col gap-1 text-[0.8em]">
                                    <label htmlFor="">Color Code</label>
                                    <input 
                                        type="color" 
                                        name="color" 
                                        value={data.color} 
                                        onChange={handleChange}
                                        className={`w-full h-[2.5rem] p-1 border rounded ${validationErr.colorAsterisk ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {validationErr.color && (
                                        <span className="text-red-500 text-[0.75em]">{validationErr.color}</span>
                                    )}
                                </div>

                                <FormTextfield
                                    label='Program Acronym'
                                    name='description'
                                    val={data.description}
                                    change={handleChange}
                                    errorEmpty="Please enter program acronym."
                                    error={validationErr.description}
                                    errorAsterisk={validationErr.descriptionAsterisk}
                                />

                            </div>

                            <div className="grid">
                                <FormButton 
                                    label={action === 'add' ? 'Submit' : 'Update'} 
                                    type='submit'
                                />
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </UpModal>
    )
}

export default SetProgramModal
