"use client";

type MediaItem = {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
};

type Props = {
  open: boolean;
  media: MediaItem[];
  onClose: () => void;
  onSelect: (url: string) => void;
  onUpload?: (file: File) => Promise<void>;
  uploading?: boolean;
};

export default function MediaPicker({ open, media, onClose, onSelect, onUpload, uploading }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <div>
            <h2 className="font-semibold text-neutral-900">Media Library</h2>
            <p className="text-xs text-neutral-500">Select an existing photo or upload a new one</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 text-xl leading-none">×</button>
        </div>

        <div className="px-5 py-3 border-b border-neutral-100 flex gap-2">
          <label className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-neutral-800">
            {uploading ? "Uploading..." : "+ Upload new"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f && onUpload) await onUpload(f);
              }}
            />
          </label>
          <span className="text-xs text-neutral-400 self-center">{media.length} files</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {media.length === 0 ? (
            <div className="text-center py-12 text-sm text-neutral-400">
              No images yet. Upload your first photo.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {media.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onSelect(m.url); onClose(); }}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-900 hover:ring-1 hover:ring-neutral-900 transition bg-neutral-50"
                >
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition">
                    {m.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
