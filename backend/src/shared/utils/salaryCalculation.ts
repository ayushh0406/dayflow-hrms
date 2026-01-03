/**
 * Salary Component Calculation Service
 * Handles automatic calculation of salary components based on wage and percentages
 */

export interface SalaryComponent {
    name: string;
    computationType: 'FIXED' | 'PERCENTAGE';
    value: number; // Amount if FIXED, percentage if PERCENTAGE
    amount?: number; // Calculated amount
}

export interface SalaryStructure {
    wageType: 'FIXED';
    wage: number;
    components: {
        basic: SalaryComponent;
        houseRentAllowance: SalaryComponent;
        standardAllowance?: SalaryComponent;
        performanceBonus?: SalaryComponent;
        leaveTravelAllowance?: SalaryComponent;
        fixedAllowance?: SalaryComponent;
    };
    deductions: {
        providentFund: number; // PF rate as percentage (e.g., 12)
        professionalTax: number; // Fixed amount (e.g., 200)
    };
}

export interface CalculatedSalary {
    wage: number;
    components: {
        [key: string]: number;
    };
    totalAllowances: number;
    totalDeductions: number;
    grossSalary: number;
    netSalary: number;
}

export class SalaryCalculationService {
    /**
     * Calculate component amount based on wage
     * @param wage - Base wage amount
     * @param component - Salary component configuration
     * @returns Calculated amount
     */
    calculateComponentAmount(wage: number, component: SalaryComponent): number {
        if (component.computationType === 'FIXED') {
            return component.value;
        } else {
            // PERCENTAGE - calculate based on wage
            return (wage * component.value) / 100;
        }
    }

    /**
     * Calculate complete salary structure
     * @param structure - Salary structure configuration
     * @returns Calculated salary breakdown
     */
    calculateSalary(structure: SalaryStructure): CalculatedSalary {
        const { wage, components, deductions } = structure;
        const calculatedComponents: { [key: string]: number } = {};
        let totalAllowances = 0;

        // Calculate each component
        Object.entries(components).forEach(([name, component]) => {
            if (component) {
                const amount = this.calculateComponentAmount(wage, component);
                calculatedComponents[name] = amount;
                totalAllowances += amount;
            }
        });

        // Validate: Total components should not exceed wage
        if (totalAllowances > wage) {
            throw new Error(`Total salary components (${totalAllowances}) cannot exceed defined wage (${wage})`);
        }

        // Calculate deductions
        const pfAmount = (wage * deductions.providentFund) / 100;
        const taxAmount = deductions.professionalTax;
        const totalDeductions = pfAmount + taxAmount;

        // Calculate gross and net salary
        const grossSalary = totalAllowances;
        const netSalary = grossSalary - totalDeductions;

        return {
            wage,
            components: calculatedComponents,
            totalAllowances,
            totalDeductions,
            grossSalary,
            netSalary,
        };
    }

    /**
     * Example: Calculate based on standard structure
     * Wage: ₹50,000
     * Basic: 50% of wage = ₹25,000
     * HRA: 50% of Basic = ₹12,500
     * Standard Allowance: 9.16% = ₹4,580
     * Performance Bonus: 8.33% = ₹4,165
     * Leave Travel Allowance: 8.33% = ₹4,165
     * Fixed Allowance = wage - total of all components
     */
    createStandardStructure(wage: number): SalaryStructure {
        const basic: SalaryComponent = {
            name: 'Basic',
            computationType: 'PERCENTAGE',
            value: 50, // 50% of wage
        };

        const basicAmount = this.calculateComponentAmount(wage, basic);

        return {
            wageType: 'FIXED',
            wage,
            components: {
                basic,
                houseRentAllowance: {
                    name: 'House Rent Allowance',
                    computationType: 'PERCENTAGE',
                    value: 25, // 50% of basic (which is 25% of wage)
                },
                standardAllowance: {
                    name: 'Standard Allowance',
                    computationType: 'PERCENTAGE',
                    value: 9.16,
                },
                performanceBonus: {
                    name: 'Performance Bonus',
                    computationType: 'PERCENTAGE',
                    value: 8.33,
                },
                leaveTravelAllowance: {
                    name: 'Leave Travel Allowance',
                    computationType: 'PERCENTAGE',
                    value: 8.33,
                },
            },
            deductions: {
                providentFund: 12, // 12%
                professionalTax: 200, // Fixed ₹200
            },
        };
    }

    /**
     * Auto-update salary components when wage changes
     * @param oldWage - Previous wage amount
     * @param newWage - New wage amount
     * @param structure - Current salary structure
     * @returns Updated salary structure with recalculated amounts
     */
    updateSalaryComponents(
        newWage: number,
        structure: SalaryStructure
    ): CalculatedSalary {
        const updatedStructure: SalaryStructure = {
            ...structure,
            wage: newWage,
        };

        return this.calculateSalary(updatedStructure);
    }
}

export default new SalaryCalculationService();
