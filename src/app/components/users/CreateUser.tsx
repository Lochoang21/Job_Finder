"use client";
import React, { useState, FormEvent } from "react";
import { Modal, Button, TextInput, Select, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { GenderEnum, CreateUserDTO, CreateUserResponse } from "@/types/user";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshUserTable");

const CreateUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: "",
    email: "",
    password: "",
    address: "",
    gender: GenderEnum.MALE,
    age: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!formData.name) return setError("Name is required");
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      return setError("Valid email is required");
    if (!formData.password || formData.password.length < 6)
      return setError("Password must be at least 6 characters");
    if (!formData.address) return setError("Address is required");
    if (!formData.gender) return setError("Gender is required");
    if (formData.age <= 0) return setError("Age must be a positive number");

    setLoading(true);
    try {
      const response = await api.post<CreateUserResponse>("/users", formData);
      setSuccess(response.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        gender: GenderEnum.MALE,
        age: 0,
      });
      // Dispatch custom event to refresh table
      window.dispatchEvent(refreshTableEvent);
      setTimeout(() => setIsOpen(false), 1500); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => setIsOpen(true)}
        className="mb-4"
      >
        Add New User
      </Button>
      <Modal show={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <Modal.Header>Create New User</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" value="Name" />
              <TextInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <Label htmlFor="address" value="Address" />
              <TextInput
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
              />
            </div>
            <div>
              <Label htmlFor="gender" value="Gender" />
              <Select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value={GenderEnum.MALE}>Male</option>
                <option value={GenderEnum.FEMALE}>Female</option>
                <option value={GenderEnum.OTHER}>Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="age" value="Age" />
              <TextInput
                id="age"
                name="age"
                type="number"
                value={formData.age === 0 ? "" : formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                required
              />
            </div>
            {error && (
              <Alert color="failure">
                <span>{error}</span>
              </Alert>
            )}
            {success && (
              <Alert color="success">
                <span>{success}</span>
              </Alert>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            isProcessing={loading}
          >
            Create User
          </Button>
          <Button
            color="gray"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateUser;