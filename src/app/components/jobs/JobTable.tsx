"use client";
import React, { useState, useEffect } from "react";
import { Badge, Dropdown, Table, TextInput, Select, Button, Spinner, Pagination, Modal, Alert } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { Job, JobResponse, DeleteJobResponse } from "@/types/job";
import CreateJob from "./CreateJob";

// Custom event for refreshing the table
const refreshTableEvent = new Event("refreshJobTable");

interface JobTableProps {
    refreshKey?: number;
}

const JobTable: React.FC<JobTableProps> = ({ refreshKey = 0 }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [meta, setMeta] = useState({ page: 1, pageSize: 5, pages: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [searchField, setSearchField] = useState("name");
    const [searchValue, setSearchValue] = useState("");
    const [internalRefreshKey, setInternalRefreshKey] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

    // Fetch jobs from API
    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const filter = searchValue ? `${searchField}~'${searchValue}'` : "";
            const response = await api.get<JobResponse>("/jobs", {
                params: { page, size, filter },
            });
            setJobs(response.data.data.result);
            setMeta(response.data.data.meta);
            console.log("Jobs fetched:", response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch jobs");
            console.error("Fetch jobs error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Listen for custom refresh event
    useEffect(() => {
        const handleRefresh = () => {
            setInternalRefreshKey((prev) => prev + 1);
        };
        window.addEventListener("refreshJobTable", handleRefresh);
        return () => {
            window.removeEventListener("refreshJobTable", handleRefresh);
        };
    }, []);

    // Fetch data when page, size, search, refreshKey, or internalRefreshKey changes
    useEffect(() => {
        fetchJobs();
    }, [page, size, searchField, searchValue, refreshKey, internalRefreshKey]);

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchJobs();
    };

    // Handle delete job
    const handleDelete = async () => {
        if (!selectedJob) return;
        setDeleteError(null);
        setDeleteSuccess(null);
        setLoading(true);
        try {
            const response = await api.delete<DeleteJobResponse>(`/jobs/${selectedJob.id}`);
            setDeleteSuccess(response.data.message || "Job deleted successfully");
            window.dispatchEvent(refreshTableEvent);
            setTimeout(() => {
                setIsDeleteModalOpen(false);
                setSelectedJob(null);
            }, 1500);
        } catch (err: any) {
            setDeleteError(err.response?.data?.message || "Failed to delete job");
        } finally {
            setLoading(false);
        }
    };

    // Table action items (View, Edit, Delete)
    const tableActionData = [
        {
            icon: "solar:eye-linear",
            listtitle: "View",
            onClick: (job: Job) => {
                setSelectedJob(job);
                setIsDrawerOpen(true);
            },
        },
        {
            icon: "solar:pen-new-square-broken",
            listtitle: "Edit",
            onClick: (job: Job) => {
                setSelectedJob(job);
                setIsUpdateModalOpen(true);
            },
        },
        {
            icon: "solar:trash-bin-minimalistic-outline",
            listtitle: "Delete",
            onClick: (job: Job) => {
                setSelectedJob(job);
                setIsDeleteModalOpen(true);
            },
        },
    ];


    return (
        <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
            <div className="flex justify-between items-center mb-4">
                <h5 className="card-title">Jobs</h5>
                <Button color="primary" onClick={() => setIsCreateModalOpen(true)}>
                    Create Job
                </Button>
            </div>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="my-4 flex gap-4 items-center">
                <Select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="w-32"
                >
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                    <option value="level">Level</option>
                </Select>
                <TextInput
                    type="text"
                    placeholder={`Search by ${searchField}`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-64"
                />
                <Button type="submit" color="primary">
                    Search
                </Button>
                {searchValue && (
                    <Button
                        color="light"
                        onClick={() => {
                            setSearchValue("");
                            setPage(1);
                        }}
                    >
                        Clear
                    </Button>
                )}
            </form>

            {/* Loading and Error States */}
            {loading && (
                <div className="flex justify-center my-4">
                    <Spinner size="lg" />
                </div>
            )}
            {error && (
                <div className="text-red-500 text-center my-4">{error}</div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell className="p-6">ID</Table.HeadCell>
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.HeadCell>Location</Table.HeadCell>
                            <Table.HeadCell>Salary</Table.HeadCell>
                            <Table.HeadCell>Level</Table.HeadCell>
                            <Table.HeadCell>Active</Table.HeadCell>
                            <Table.HeadCell>Created At</Table.HeadCell>
                            <Table.HeadCell>Updated At</Table.HeadCell>
                            <Table.HeadCell></Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y divide-border dark:divide-darkborder">
                            {jobs.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={10} className="text-center">
                                        No jobs found
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            {jobs.map((job) => (
                                <Table.Row key={job.id}>
                                    <Table.Cell className="whitespace-nowrap ps-6">{job.id}</Table.Cell>
                                    <Table.Cell>{job.name || "N/A"}</Table.Cell>
                                    <Table.Cell>{job.location || "N/A"}</Table.Cell>
                                    <Table.Cell>${job.salary.toLocaleString()}</Table.Cell>
                                    <Table.Cell>{job.level || "N/A"}</Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            color={job.active ? "success" : "failure"}
                                            className={job.active ? "text-green-800" : "text-red-800"}
                                        >
                                            {job.active ? "Yes" : "No"}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {job.createAt ? new Date(job.createAt).toLocaleDateString() : "N/A"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {job.updateAt ? new Date(job.updateAt).toLocaleDateString() : "N/A"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            label=""
                                            dismissOnClick={false}
                                            renderTrigger={() => (
                                                <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                                                    <HiOutlineDotsVertical size={22} />
                                                </span>
                                            )}
                                        >
                                            {tableActionData.map((item, index) => (
                                                <Dropdown.Item key={index} className="flex gap-3" onClick={() => item.onClick?.(job)}>
                                                    <Icon icon={item.icon} height={18} />
                                                    <span>{item.listtitle}</span>
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && jobs.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                    <div>
                        Showing {meta.pageSize * (meta.page - 1) + 1} to{" "}
                        {Math.min(meta.pageSize * meta.page, meta.total)} of {meta.total} jobs
                    </div>
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.pages}
                        onPageChange={(newPage) => setPage(newPage)}
                        showIcons
                    />
                </div>
            )}

            <CreateJob
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Job Detail */}
            {/* <JobDetail
        job={selectedJob}
        isOpen={isDrawerOpen}
        onOpen={() => setIsDrawerOpen(true)}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedJob(null);
        }}
      /> */}
            {/* Update Job */}
            {/* <UpdateJob
        job={selectedJob}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedJob(null);
        }}
      /> */}
            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="md">
                <Modal.Header>Confirm Deletion</Modal.Header>
                <Modal.Body>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete job{" "}
                        <span className="font-semibold">{selectedJob?.name}</span>?
                    </p>
                    {deleteError && (
                        <Alert color="failure" className="mt-4">
                            <span>{deleteError}</span>
                        </Alert>
                    )}
                    {deleteSuccess && (
                        <Alert color="success" className="mt-4">
                            <span>{deleteSuccess}</span>
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="failure"
                        onClick={handleDelete}
                        disabled={loading}
                        isProcessing={loading}
                    >
                        Delete
                    </Button>
                    <Button
                        color="gray"
                        onClick={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedJob(null);
                            setDeleteError(null);
                            setDeleteSuccess(null);
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default JobTable;