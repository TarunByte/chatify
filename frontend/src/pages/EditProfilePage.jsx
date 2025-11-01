import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

function EditProfilePage() {
  const { updateProfile, authUser } = useAuthStore();
  const [name, setName] = useState(authUser?.fullName || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePic || null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const isChanged =
    name !== authUser.fullName || preview !== authUser.profilePic;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file); // Converts file → base64 for preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (avatar) {
        const payload = { fullName: name, profilePic: preview };
        await updateProfile(payload);
        navigate("/");
      } else {
        const payload = { fullName: name };
        await updateProfile(payload);
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center bg-transparent text-white z-50">
      <h2 className="text-3xl font-bold mb-8">Edit Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/90 p-10 rounded-2xl shadow-2xl flex flex-col gap-6 w-[380px] sm:w-[420px] border border-slate-700 backdrop-blur-lg"
      >
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-lg bg-slate-700 text-white outline-none placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition"
        />

        <label className="flex flex-col items-center cursor-pointer">
          <span className="mb-3 text-slate-300 text-sm uppercase tracking-wide">
            Upload Profile Picture
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </label>

        {preview && (
          <div className="flex flex-col items-center cursor-pointer">
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-md mb-6"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-600 text-sm transition-all"
            >
              Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={!isChanged}
          className={`p-2 rounded-lg font-semibold transition-all ${
            isChanged
              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;
