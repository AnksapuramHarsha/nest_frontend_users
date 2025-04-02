import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../apis/api";
import {Link} from "react-router-dom"

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // phone: string;
  organizationId: string;
  networkId: string;
  avatar: File | null;
  role: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    avatar: null,
    role: "USER"
  });

  const [errors, setErrors] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    avatar: null,
    role: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(""); // To show registration errors
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        avatar: files[0],
      });
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormData = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      avatar: null,
      role: "",
    };

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    // Phone validation with country code
    if (!formData.phone || !/^\+?\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number with country code (e.g., +919876543210).";
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = "Role is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started...");
  
    if (!validateForm()) {
      console.log("Form validation failed.");
      return;
    }
  
    const phoneNumberWithPlus = formData.phone.startsWith("+") ? formData.phone : "+91" + formData.phone;
  
    setIsLoading(true);
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("firstName", formData.firstName);
    formDataToSubmit.append("lastName", formData.lastName);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("phone", phoneNumberWithPlus);
    formDataToSubmit.append("role", formData.role);
    if (formData.avatar) {
      formDataToSubmit.append("avatar", formData.avatar);
    }
  
    console.log("FormData to be submitted:", Object.fromEntries(formDataToSubmit.entries()));
  
    try {
      console.log("Sending request to register API...");
      const response = await register(formDataToSubmit);
    
      console.log("API response received:", response);
    
      if (!response || !response.status) {
        console.error("API response is missing status:", response);
        setErrorMessage("Server did not return a valid status.");
        return;
      }
    
      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful! Navigating to login...");
        setRegistrationSuccess(true);
        navigate("/login");
      } else {
        console.log("Unexpected response status:", response.status);
        setErrorMessage(`Unexpected response: ${response.status}`);
      }
    } catch (error:any) {
      console.error("Registration error:", error);
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
    }
     finally {
      console.log("Form submission process completed.");
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-teal-400 to-blue-500 bg-cover bg-center">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 animate-pulse"></div>

      {/* Register Form */}
      <div className="relative w-full max-w-4xl p-8 bg-white bg-opacity-90 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 animate__animated animate__fadeIn">
        <h2 className="text-3xl font-semibold text-center text-teal-700 mb-6">
          Register Your Account
        </h2>

        {/* Success Message */}
        {registrationSuccess && (
          <div className="text-center text-green-500 mb-4">
            Registration successful! Redirecting to login...
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="text-center text-red-500 mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name Input */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              placeholder="Enter your first name"
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          {/* Last Name Input */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              placeholder="Enter your last name"
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Avatar File Input */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar (Optional)</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
            />
            {/* {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>} */}
          </div>

          {/* Role Dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full p-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {/* Already Have Account */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 ">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-700 hover:text-teal-900">
            Login Here!
          </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
