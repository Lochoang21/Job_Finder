"use client";
import React, { useState, FormEvent } from "react";
import { Modal, Button, TextInput, Textarea, Label, Alert, FileInput } from "flowbite-react";
import api from "@/services/api";
import { CreateCompanyDTO, CreateCompanyResponse } from "@/types/company";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshCompanyTable");

interface CreateCompanyProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCompany: React.FC<CreateCompanyProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateCompanyDTO>({
    name: "",
    description: "",
    address: "",
    logo: undefined,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        setError("Logo must be an image (png, jpg, jpeg)");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  // Upload image to backend
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "company");
    const response = await api.post<{ fileName: string; uploadedAt: string }>("/files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Construct the logo URL
    return `http://localhost:8080/api/v1/files?fileName=${encodeURIComponent(response.data.fileName)}&folder=company`;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!formData.name) return setError("Name is required");

    setLoading(true);
    try {
      let logoUrl: string | undefined = undefined;
      if (logoFile) {
        logoUrl = await uploadFile(logoFile);
      }

      const payload: CreateCompanyDTO = {
        name: formData.name,
        description: formData.description || undefined,
        address: formData.address || undefined,
        logo: logoUrl,
      };

      const response = await api.post<CreateCompanyResponse>("/companies", payload);
      setSuccess(response.data.message || "Company created successfully");
      setFormData({
        name: "",
        description: "",
        address: "",
        logo: undefined,
      });
      setLogoFile(null);
      setLogoPreview(null);
      window.dispatchEvent(refreshTableEvent);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header>Create Company</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" value="Description (optional)" />
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company description"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="address" value="Address (optional)" />
            <TextInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter company address"
            />
          </div>
          <div>
            <Label htmlFor="logo" value="Logo (optional)" />
            <FileInput
              id="logo"
              name="logo"
              accept="image/png,image/jpg,image/jpeg"
              onChange={handleFileChange}
            />
            {logoPreview && (
              <div className="mt-2">
                <Label value="Logo Preview" />
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 w-16 object-contain"
                />
              </div>
            )}
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
          Create Company
        </Button>
        <Button color="gray" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCompany;