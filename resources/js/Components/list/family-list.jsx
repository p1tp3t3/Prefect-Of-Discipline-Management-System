import ProfilePic from "../other/profile-pic";
import { getProfilePic, readableDate, readableTime, toTitleCase } from "@/others/function";
import { AlertCircle } from "lucide-react";

const FamilyList = ({ list, setId }) => {
    return (
        <div className="grid gap-3">
            {list.length !== 0 ? (
                list.map((family, i) => (
                    <Row key={i} obj={family} setId={setId} i={i} />
                ))
            ) : (
                <div className="text-gray-500 grid place-items-center py-10">
                    <div className="text-[4em] text-gray-400">
                        <AlertCircle size="1em" />
                    </div>
                    <p className="text-sm">No Families Yet</p>
                </div>
            )}
        </div>
    );
};

const Row = ({ obj, setId, i }) => {

    /** Renders overlapping profile pictures */
    const renderProfile = (members) => {
        return members.slice(0, 5).map((m, idx) => {
            const path = getProfilePic(m.user.profile?.profile_picture, m.user.profile?.sex);

            return (
                <div
                    key={idx}
                    className="absolute"
                    style={{ left: `${idx * 22}px` }}
                >
                    <div className="rounded-full bg-white p-[2px] shadow-sm">
                        <ProfilePic src={path} size={1.7} />
                    </div>
                </div>
            );
        });
    };

    return (
        <div
            className="cursor-pointer border border-gray-200 hover:border-blue-500 transition rounded-md bg-white shadow-sm p-4"
            onClick={() => setId(obj)}
        >
            <div className="flex justify-between items-start">
                <div className="grid gap-3">
                    <div>
                        <h1 className="font-bold text-[1.1em]">
                            {toTitleCase(obj.family)} Family
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Code <u><b>{obj.family_code}</b></u>
                        </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        Joined Since: {`${readableDate(obj.created_at)} (${readableTime(obj.created_at)})`}
                    </p>
                </div>

                {/* Members Count */}
                <div className="text-[0.75em] text-gray-500">
                    {obj.members.length} Members
                </div>
            </div>

            {/* Members Profile Group */}
            <div className="relative mt-4 h-[32px]">
                {renderProfile(obj.members)}
            </div>
        </div>
    );
};

export default FamilyList;
