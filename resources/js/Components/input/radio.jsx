const RadioButton = (props) => {
    const objConvert = () => {
        return props.list.map(e => {
            const [value = null, label = null] = Object.values(e) || []
            return { value, label }
        })
    }
    return (
        <div className="text-[0.9em]">
            <div>
                <label htmlFor="">{props.label}</label>
            </div>
            <div className={`${(props.flex) ? 'flex gap-2 items-center flex-wrap' : ''}`}>
                {objConvert().map((e, i) =>     
                <div className={`flex gap-2 items-center`} key={i}>
                    <input 
                        type="radio" 
                        onChange={props.change} 
                        value={e.value} 
                        name={props.name} 
                        id={`${props.id}${i}`} 
                        checked={(e.value == props.val)}
                    />
                    <label htmlFor={`${props.id}${i}`}>{e.label}</label>
                </div>)}
            </div>
            <div className="text-[#d12323] text-[12px] flex items-center gap-2">
                <div className="transition-[0.2s] font-[1000]">
                    {props.error}
                </div>
            </div>
        </div>
    )
}
export default RadioButton