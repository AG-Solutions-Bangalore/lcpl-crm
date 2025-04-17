import { Input, Button, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextPanel } from "../../utils/ContextPanel";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();

    formData.append("username", username);
    formData.append("email", email);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/web-send-password`,
        formData
      );

      if (res.status === 200) {
        toast.success("Password Reset Succesfully");
      } else {
        toast.error("password reset, Err");
      }
    } catch (error) {
      console.error("An err occured during Forget Passoword", error);
      toast.error("An err occured during Forget Passoword");
    }

    setLoading(false);
  };

  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <section className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen flex items-center justify-center animate-bgShift">
        {/* Forget Password container */}
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          {/* Form */}
          <div className="md:w-1/2 px-8 md:px-16">
            <div className="flex justify-center mb-4">
              {/* <img
                src="/rkcyllogo.png"
                alt="RK Cylinder Logo"
                className="h-14 w-auto rounded-lg"
              /> */}
              <h1 className="text-4xl font-bold text-red-800">LCPL</h1>
            </div>
            <h2 className="font-bold text-2xl text-[#002D74]">
              Forget Password
            </h2>
            <p className="text-xs mt-4 text-[#002D74]">
              Enter your email and username to reset your password
            </p>

            <form
              onSubmit={handleSumbit}
              method="POST"
              className="flex flex-col gap-4"
            >
              <input
                className="p-2 mt-2 rounded-xl border"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                className="p-2 mt-2 rounded-xl border"
                type="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Mobile No"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-5 text-xs py-4 text-[#002D74]">
              <Link to="/" className="text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="md:block hidden w-1/2">
            <img
              className="rounded-2xl"
              src="/logo3.png"
              alt="Forget Password illustration"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;
