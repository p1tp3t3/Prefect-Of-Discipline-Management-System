import UpModal from "../up-modal"
import FormTextfield from "@/Components/input/form-input"
import { change, showOutputModal, showWarningModal } from "@/others/function"
import { useState, useEffect } from "react"
import FormButton from "@/Components/button/button"
import { APIRequest } from "@/others/classes/api-req"

const SetPenaltyModal = (props) => {
    const action = props.action || 'add'
    const editData = props.data || {}

    const [data, setData] = useState({
        id: '',
        description: '',
    })

    const [validationErr, setValidationErr] = useState({
        id: "",
        idAsterisk: false,
        description: "",
        descriptionAsterisk: false,
    })

    const validate = () => {
        let err = {
            id: "",
            idAsterisk: false,
            description: "",
            descriptionAsterisk: false
        }

        if (!data.description.trim()) {
            err.description = "Penalty name is required."
            err.descriptionAsterisk = true
        }

        setValidationErr(err)
        return !(err.id || err.description)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        showWarningModal(
            'Are You Sure You Want To Add A Penalty?',
            'Add Penalty',
            'Cancel',
            () => {
                props.reload(true, 'text-wait', 'Creating New Penalty')

                const api = new APIRequest('/maintenance/penalty/create', 'post', data, props.setter,
                    () => props.reload(true, 'success', 'New Penalty Created Successfully'),
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
                            <h1><b>{action === 'add' ? "Add New Penalty" : "Edit Penalty"}</b></h1>
                        </div>

                        <div className="grid gap-5">
                            <div className="grid gap-3">
                                <FormTextfield
                                    label='Penalty Name'
                                    name='description'
                                    val={data.description}
                                    change={handleChange}
                                    error={validationErr.description}
                                    errorAsterisk={validationErr.descriptionAsterisk}
                                />

                            </div>
                            <div className="grid">
                                <FormButton 
                                    label='Submit'
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

export default SetPenaltyModal
