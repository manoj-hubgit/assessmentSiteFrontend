import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to the Quiz App</h1>
      <p className="text-gray-700 mt-2">Test your knowledge with our quiz collections</p>
      <div className="mt-4 flex justify-center">
        <Link to="/user">
          <Button gradientMonochrome="cyan">Start Assessment</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
