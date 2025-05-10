"use client";
import React, { useState, useEffect } from "react";
import { Dropdown, Table, TextInput, Pagination } from "flowbite-react";
import { HiOutlineDotsVertical, HiSearch } from "react-icons/hi";
import { Icon } from "@iconify/react";
import CreateUser from "../../../components/users/CreateUser";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
  gender?: string;
  address?: string;
  age?: number;
  createAt: string;
  updateAt: string;
  company?: CompanyUser;
  role?: RoleUser;
}

interface CompanyUser {
  id: string;
  name: string;
}

interface RoleUser {
  id: string;
  name: string;
}

interface ApiResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: {
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: User[];
  };
}

const UserManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safely format date
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "N/A";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "N/A";
      return parsedDate.toISOString().split("T")[0];
    } catch (err) {
      console.error("Date formatting error:", err, "Date:", date);
      return "N/A";
    }
  };

  // Fetch users from API
  const fetchUsers = async (page: number, search: string) => {
    if (!user) {
      setError("Please log in to view users");
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ApiResponse>("/users", {
        params: {
          page: page, // Backend uses 1-based indexing (meta.page starts at 1)
          size: usersPerPage,
          filter: search ? `email~'${search}'` : undefined,
        },
      });

      // Log raw response for debugging
      console.log("API Response:", response.data);

      // Validate response structure
      if (!response.data.data || !response.data.data.result || !response.data.data.meta) {
        throw new Error("Invalid response structure: Missing data, result, or meta");
      }

      const formattedUsers = response.data.data.result.map((user: any, index: number) => {
        try {
          return {
            id: user.id ? user.id.toString() : `unknown-${index}`,
            email: user.email || "N/A",
            name: user.name || "N/A",
            gender: user.gender || "N/A",
            address: user.address || "N/A",
            age: user.age || user.age === 0 ? user.age : "N/A",
            createAt: formatDate(user.createAt),
            updateAt: formatDate(user.updateAt),
            company: user.company
              ? {
                  id: user.company.id ? user.company.id.toString() : `company-${index}`,
                  name: user.company.name || "N/A",
                }
              : undefined,
            role: user.role
              ? {
                  id: user.role.id ? user.role.id.toString() : `role-${index}`,
                  name: user.role.name || "N/A",
                }
              : undefined,
          };
        } catch (err) {
          console.error(`Error processing user at index ${index}:`, err, "User:", user);
          return null;
        }
      }).filter((user: User | null) => user !== null) as User[];

      setUsers(formattedUsers);
      setTotalPages(response.data.data.meta.pages || 1);
    } catch (err: any) {
      console.error("Fetch users error:", err, "Response:", err.response?.data);
      setError(err.message || "Failed to fetch users");
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when page, search term, or user changes
  useEffect(() => {
    if (!authLoading && user) {
      fetchUsers(currentPage, searchTerm);
    }
  }, [currentPage, searchTerm, user, authLoading]);

  // Table Action Menu
  const tableActionData = [
    { icon: "solar:add-circle-outline", listtitle: "Add" },
    { icon: "solar:pen-new-square-broken", listtitle: "Edit" },
    { icon: "solar:trash-bin-minimalistic-outline", listtitle: "Delete" },
  ];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle add user
  const handleAddUser = async (newUser: Partial<User>) => {
    if (!user) {
      setError("Please log in to add a user");
      return;
    }

    try {
      await api.post("/users", newUser);
      fetchUsers(1, "");
      setSearchTerm("");
      setCurrentPage(1);
    } catch (err: any) {
      console.error("Error adding user:", err);
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <div className="flex justify-between items-center mb-4">
        <h5 className="card-title">User Management</h5>
        <CreateUser onAddUser={handleAddUser} />
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <TextInput
          id="search"
          type="text"
          icon={HiSearch}
          placeholder="Search user by Email"
          value={searchTerm}
          onChange={handleSearchChange}
          sizing="md"
        />
      </div>

      {/* Error Message */}
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

      {/* Users Table */}
      <div className="mt-3">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Age</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              
 
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>Updated At</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder">
              {authLoading || loading ? (
                <Table.Row>
                  <Table.Cell colSpan={11} className="text-center">
                    Loading...
                  </Table.Cell>
                </Table.Row>
              ) : !user ? (
                <Table.Row>
                  <Table.Cell colSpan={11} className="text-center">
                    Please log in to view users
                  </Table.Cell>
                </Table.Row>
              ) : users.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={11} className="text-center">
                    No users found
                  </Table.Cell>
                </Table.Row>
              ) : (
                users.map((user, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="font-medium">{user.id}</Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.gender}</Table.Cell>
                    <Table.Cell>{user.age}</Table.Cell>
                    <Table.Cell>{user.address}</Table.Cell>

                    <Table.Cell>{user.createAt}</Table.Cell>
                    <Table.Cell>{user.updateAt}</Table.Cell>
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
                          <Dropdown.Item key={index} className="flex gap-3">
                            <Icon icon={item.icon} height={18} />
                            <span>{item.listtitle}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
            showIcons
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;