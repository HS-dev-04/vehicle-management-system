// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { setPasswords } from "../../../redux/slices/authCreatePasswordSlice";
// import { Button, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
// import { auth } from "../../../../public/Firebase";
// const CreatePassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!password || !confirmPassword) {
//       return setError("Both fields are required.");
//     }

//     if (password !== confirmPassword) {
//       return setError("Passwords do not match.");
//     }

//     dispatch(setPasswords({ password, confirmPassword }));

//     const email = localStorage.getItem("reset_email");

//     try {
      
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         "defaultTempPass" 
        
//       );

//       await updatePassword(userCredential.user, password);



//       alert("Password updated successfully.");
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to update password. Try again or contact support.");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>Create New Password</h3>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3">
//           <Form.Label>New Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Enter new password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Confirm Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Re-enter new password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </Form.Group>

//         {error && <p className="text-danger">{error}</p>}

//         <Button type="submit" variant="warning">
//           Save Password
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default CreatePassword;
