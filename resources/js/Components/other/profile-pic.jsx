const ProfilePic = ({
    size = 4,
    activeSize = 1,
    src = null,
    showActive = false,
    activeBorderColor = 'border-white border-[2px]',
    isActive = false,
    border = { size: '', color: '' }
}) => {
    
    return (
        <div 
            className={`grid relative object-cover z-0 flex-shrink-0`} 
            style={{height: (`${size}rem`), width: (`${size}rem`)}}
            id='profile-picture'>
            <div className={`object-cover rounded-full overflow-hidden w-full h-full`} style={{ border: `${border.size}px solid ${border.color}` }}>
                <img src={src} alt=""/>
            </div>
            {(showActive)
            &&
            <Active 
                isActive={isActive} 
                activeSize={activeSize} 
                activeBorderColor={activeBorderColor}
            />}
        </div>
    )
}
const Active = (props) => {
    return (
        <div 
            className={`
                absolute 
                ${(props.isActive) ? 'bg-green-600 ' : 'bg-orange-500'} 
                rounded-[100%] 
                justify-self-end 
                ${props.activeBorderColor} 
                self-end
            `}
            style={{height: `${props.activeSize}rem`, width: `${props.activeSize}rem`}}
            id='active'>
        </div>
    )
}   
export default ProfilePic