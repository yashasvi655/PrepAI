import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      login(res.data);

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };


  return (

    <div
      className="min-h-screen flex items-center justify-center px-5 transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >


      {/* Theme Toggle */}

      <button
        onClick={toggleTheme}
        className="
        absolute
        top-6
        right-6
        text-xl
        p-3
        rounded-full
        shadow-md
        hover:scale-110
        transition
        "
        style={{
          backgroundColor:"var(--bg-secondary)",
        }}
      >

        {darkMode ? "☀️" : "🌙"}

      </button>



      <div className="w-full max-w-md">


        {/* Logo Section */}

        <div className="text-center mb-8">

          <h1
            className="
            text-4xl
            font-extrabold
            tracking-tight
            "
            style={{
              color:"var(--text-primary)"
            }}
          >
            PrepAI 🚀
          </h1>


          <p
            className="mt-3 text-sm"
            style={{
              color:"var(--text-secondary)"
            }}
          >
            AI powered interview preparation platform
          </p>


        </div>



        {/* Login Card */}

        <form
          onSubmit={handleSubmit}
          className="
          p-8
          rounded-3xl
          shadow-xl
          backdrop-blur
          transition
          "
          style={{
            backgroundColor:"var(--bg-secondary)"
          }}
        >


          <h2
            className="
            text-2xl
            font-bold
            mb-6
            "
            style={{
              color:"var(--text-primary)"
            }}
          >
            Welcome Back 👋
          </h2>



          {error && (

            <div
              className="
              bg-red-100
              text-red-600
              p-3
              rounded-xl
              mb-5
              text-sm
              "
            >
              {error}
            </div>

          )}




          <div className="space-y-4">


            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="
              w-full
              rounded-xl
              p-4
              border
              outline-none
              focus:ring-2
              focus:ring-blue-500
              transition
              "
            />



            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="
              w-full
              rounded-xl
              p-4
              border
              outline-none
              focus:ring-2
              focus:ring-blue-500
              transition
              "
            />


          </div>




          <button
            type="submit"
            disabled={loading}
            className="
            mt-6
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            rounded-xl
            p-4
            font-semibold
            text-lg
            transition
            hover:scale-[1.02]
            disabled:opacity-50
            "
          >

            {
              loading
              ?
              "Logging in..."
              :
              "Login"
            }


          </button>



          <p
            className="
            text-sm
            text-center
            mt-6
            "
            style={{
              color:"var(--text-secondary)"
            }}
          >

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="
              text-blue-500
              font-semibold
              hover:underline
              "
            >
              Create account
            </Link>


          </p>


        </form>


      </div>


    </div>   

  );
}

export default Login;