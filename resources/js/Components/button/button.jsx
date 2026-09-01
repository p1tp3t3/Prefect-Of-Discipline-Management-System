import { useState } from 'react'
import './style.css'

const FormButton = ({ 
  label, 
  type = 'button', 
  click = () => {}, 
  enable = true, 
  loading = false 
}) => {
  const isEnabled = enable && !loading
  const en = isEnabled ? '' : 'opacity-50 cursor-not-allowed'
  const enEvent = isEnabled ? {} : { disabled: true }

  return (
    <button
      className={`btn-71 shrink-0 grow-0 flex items-center justify-center gap-2 ${en} ${loading ? 'bg-gray-500' : ''}`}
      onClick={click}
      type={type}
      {...enEvent}
    >
      <div className='flex items-center justify-center gap-2'>
        {label}
        {loading && 
        <div className="loader"></div>}</div>
    </button>
  )
}

export default FormButton
