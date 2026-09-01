const UploadFileBtn = ({ children, name, accept, change }) => {
    return (
        <div className="w-full grid">
            <label 
                htmlFor={name} 
                className="px-4 py-2 bg-blue-700 text-[0.9em] text-white rounded cursor-pointer items-center flex justify-center w-full"
            >
                {children}
            </label>
            <input 
                type="file" 
                name={name} 
                accept={accept} 
                onChange={change} 
                className="hidden" 
                id={name}
            />
        </div>
    )
}
export default UploadFileBtn