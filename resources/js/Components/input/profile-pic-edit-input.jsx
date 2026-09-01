import { useState } from "react";
import ProfilePic from "../other/profile-pic"
import ImageCropper from "./cropper"
import { base64ToFile } from "@/others/function";



const ProfilePicEdit = ({ 
    setPreview, 
    preview, 
    handleFileChange, 
    profilePic, 
    profileChange, 
    enableCrop = false,
    req = false,
    error = null,
}) => {
    const [finalPic, setFinalPic] = useState(null)

    const handleCropped = async (croppedDataUrl) => {
        const name = await base64ToFileName(croppedDataUrl, 'profile');
        const file = base64ToFile(croppedDataUrl, name)

        setFinalPic(croppedDataUrl)
        setPreview(null)
        profileChange(file)
    };
    const base64ToFileName = async (base64, prefix = "file") => {
        const mimeMatch = base64.match(/^data:(.*?);base64,/);
        let extension = "bin";

        if (mimeMatch) {
            const mime = mimeMatch[1];
            extension = mime.split("/")[1];
        }

        const base64Content = base64.split(",")[1];
        const buffer = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));

        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        return `${prefix}_${hashHex.slice(0, 16)}.${extension}`;
    }

    return (
        <>
        {!preview &&
        <div className="relative w-[10rem] h-[10rem]">
            <ProfilePic
                src={finalPic || preview || profilePic}
                size={10}
            />
            <input
                type="file"
                name="profile_picture"
                id="edit-pic"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                required={req}
            />
            <label
                htmlFor="edit-pic"
                type="button"
                className="cursor-pointer w-[2.2rem] grid place-items-center bottom-0 right-1 h-[2.2rem] rounded-full absolute bg-blue-600 text-white"
            >
                <i className="fa-solid fa-edit"></i>
            </label>
        </div>}
        {(preview && enableCrop) && (
            <ImageCropper preview={preview} setPreview={setPreview} onCropped={handleCropped} />
        )}
        {error &&
        <div className="text-[#d12323] text-[12px]">
            <div className="transition-[0.2s] font-[1000]">
                {error}
            </div>
        </div>}
        </>
    )
}
export default ProfilePicEdit