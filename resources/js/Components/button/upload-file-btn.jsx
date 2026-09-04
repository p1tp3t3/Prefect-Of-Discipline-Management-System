import { Loader2 } from "lucide-react"

const UploadFileBtn = ({ children, name, accept, change, loading = false }) => {
    return (
        <div className="w-full grid">
            <label
                htmlFor={loading ? undefined : name}
                className={`px-4 py-2 text-[0.9em] text-white rounded items-center flex justify-center gap-2 w-full ${
                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 cursor-pointer"
                }`}
            >
                {loading
                    ? <>
                        <Loader2 size={14} className="animate-spin" /> Uploading...
                      </>
                    : children}
            </label>
            <input
                type="file"
                name={name}
                accept={accept}
                onChange={change}
                disabled={loading}
                className="hidden"
                id={name}
            />
        </div>
    )
}
export default UploadFileBtn
