
/**
 * Utility service for generating employee IDs and temporary passwords
 */
export class EmployeeGeneratorService {
    /**
     * Generate Login ID in format: [CompanyInitials][FirstName2][LastName2][Year][SerialNumber]
     * Example: OIJODO20220001
     * 
     * @param companyName - Company name (e.g., "Odoo India")
     * @param firstName - Employee's first name
     * @param lastName - Employee's last name
     * @param joiningYear - Year of joining (YYYY format)
     * @param serialNumber - Serial number for that year (0001, 0002, etc.)
     * @returns Generated employee ID
     */
    generateEmployeeId(
        companyName: string,
        firstName: string,
        lastName: string,
        joiningYear: number,
        serialNumber: number
    ): string {
        // Extract company initials (first two letters of each word, uppercase)
        const companyInitials = companyName
            .split(' ')
            .map(word => word.substring(0, 2).toUpperCase())
            .join('');

        // Extract first 2 letters of first name (uppercase)
        const firstNamePart = firstName.substring(0, 2).toUpperCase();

        // Extract first 2 letters of last name (uppercase)
        const lastNamePart = lastName.substring(0, 2).toUpperCase();

        // Format serial number with leading zeros (4 digits)
        const serialPart = serialNumber.toString().padStart(4, '0');

        // Combine all parts
        return `${companyInitials}${firstNamePart}${lastNamePart}${joiningYear}${serialPart}`;
    }

    /**
     * Generate a secure temporary password for first-time login
     * Password will contain uppercase, lowercase, numbers, and special characters
     * 
     * @param length - Length of password (default: 12)
     * @returns Generated temporary password
     */
    generateTemporaryPassword(length: number = 12): string {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialChars = '!@#$%^&*';
        
        // Ensure at least one character from each category
        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];

        // Fill the rest with random characters from all categories
        const allChars = uppercase + lowercase + numbers + specialChars;
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password to randomize position of required characters
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Get the next serial number for employee ID generation
     * Counts existing employees for the given year
     * 
     * @param year - Year to check
     * @param existingCount - Number of existing employees for that year
     * @returns Next serial number
     */
    getNextSerialNumber(existingCount: number): number {
        return existingCount + 1;
    }

    /**
     * Generate a simple 6-digit OTP for verification
     * 
     * @returns 6-digit OTP
     */
    generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

export default new EmployeeGeneratorService();
