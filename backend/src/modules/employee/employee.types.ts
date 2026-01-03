export interface EmployeeProfileDto {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    profilePicture?: string;
    designation?: string;
    department?: string;
    joiningDate?: Date;
    employmentType?: string;
    reportingManager?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
}

export interface UpdateEmployeeDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    profilePicture?: string;
    designation?: string;
    department?: string;
    employmentType?: string;
    reportingManager?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
}
