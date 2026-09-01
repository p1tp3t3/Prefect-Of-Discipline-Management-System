const ProgramLegend = ({ list }) => {
    return (
        <div className="grid gap-2">
            <div className="text-[1.1em]">
                <b>Legend</b>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {list.map((e, i) =>
                <div key={i}>
                    <div className="flex items-center gap-2">
                        <div style={{ background: e.color_code }} className="w-[1rem] h-[1rem] rounded-full"></div>
                        <div className="text-[0.9em]">{e.name}</div>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default ProgramLegend