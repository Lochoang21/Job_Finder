// auth.tsx (or types/user.ts)
export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}

export interface Permission {
    id: number;
    name: string;
    apiPath: string;
    method: string;
    module: string;
    createAt: string;
    updateAt: string | null;
    createBy: string;
    updateBy: string | null;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    active: boolean;
    createAt: string;
    updateAt: string | null;
    createBy: string;
    updateBy: string | null;
    permissions: Permission[];
}

export interface User {
    id: number;
    email: string;
    name: string | null;
    gender: GenderEnum | null;
    address: string | null;
    age: number | null;
    createAt: string | null;
    updateAt: string | null;
    company: any | null;
    role: Role | null;
}

export interface Meta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface ResultPaginationDTO {
    meta: Meta;
    result: User[];
}

export interface ApiResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResultPaginationDTO;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    address: string;
    gender: GenderEnum;
    age: number;
}

export interface ResCreateUserDTO {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: GenderEnum;
    address: string;
    createAt: string;
    company: any | null;
    role: Role | null;
}

export interface CreateUserResponse {
    statusCode: number;
    error: string | null;
    message: string;
    data: ResCreateUserDTO;
}
