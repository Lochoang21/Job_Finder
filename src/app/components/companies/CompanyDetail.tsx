
"use client";
import React from "react";
import { Button, Drawer, DrawerHeader, DrawerItems, Label, Badge } from "flowbite-react";
import { Company } from "@/types/company";

interface CompanyDetailProps {
    company: Company | null;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({
    company, isOpen, onOpen, onClose,
}) => {

    return (
        <>
            <Drawer open={isOpen} onClose={onClose} position="right" className="w-96 max-w-full p-10">
                <DrawerHeader title="CompanyDetail" />
                <DrawerItems>
                    {company ? (
                        <div className="space-y-4">
                            <div>
                                {company.logo ? (
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        className="h-12 w-12 rounded-full object-contain border border-gray-200 shadow-sm transition-transform hover:scale-110 dark:border-gray-600"
                                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                                    />
                                ) : (
                                    "N/A"
                                )}
                            </div>
                            <div>
                                <Label value="ID" className="font-semibold" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">:   {company.id}</span>
                            </div>
                            <div>
                                <Label value="Name" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">{company.name}</p>
                            </div>
                            <div>
                                <Label value="Address" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.address || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Description" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.description || "N/A"}
                                </p>
                            </div>

                            <div>
                                <Label value="Created At" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.createAt
                                        ? new Date(company.createAt).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Create By" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.createBy || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Update At" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.updateAt
                                        ? new Date(company.updateAt).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Update By" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {company.updateBy || "N/A"}
                                </p>
                            </div>
                        </div>
                    ) : (

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No user selected
                        </p>
                    )}
                    <div className="mt-6 grid grid-cols-1 gap-4">
                        <Button color="gray" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DrawerItems>
            </Drawer>
        </>
    );
}
export default CompanyDetail;