/**
 * Generates a Login ID based on the following format:
 * [First two letters of first name][First two letters of last name][Year of joining][Serial number]
 * 
 * Example: OIDO20220001
 * - OI → Odoo India (Company Name)
 * - DO → First two letters of employee's first name and last name
 * - 2022 → Year of Joining
 * - 0001 → Serial Number of Joining for that Year
 * 
 * @param companyName - Company name (e.g., "Odoo India")
 * @param firstName - Employee's first name
 * @param lastName - Employee's last name
 * @param yearOfJoining - Year when employee joined
 * @param serialNumber - Serial number for that year
 * @returns Generated Login ID
 */
export const generateLoginId = (
  companyName: string,
  firstName: string,
  lastName: string,
  yearOfJoining: number,
  serialNumber: number
): string => {
  // Extract first two letters from company name (or use first two words)
  const companyCode = companyName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  // Extract first two letters from first and last name
  const nameCode = (firstName.slice(0, 2) + lastName.slice(0, 2)).toUpperCase();

  // Format serial number with leading zeros (4 digits)
  const formattedSerial = serialNumber.toString().padStart(4, '0');

  return `${companyCode}${nameCode}${yearOfJoining}${formattedSerial}`;
};

/**
 * Generates a random password
 * @param length - Password length (default: 12)
 * @returns Generated password
 */
export const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};