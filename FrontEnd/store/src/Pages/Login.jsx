import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../Utils/auth";


function Login() {
    const BASEURL = import.meta.env.VITE_BASE_URL;
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${BASEURL}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (response.ok) {
                saveToken(data);
                setMessage("Login successful!");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setMessage(data.detail || "Login failed. Please try again.");
            }

        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="max-w-md w-full bg-white p-6 rounded shadow" >
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    <input name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Login
                    </button>
                </form>
                {message && <p className="text-red-500 mt-3">{message}</p>}
                <div className="mt-4 text-sm text-gray-600">
                    <p>Don't have an account?
                        <a href="/register" className="text-yellow-700 hover:underline">SignUp here</a></p>
                </div>
            </div>

        </div>

    );
}

export default Login;