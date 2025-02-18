import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Select, Card, Spinner, Alert } from "flowbite-react";

const Admin = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [collectionName, setCollectionName] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [password, setPassword] = useState("");

    const [finishClicked, setFinishClicked] = useState(false);

    const [userResults, setUserResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionResponse = await fetch("http://localhost:5000/api/question/collectionsName");
                if (!collectionResponse.ok) throw new Error("Failed to fetch collections");

                const collectionData = await collectionResponse.json();
                setCollections(collectionData.collections || []);

                const resultResponse = await fetch("http://localhost:5000/api/result/getAllResult");
                if (!resultResponse.ok) throw new Error("Failed to fetch user results");

                const resultData = await resultResponse.json();
                setUserResults(resultData.results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddQuestion = async (e) => {
        e.preventDefault();

        if (!collectionName || !questionText || !password || options.some(opt => !opt) || !correctAnswer) {
            alert("Please fill all fields.");
            return;
        }
        if (!options.includes(correctAnswer)) {
            alert("Correct answer must be one of the options.");
            return;
        }

        const newQuestion = { collectionName, questionText, options, correctAnswer, password };

        try {
            const response = await fetch("http://localhost:5000/api/question/addQuestion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQuestion),
            });

            if (!response.ok) throw new Error("Failed to add question");

            setQuestionText("");
            setOptions(["", "", "", ""]);
            setCorrectAnswer("");

            alert("Question added successfully!");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleFinish = () => {
        setFinishClicked(true);
        setCollectionName("");
        setPassword("");
    };

    const handleDeleteCollection = async (collectionName) => {
        if (window.confirm(`Are you sure you want to delete the collection "${collectionName}"?`)) {
            try {
                const response = await fetch(`http://localhost:5000/api/question/deleteCollection/${collectionName}`, {
                    method: "DELETE",
                });

                if (!response.ok) throw new Error("Failed to delete collection");

                // Filter out the deleted collection from the collections state
                setCollections((prevCollections) =>
                    prevCollections.filter((col) => col !== collectionName)
                );

                alert("Collection deleted successfully!");
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

            {error && <Alert color="failure">{error}</Alert>}

            {loading ? (
                <Spinner size="lg" />
            ) : (
                <div>
                    <h3 className="text-lg font-semibold mt-4">Existing Collections</h3>
                    {collections.length === 0 ? (
                        <p>No collections available.</p>
                    ) : (
                        <ul className="list-disc pl-5">
                            {collections.map((col, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span>{col}</span>
                                        <Button
                                            color="failure"
                                            onClick={() => handleDeleteCollection(col)}
                                            className="ml-2"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h3 className="text-lg font-semibold mt-6">User Results</h3>
                    {userResults.length === 0 ? (
                        <p>No results available.</p>
                    ) : (
                        <table className="min-w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Email</th>
                                    <th className="border border-gray-300 px-4 py-2">Collection Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userResults.map((result, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">{result.userId.email}</td>
                                        <td className="border border-gray-300 px-4 py-2">{result.collectionName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{result.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-lg font-semibold">Collection Name & Passkey</h3>
                <div>
                    <Label value="Collection Name" />
                    <TextInput
                        type="text"
                        placeholder="Enter collection name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        disabled={finishClicked}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label value="Passkey" />
                    <TextInput
                        type="password"
                        placeholder="Enter passkey"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={finishClicked}
                        required
                    />
                </div>

                {!finishClicked && (
                    <Button onClick={handleFinish} className="mt-4">
                        Finish
                    </Button>
                )}
            </div>

            <Card className="mt-6">
                <h3 className="text-lg font-semibold">Add New Question</h3>
                <form onSubmit={handleAddQuestion} className="flex flex-col gap-4">
                    <div>
                        <Label value="Question" />
                        <TextInput
                            type="text"
                            placeholder="Enter question"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label value="Options" />
                        {options.map((option, index) => (
                            <TextInput
                                key={index}
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                    const newOptions = [...options];
                                    newOptions[index] = e.target.value;
                                    setOptions(newOptions);
                                }}
                                required
                            />
                        ))}
                    </div>

                    <div>
                        <Label value="Correct Answer" />
                        <Select
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            required
                        >
                            <option value="">Select correct answer</option>
                            {options.map((opt, index) => (
                                <option key={index} value={opt}>{opt}</option>
                            ))}
                        </Select>
                    </div>

                    <Button type="submit">Add Question</Button>
                </form>
            </Card>
        </div>
    );
};

export default Admin;
