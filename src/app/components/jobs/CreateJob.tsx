"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { Modal, Button, TextInput, Textarea, Select, Checkbox, Label, Alert } from "flowbite-react";
import api from "@/services/api";
import { CreateJobDTO, JobResponse, } from "@/types/job";
import { Skill, SkillResponse } from "@/types/skill";
import { Company, CompanyResponse } from "@/types/company";

interface CreateJobProps {
    isOpen: boolean;
    onClose: () => void;
}

const refreshTableEvent = new Event("refreshJobTable");

const CreateJob: React.FC<CreateJobProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<CreateJobDTO>({
        name: "",
        location: "",
        salary: 0,
        quantity: 0,
        level: "FRESHER",
        description: "",
        startDate: "",
        endDate: "",
        active: true,
        skills: [] as number[],
        companyId: 0,
    });
    const [skills, setSkills] = useState<Skill[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch skills and companies
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get<SkillResponse>("/skills");
                setSkills(response.data.data.result);
                console.log("Skills fetched:", response.data.data.result);
            } catch (err: any) {
                console.error("Fetch skills error:", err.response?.data || err.message);
            }
        };
        const fetchCompanies = async () => {
            try {
                const response = await api.get<CompanyResponse>("/companies");
                setCompanies(response.data.data.result);
                console.log("Companies fetched:", response.data.data.result);
            } catch (err: any) {
                console.error("Fetch companies error:", err.response?.data || err.message);
            }
        };
        if (isOpen) {
            fetchSkills();
            fetchCompanies();
        }
    }, [isOpen]);

    // Handle text input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            active: e.target.checked,
        }));
    };

    // Handle skills multi-select
    const handleSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
            parseInt(option.value)
        );
        setFormData((prev) => ({
            ...prev,
            skills: selectedOptions,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate required fields
        if (!formData.name) return setError("Name is required");
        if (formData.salary <= 0) return setError("Salary must be greater than 0");
        if (formData.quantity <= 0) return setError("Quantity must be greater than 0");
        if (!formData.level) return setError("Level is required");
        if (formData.companyId <= 0) return setError("Company is required");

        setLoading(true);
        try {
            // Convert skill IDs to Skill objects
            const selectedSkills = formData.skills.length > 0
                ? formData.skills.map((id) => {
                    const skill = skills.find((s) => s.id === id);
                    return skill ? { id: skill.id } : null;
                }).filter((s): s is { id: number } => s !== null)
                : undefined;

            const payload: CreateJobDTO = {
                name: formData.name,
                location: formData.location || undefined,
                salary: formData.salary,
                quantity: formData.quantity,
                level: formData.level,
                description: formData.description || undefined,
                staterDate: formData.staterDate ? new Date(formData.staterDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
                active: formData.active,
                skills: selectedSkills,
                companyId: formData.companyId,
            };

            const response = await api.post<JobResponse>("/jobs", payload);
            setSuccess(response.data.message || "Job created successfully");
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => {
                setFormData({
                    name: "",
                    location: "",
                    salary: 0,
                    quantity: 0,
                    level: "FRESHER",
                    description: "",
                    startDate: "",
                    endDate: "",
                    active: true,
                    skills: [],
                    companyId: 0,
                });
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create job");
            console.error("Create job error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="lg">
            <Modal.Header>Create Job</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter job name"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="location" value="Location (optional)" />
                        <TextInput
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter job location"
                        />
                    </div>
                    <div>
                        <Label htmlFor="salary" value="Salary" />
                        <TextInput
                            id="salary"
                            name="salary"
                            type="number"
                            value={formData.salary || ""}
                            onChange={handleChange}
                            placeholder="Enter salary"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="quantity" value="Quantity" />
                        <TextInput
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity || ""}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="level" value="Level" />
                        <Select
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            required
                        >
                            <option value="INTERNSHIP">Internship</option>
                            <option value="FRESHER">Fresher</option>
                            <option value="JUNIOR">Junior</option>
                            <option value="MIDDLE">Middle</option>
                            <option value="SENIOR">Senior</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="companyId" value="Company" />
                        <Select
                            id="companyId"
                            name="companyId"
                            value={formData.companyId || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a company</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="description" value="Description (optional)" />
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter job description"
                            rows={4}
                        />
                    </div>
                    <div>
                        <Label htmlFor="startDate" value="Start Date (optional)" />
                        <TextInput
                            id="startDate"
                            name="startDate"
                            type="datetime-local"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="endDate" value="End Date (optional)" />
                        <TextInput
                            id="endDate"
                            name="endDate"
                            type="datetime-local"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleCheckboxChange}
                        />
                        <Label htmlFor="active">Active</Label>
                    </div>
                    <div>
                        <Label htmlFor="skills" value="Skills (optional)" />
                        <Select
                            id="skills"
                            name="skills"
                            multiple
                            value={formData.skills}
                            onChange={handleSkillsChange}
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            size={5}
                        >
                            {skills.map((skill) => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                        </Select>
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
                    Create Job
                </Button>
                <Button color="gray" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateJob;