import UpModal from "../up-modal"
import FormTextfield from "@/Components/input/form-input"
import FormButton from "../../button/button"
import { change, showWarningModal } from "../../../others/function"
import { useState } from "react"

const SetReasonModal = (props) => {
    
    const [err, setErr] = useState('')

    const handleChange = e => {
        change(e, props.setData)
    }
    const handleSubmit = e => {
        e.preventDefault()
        if(props.data.reason != '') {
            setErr('')
            showWarningModal(
                props.warning.title,
                props.warning.btn,
                'Cancel',
                () => {
                    props.sendData()
                }
            )
        }else {
            setErr('Reason is Required.')
        }
    }
    return (
        <UpModal
            close={props.close} 
            isEnableOuterClose={props.isEnableOuterClose}
            closeModal={props.closeModal}
            pd={props.pd}
            bgColor='bg-white'
            w='w-[28rem]'>
            <div className="w-full">
                <div className="w-full">
                    <form method="post" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <div className="grid gap-3">
                                <div>
                                    <FormTextfield
                                        type="textarea"
                                        label={props.title}
                                        name='reason'
                                        id='reason'
                                        val={props.data.reason}
                                        error={err}
                                        errorAsterisk={err != '' ? true : ''}
                                        change={handleChange} 
                                        color={{ border: 'border-blue-700', bg: 'bg-gray-200' }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <FormButton label='Send' type="submit" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </UpModal>
    )
}
export default SetReasonModal