import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const initialValues = { userName: "", email: "", password: "" };

  const validationSchema = Yup.object({
    userName: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, "Only alphanumeric & underscores allowed")
      .min(3, "Must be at least 3 characters")
      .max(36, "Must not exceed 36 characters")
      .required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("https://assessmentsitebackend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Something went wrong!");
        return;
      }

      navigate("/login");
    } catch (error) {
      setErrorMessage("Network error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="userName" value="Username" />
              <Field as={TextInput} type="text" name="userName" placeholder="Enter your username" id="userName" />
              <ErrorMessage name="userName" component="p" className="text-red-500 text-sm" />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <Field as={TextInput} type="email" name="email" placeholder="Enter your email" id="email" />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>
            <div>
              <Label htmlFor="password" value="Password" />
              <Field as={TextInput} type="password" name="password" placeholder="Enter your password" id="password" />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
              {loading ? <Spinner color="info" size="sm" /> : "Sign Up"}
            </Button>
          </Form>
        </Formik>
        <p className="mt-4">
          Already have an account? <Link to="/login" className="text-blue-600">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
