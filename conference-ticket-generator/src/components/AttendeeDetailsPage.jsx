import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";

const AttendeeDetailsPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  // Initialize IndexedDB
  useEffect(() => {
    const loadData = async () => {
      const db = await openDB("AttendeeDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("attendee")) {
            db.createObjectStore("attendee");
          }
        },
      });

      const storedName = await db.get("attendee", "name");
      const storedEmail = await db.get("attendee", "email");
      const storedRequest = await db.get("attendee", "specialRequest");
      const storedImage = await db.get("attendee", "profileImage");

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedRequest) setSpecialRequest(storedRequest);
      if (storedImage) setProfileImage(storedImage);
    };
    loadData();
  }, []);

  const saveToDB = async (key, value) => {
    const db = await openDB("AttendeeDB", 1);
    await db.put("attendee", value, key);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned-upload-preset");
      formData.append("cloud_name", "djvnfoltp");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/djvnfoltp/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.secure_url) {
          setProfileImage(data.secure_url);
          await saveToDB("profileImage", data.secure_url);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            profileImage: "Failed to upload image. Please try again.",
          }));
        }
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          profileImage: "An error occurred while uploading the image.",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) newErrors.name = "Name is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!profileImage) newErrors.profileImage = "Profile image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    await saveToDB("name", name);
    await saveToDB("email", email);
    await saveToDB("specialRequest", specialRequest);
    navigate("/ticket-confirmation");
  };

  const handleRemoveImage = async () => {
    setProfileImage(null);
    await saveToDB("profileImage", null);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div
    className="min-h-screen gap-[40px] text-white p-4 md:p-6"
    style={{
      borderColor: "#0E464F",
      background:
        "radial-gradient(52.52% 32.71% at 50% 97.66%, rgba(36, 160, 181, 0.20) 0%, rgba(36, 160, 181, 0.00) 100%), #02191D",
    }}
  >
      <Header />
      <div className="flex items-center justify-center flex-grow pt-4 md:pt-7">
        <div className="bg-[#041e23] p-4 md:p-8 lg:p-12 rounded-3xl shadow-lg w-full max-w-[700px] border border-[#1c3b4a]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
            <h2 className="text-xl md:text-2xl tracking-wide">Attendee Details</h2>
            <p className="text-xs md:text-sm text-white">Step 2/3</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 flex mt-2 mb-4">
            <div className="w-2/3 h-full bg-[#24a0b5]"/>
            <div className="w-1/3 h-full bg-[#1c3b4a]"/>
          </div>

          <div className="bg-[#08252b] p-3 md:p-4 rounded-xl border border-[#1c3b4a]">
            <div 
              className="bg-[#052228] w-full p-4 md:p-6 rounded-xl border border-[#1c3b4a] text-center relative" 
              onDragOver={handleDragOver} 
              onDrop={handleDrop}
            >
              <p className="text-sm text-gray-300 mb-4 text-left pb-2">Upload Profile Photo</p>
              <div className="relative w-full h-[200px] flex justify-center items-center bg-[#041e23] rounded-lg">
                {profileImage ? (
                  <div className="relative">
                    <img src={profileImage} alt="Profile" className="h-32 md:h-40 w-32 md:w-40 object-cover rounded-xl" />
                    <button 
                      onClick={handleRemoveImage} 
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 text-xs rounded-full"
                    >
                      ✖
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col pb-4 items-center justify-center border-[4px] border-[#24a0b5] cursor-pointer bg-[#0e464f] p-4 rounded-[32px] w-[180px] md:w-[240px] h-[180px] md:h-[240px]">
                    <span className="text-4xl text-[#1aa7ec]">
                      <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.2639 8.81608C22.6812 4.22675 18.7505 0.666748 14.0052 0.666748C10.3305 0.666748 7.13854 2.81475 5.68121 6.20008C2.81721 7.05608 0.671875 9.76008 0.671875 12.6667C0.671875 16.3427 3.66254 19.3334 7.33854 19.3334H8.67188V16.6667H7.33854C5.13321 16.6667 3.33854 14.8721 3.33854 12.6667C3.33854 10.7947 4.93721 8.99075 6.90254 8.64542L7.67721 8.50941L7.93321 7.76542C8.87054 5.03075 11.1972 3.33341 14.0052 3.33341C17.6812 3.33341 20.6719 6.32408 20.6719 10.0001V11.3334H22.0052C23.4759 11.3334 24.6719 12.5294 24.6719 14.0001C24.6719 15.4707 23.4759 16.6667 22.0052 16.6667H19.3385V19.3334H22.0052C24.9465 19.3334 27.3385 16.9414 27.3385 14.0001C27.337 12.8048 26.9347 11.6445 26.196 10.7047C25.4574 9.76498 24.425 9.1 23.2639 8.81608Z" fill="#FAFAFA"/>
                        <path d="M15.3385 12.6667V7.33342H12.6719V12.6667H8.67188L14.0052 19.3334L19.3385 12.6667H15.3385Z" fill="#FAFAFA"/>
                      </svg>
                    </span>
                    <p className="text-xs md:text-sm pt-4 text-gray-400 text-center mt-1">
                      Drag & drop or click to<br />upload
                    </p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              {errors.profileImage && <p className="text-red-500 text-xs mt-2">{errors.profileImage}</p>}
            </div>

            <div className="w-full h-1 bg-gradient-to-r from-[#12464e] to-[#1c3b4a] mt-4 mb-4" />

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm text-gray-300">
                  Enter your name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-3 mt-1 bg-[#052228] text-white rounded-xl border border-[#1c3b4a] focus:outline-none focus:ring-2 focus:ring-[#24a0b5]"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    saveToDB("name", e.target.value);
                  }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="text-sm text-gray-300">
                  Enter your email *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-3 pl-10 mt-1 bg-[#052228] text-white rounded-xl border border-[#1c3b4a] focus:outline-none focus:ring-2 focus:ring-[#24a0b5]"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      saveToDB("email", e.target.value);
                    }}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="special-request" className="text-sm text-gray-300">
                  Special request?
                </label>
                <textarea
                  id="special-request"
                  className="w-full p-3 mt-1 bg-[#052228] text-white rounded-xl border border-[#1c3b4a] focus:outline-none focus:ring-2 focus:ring-[#24a0b5]"
                  rows="4"
                  value={specialRequest}
                  onChange={(e) => {
                    setSpecialRequest(e.target.value);
                    saveToDB("specialRequest", e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between mt-6 gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full md:w-[45%] bg-[#08252b] px-4 py-3 rounded-xl text-[#24a0b5] hover:bg-[#09343d] border border-[#24a0b5]"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-full md:w-[45%] bg-[#24a0b5] px-4 py-3 rounded-xl text-white hover:bg-[#1b8da4]"
              >
                Get My Free Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDetailsPage;