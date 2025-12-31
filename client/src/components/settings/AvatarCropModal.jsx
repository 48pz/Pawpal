import Cropper from "react-easy-crop";
import { useState } from "react";

const AvatarCropModal = ({ open, onClose, onConfirm }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files?.length) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const { blob, preview } = await getCroppedResult(
      imageSrc,
      croppedAreaPixels
    );
    onConfirm({ preview, blob });

    resetState();
    onClose();
  };

  const resetState = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const getCroppedResult = async (imageSrc, cropPixels) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png");
    });

    const preview = canvas.toDataURL("image/png");

    return { blob, preview };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0f172a] w-[420px] rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Edit avatar</h3>

        {!imageSrc ? (
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="text-sm text-white"
          />
        ) : (
          <>
            <div className="relative w-full h-64 bg-black rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => {
                  setCroppedAreaPixels(croppedPixels);
                }}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full mt-4"
            />
          </>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!imageSrc}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropModal;
