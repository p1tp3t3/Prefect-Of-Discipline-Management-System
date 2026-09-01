const VideoBox = ({ src }) => {
    return (
        <div>
            <video src={src} className="w-full h-full">
            </video>
        </div>
    )
}
export default VideoBox