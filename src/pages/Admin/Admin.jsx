// import React, { useState } from "react";
// import { storage, db } from "../../../Firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

// const ImageUploader = () => {
//   const [image, setImage] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!image) {
//       setMessage("❗Please select an image.");
//       return;
//     }

//     setLoading(true);

//     const imageRef = ref(storage, `images/${uuidv4()}_${image.name}`);

//     try {
//       const snapshot = await uploadBytes(imageRef, image);
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       await addDoc(collection(db, "images"), {
//         imageUrl: downloadURL,
//         createdAt: new Date(),
//       });

//       setMessage("Image uploaded successfully!");
//       setImage(null);
//     } catch (error) {
//       console.error("Upload failed", error);
//       setMessage("Upload failed. Please check the console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h3>Upload Image to Firebase</h3>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setImage(e.target.files[0])}
//       />
//       <br />
//       <button
//         onClick={handleUpload}
//         disabled={loading}
//         style={{ marginTop: "10px" }}
//       >
//         {loading ? "Uploading..." : "Upload"}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ImageUploader;
// src/pages/Admin.js (or wherever your Admin component is)
// src/pages/Admin.js (or wherever your Admin component is)
import React from 'react';
import { Link } from 'react-router-dom';
import CarList from '../../components/CarListing/CarList';
const Admin = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="mb-4 text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/AddCarPost" className="nav-link text-white">
              🚗 Add Car Post
            </Link>
          </li>
          {/* You can add more sidebar items below */}
          {/* <li className="nav-item mb-2">
            <Link to="/manageCars" className="nav-link text-white">
              🛠 Manage Cars
            </Link>
          </li> */}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        <h2>Dashboard</h2>
        <p>Welcome to the admin dashboard. Use the sidebar to navigate.</p>
        <CarList/>
      </div>
    </div>
  );
};

export default Admin;
