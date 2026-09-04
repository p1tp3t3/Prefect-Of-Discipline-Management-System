const ProfileSectionWrapper = ({ title, icon: Icon = null, side = null, children }) => {
    return (
        <div className="bg-white px-[20px] py-[18px] border-l-[5px] border-[#3498db] shadow-md shadow-black/20">
            <div className="grid gap-5">
                <div className="text-[1.2em] grid gap-2">
                    <div className="flex justify-between items-center">
                        <h1>
                            <b>
                                {(Icon != null)
                                ? <div className="flex gap-3 items-center"><Icon size="1em" /><span>{title}</span></div>
                                :<span>{title}</span>}
                            </b>
                        </h1>
                        <div>{side}</div>
                    </div>
                    <hr />
                </div>
                {children}
            </div>
        </div>
    );
}
export default ProfileSectionWrapper