"use client";
import React, { useState, useEffect } from "react";
import { Badge, Dropdown, Table, TextInput, Select, Button, Spinner, Pagination } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { User, ApiResponse } from "@/types/user";

interface UserTableProps {
  refreshKey?: number;
}

const UserTable: React.FC<UserTableProps> = ({ refreshKey = 0 }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 5, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [searchField, setSearchField] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [internalRefreshKey, setInternalRefreshKey] = useState(0);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const filter = searchValue ? `${searchField}~\ '${searchValue}'` : "";
      const response = await api.get<ApiResponse>("/users", {
        params: { page, size, filter },
      });
      setUsers(response.data.data.result);
      setMeta(response.data.data.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Listen for custom refresh event
  useEffect(() => {
    const handleRefresh = () => {
      setInternalRefreshKey((prev) => prev + 1);
    };
    window.addEventListener("refreshUserTable", handleRefresh);
    return () => {
      window.removeEventListener("refreshUserTable", handleRefresh);
    };
  }, []);

  // Fetch data when page, size, search, refreshKey, or internalRefreshKey changes
  useEffect(() => {
    fetchUsers();
  }, [page, size, searchField, searchValue, refreshKey, internalRefreshKey]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // Table action items (Edit, Delete)
  const tableActionData = [
    { icon: "solar:eye-linear", listtitle: "View" },
    { icon: "solar:pen-new-square-broken", listtitle: "Edit" },
    { icon: "solar:trash-bin-minimalistic-outline", listtitle: "Delete" },
  ];

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <h5 className="card-title">Users</h5>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="my-4 flex gap-4 items-center">
        <Select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="w-32"
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
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
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Age</Table.HeadCell>
              <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder">
              {users.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={9} className="text-center">
                    No users found
                  </Table.Cell>
                </Table.Row>
              )}
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell className="whitespace-nowrap ps-6">
                    {user.id}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.name || "N/A"}</Table.Cell>
                  <Table.Cell>{user.gender || "N/A"}</Table.Cell>
                  <Table.Cell>{user.address || "N/A"}</Table.Cell>
                  <Table.Cell>{user.age || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {user.createAt
                      ? new Date(user.createAt).toLocaleDateString()
                      : "N/A"}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={user.role ? "lightsuccess" : "lightsecondary"}
                      className={user.role ? "text-success" : "text-secondary"}
                    >
                      {user.role?.name || "None"}
                    </Badge>
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
                        <Dropdown.Item key={index} className="flex gap-3">
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
      {!loading && !error && users.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {meta.pageSize * (meta.page - 1) + 1} to{" "}
            {Math.min(meta.pageSize * meta.page, meta.total)} of {meta.total}{" "}
            users
          </div>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.pages}
            onPageChange={(newPage) => setPage(newPage)}
            showIcons
          />
        </div>
      )}
    </div>
  );
};

export default UserTable;