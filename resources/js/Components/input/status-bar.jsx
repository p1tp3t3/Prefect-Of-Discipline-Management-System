const StatusBar = ({ percent, color }) => {
    return (
        <div className="w-full flex flex-col gap-1">
            <div>
                <div class="w-full bg-black/20 rounded-full overflow-hidden">
                    <div class={`text-[0.8em] grid place-items-center ${color} font-medium bg-black/20 text-white text-center p-0.5 py-[4px] leading-none rounded-full`} style={{ width: `${percent}%`}}>
                        <span className="ml-2">{percent}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusBar