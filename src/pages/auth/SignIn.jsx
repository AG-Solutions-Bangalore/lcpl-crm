import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import toast, { Toaster } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp, setUserInfo } = useContext(ContextPanel);
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
    formData.append("username", email);
    formData.append("password", password);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(`${BASE_URL}/api/web-login`, formData);

      if (res.status === 200) {
        const { token, user } = res.data.UserInfo;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("branchId", user.branch_id);
          localStorage.setItem("userTypeId", user.user_type_id);
          localStorage.setItem("mobile", user.mobile);
          setUserInfo({
            branchId: user.branch_id,
            userTypeId: user.user_type_id,
          });

          if (
            (user.branch_id === 1 || user.branch_id === 2) &&
            user.user_type_id === 2
          ) {
            navigate("/cylinder");
          } else if (
            (user.branch_id === 1 || user.branch_id === 2) &&
            user.user_type_id === 1
          ) {
            navigate("/user-view-cylinder");
          } else {
            toast.error("Access not permitted.");
          }
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error("signin errr", error);
      toast.error("An error occurred during login.");
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
        {/* Login container */}
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
          {/* Form */}
          <div className="md:w-1/2 px-8 md:px-16">
            {/* Logo Image */}
            <div className="flex justify-center mb-4">
              <img
                src="/lcpllogo.png"
                alt="LCPL Logo"
                className="h-14 w-auto rounded-lg  "
              />
            </div>
            <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
            <p className="text-xs mt-4 text-[#002D74]">
              If you are already a member, easily log in
            </p>

            <form
              onSubmit={handleSumbit}
              method="POST"
              className="flex flex-col gap-4"
            >
              <input
                className="p-2 mt-8 rounded-xl border"
                type="username"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Mobile No"
                autocomplete="username"
              />
              <div className="relative">
                <input
                  className="p-2 rounded-xl border w-full"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autocomplete="current-password"
                />
              </div>
              <button
                type="sumbit"
                disabled={loading}
                className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
              >
                {loading ? "Checking..." : "Sign In"}
              </button>
            </form>

            <div className="mt-5 text-xs  py-4 text-[#002D74]">
              <Link to="/forget-password">Forgot your password?</Link>
            </div>
          </div>

          {/* Image */}
          <div className="md:block hidden w-1/2">
            <img
              className="rounded-2xl"
              src="/logo3.png"
              alt="Login illustration"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
