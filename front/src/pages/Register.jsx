import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup
    .string()
    .oneOf(["mentee", "mentor"], "Please select a role")
    .required("Role is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { registerHandler, error } = useAuth();

  const steps = [
    "Account Information",
    "Personal Details",
    "Complete Registration",
  ];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "mentee",
      bio: "",
      location: "",
      interests: "",
      agreeToTerms: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      registerHandler(values);
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-600">
              <UserPlusIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
              Create an Account
            </h1>
          </div>

          {error && <div className="error">{error}</div>}

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        activeStep >= index
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div
                      className={`mt-2 text-sm ${
                        activeStep >= index
                          ? "text-blue-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-auto border-t-2 ${
                        activeStep > index
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Step 1: Account Information */}
            {activeStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formik.touched.firstName && formik.errors.firstName
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">
                        {formik.errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formik.touched.lastName && formik.errors.lastName
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">
                        {formik.errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`block w-full px-3 py-2 border ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`block w-full px-3 py-2 border ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Personal Details</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to join as a:
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="mentee"
                        checked={formik.values.role === "mentee"}
                        onChange={formik.handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">
                        Mentee (I'm seeking guidance)
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="mentor"
                        checked={formik.values.role === "mentor"}
                        onChange={formik.handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">
                        Mentor (I want to guide others)
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Short Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    placeholder="Tell us a bit about yourself, your background, and your goals."
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label
                    htmlFor="interests"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Interests/Expertise
                  </label>
                  <input
                    id="interests"
                    name="interests"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formik.values.interests}
                    onChange={formik.handleChange}
                    placeholder="E.g., Technology, Marketing, Finance (comma separated)"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review Information */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  Review Your Information
                </h2>
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        First Name
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formik.values.firstName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Last Name
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formik.values.lastName}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formik.values.email}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Role
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formik.values.role === "mentee"
                          ? "Mentee (seeking guidance)"
                          : "Mentor (providing guidance)"}
                      </p>
                    </div>
                    {formik.values.bio && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">
                          Bio
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {formik.values.bio}
                        </p>
                      </div>
                    )}
                    {formik.values.location && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">
                          Location
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {formik.values.location}
                        </p>
                      </div>
                    )}
                    {formik.values.interests && (
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">
                          Interests/Expertise
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {formik.values.interests}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formik.values.agreeToTerms}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="agreeToTerms"
                      className="font-medium text-gray-700"
                    >
                      I agree to the{" "}
                      <RouterLink
                        to="/terms"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Terms of Service
                      </RouterLink>{" "}
                      and{" "}
                      <RouterLink
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Privacy Policy
                      </RouterLink>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={activeStep === 0}
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Back
              </button>
              {activeStep === steps.length - 1 ? (
                <button
                  type="submit"
                  disabled={!formik.values.agreeToTerms}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    !formik.values.agreeToTerms
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Create Account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <RouterLink
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
