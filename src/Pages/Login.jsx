import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("https://assessmentsitebackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Something went wrong!");
        return;
      }
      
      localStorage.setItem("userId",data.user._id);
      localStorage.setItem("Token", data.token);
      localStorage.setItem("isAdmin",  data.user.isAdmin.toString()); 

      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/user"); 
      }
    } catch (error) {
      setErrorMessage("Network error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
     <div className="mb-4">
        <p className="text-red-600">To login as Admin use Email: manoj@gmail.com</p>
        <p className="text-red-600">Password: 123456</p>
        <p className="text-red-600">Sample Exam Passkey: 123456</p>
      </div>
      <div className="p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email" value="Email" />
              <Field as={TextInput} type="email" name="email" placeholder="Enter your Email" id="email" />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>
            <div>
              <Label htmlFor="password" value="Password" />
              <Field as={TextInput} type="password" name="password" placeholder="Enter your Password" id="password" />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
              {loading ? <Spinner color="info" size="sm" /> : "Sign In"}
            </Button>
          </Form>
        </Formik>
        <p className="mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600">Sign Up</Link>
        </p>


      </div>
    </div>
  );
};

export default Signin;
