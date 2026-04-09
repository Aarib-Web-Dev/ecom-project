import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Signup() {
    const BASEURL = import.meta.env.VITE_BASE_URL;
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: ""
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
        const response = await fetch(`${BASEURL}/api/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },    
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (response.ok) {
            setMessage("Registration successful! Redirecting...");
            setTimeout(() => navigate("/login"), 1500);
        } else {  
            // This logic helps extract the specific error from Django
            if (typeof data === 'object') {
                const firstError = Object.values(data)[0];
                setMessage(Array.isArray(firstError) ? firstError[0] : "Invalid data provided.");
            } else {
                setMessage(data.detail || "Registration failed.");
            }
        }
    } catch (error) {
        setMessage("An error occurred. Please try again.");
    }       
}

    return (            
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6"> 
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md" >
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
               <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input 
                        name="username" 
                        required
                        onChange={handleChange} 
                        placeholder="Username" 
                        className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />

                    <input 
                        name="email" 
                        type="email" // Changed to email type for validation
                        required
                        onChange={handleChange} 
                        placeholder="Email" 
                        className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />

                    <input 
                        name="password" 
                        type="password" 
                        required
                        onChange={handleChange} 
                        placeholder="Password" 
                        className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                        name="password2" 
                        type="password" 
                        required
                        onChange={handleChange} 
                        placeholder="Confirm Password" 
                        className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />

                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition duration-200"
                    >
                        Register
                    </button>         
                </form>

                {message && (
                    <p className={`mt-4 text-sm text-center ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Signup;