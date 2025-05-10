"use client";
import React, { useState } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CreateUserProps {
  onAddUser: (user: any) => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onAddUser }) => {
  // Modal state
  const [openModal, setOpenModal] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    gender: "MALE",
    age: "",
    password: "",
    address: ""
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    age: "",
    password: ""
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else {
      newErrors.email = "";
    }
    
    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else {
      newErrors.username = "";
    }
    
    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a positive number";
      isValid = false;
    } else {
      newErrors.age = "";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create new user object
      const newUser = {
        id: `USR${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        email: formData.email,
        name: formData.username,
        gender: formData.gender,
        age: Number(formData.age),
        password: formData.password,
        address: formData.address,
        createAt: new Date().toISOString().split('T')[0],
        updateAt: new Date().toISOString().split('T')[0],
        status: "Active",
        statusColor: "success"
      };
      
      // Pass the new user to parent component
      onAddUser(newUser);
      
      // Reset form and close modal
      setFormData({
        email: "",
        username: "",
        gender: "MALE",
        age: "",
        password: "",
        address: ""
      });
      
      setOpenModal(false);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpenModal(true)}>
        <Icon icon="solar:clipboard-add-broken" width="24" height="24" />
        Add New User
      </Button>
      
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="lg">
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
          Create New User
        </Modal.Header>
        
        <Modal.Body>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                color={errors.email ? "failure" : undefined}
                helperText={errors.email}
                required
              />
            </div>
            
            {/* Username Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                color={errors.username ? "failure" : undefined}
                helperText={errors.username}
                required
              />
            </div>
            
            {/* Gender Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="gender" value="Gender" />
              </div>
              <Select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </Select>
            </div>
            
            {/* Age Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="age" value="Age" />
              </div>
              <TextInput
                id="age"
                name="age"
                type="number"
                placeholder="example: 22"
                value={formData.age}
                onChange={handleChange}
                color={errors.age ? "failure" : undefined}
                helperText={errors.age}
                required
              />
            </div>
            
            {/* Password Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                color={errors.password ? "failure" : undefined}
                helperText={errors.password}
                required
              />
            </div>
            
            {/* Address Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="address" value="Address" />
              </div>
              <TextInput
                id="address"
                name="address"
                type="text"
                placeholder="abc, Ho Chi Minh"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal.Body>
        
        <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
          <Button color="primary" onClick={handleSubmit}>
            Create User
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateUser;