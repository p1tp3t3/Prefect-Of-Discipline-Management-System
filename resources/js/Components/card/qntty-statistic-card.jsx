const QuantityCard = ({ label, color, icon, num}) => {
    return (
        <div className={`w-full  ${color.bg} rounded-md shadow-md shadow-black/20`}>
            <div className="px-5 py-3 w-full h-full flex gap-3 items-center">
                <div className="h-[3.3rem] w-[3.3rem] text-[1.7em] grid place-items-center rounded-full flex-shrink-0 bg-blue-300/20 text-blue-600">
                    <i className={`fa-solid ${icon} px-3`}></i>   
                </div>
                <div className="w-full">
                    <h1 className="text-[1.3em]"><b>{num}</b></h1>
                    <p className="text-[0.7em] text-gray-500"><b>{label}</b></p>       
                </div>  
            </div>
        </div>
    )
}
export default QuantityCard