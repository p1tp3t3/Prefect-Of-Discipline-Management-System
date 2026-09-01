import React, { useRef, useEffect, useState } from 'react';
import Cropper from 'react-cropper';
import Btn from '../button/normal-btn';

const ImageCropper = ({ preview, onCropped, setPreview }) => {
  const cropperRef = useRef(null)
  const [image, setImage] = useState()

  useEffect(() => {
    if(preview) {
        setImage(preview)
    }
  }, [preview])

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) return

    const croppedDataUrl = cropper.getCroppedCanvas({
      width: 600,
      height: 600,
    }).toDataURL('image/jpeg', 1.0)

    onCropped?.(croppedDataUrl)
  }

  return (
    <div className="space-y-4">
        {image && (
        <>
        <Cropper
            src={image}
            style={{ height: 300, width: '100%' }}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={false}
            viewMode={1}
            ref={cropperRef}
            zoomable={false}
            zoomOnWheel={false}
            zoomOnTouch={false}
        />
        <div className='flex justify-center gap-3'>
            <Btn onclick={() => {setImage(null); setPreview(null);}}>Discard</Btn>
            <Btn onclick={handleCrop}>Save Changes</Btn>
        </div>
        </>)}
    </div>
  )
}

export default ImageCropper
