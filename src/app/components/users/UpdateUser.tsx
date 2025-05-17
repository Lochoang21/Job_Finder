"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { Modal, Button, TextInput, Select, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { GenderEnum, UpdateUserDTO, UpdateUserResponse, User } from "@/types/user";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshUserTable");

interface UpdateUserProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user, isOpen, onClose }) => {
  const [formData, setFormData] = useState<UpdateUserDTO>({
    id: 0,
    email: "",
    name: "",
    address: "",
    gender: GenderEnum.MALE,
    age: 0,
    company: null,
    role: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pre-fill form with user data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        email: user.email,
        name: user.name || "",
        address: user.address || "",
        gender: user.gender || GenderEnum.MALE,
        age: user.age || 0,
        company: user.company ? { id: user.company.id } : null,
        role: user.role ? { id: user.role.id } : null,
      });
    }
  }, [user]);

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
    if (!formData.id) return setError("User ID is required");
    if (!formData.name) return setError("Name is required");
    if (!formData.address) return setError("Address is required");
    if (!formData.gender) return setError("Gender is required");
    if (formData.age <= 0) return setError("Age must be a positive number");

    setLoading(true);
    try {
      const payload: UpdateUserDTO = {
        id: formData.id,
        email: formData.email,
        name: formData.name,
        address: formData.address,
        gender: formData.gender,
        age: formData.age,
        // company: formData.company, // Uncomment if company is editable
        // role: formData.role, // Uncomment if role is editable
      };
      const response = await api.put<UpdateUserResponse>("/users", payload);
      setSuccess(response.data.message);
      setFormData({
        id: 0,
        email: "",
        name: "",
        address: "",
        gender: GenderEnum.MALE,
        age: 0,
        company: null,
        role: null,
      });
      // Dispatch custom event to refresh table
      window.dispatchEvent(refreshTableEvent);
      setTimeout(() => onClose(), 1500); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>Update User</Modal.Header>
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
          Update User
        </Button>
        <Button color="gray" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateUser;