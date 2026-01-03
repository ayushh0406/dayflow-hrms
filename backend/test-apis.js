const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let hrToken = '';
let employeeToken = '';
let employeeId = '';
let leaveId = '';
let payrollId = '';

// Helper function for API calls
async function apiCall(method, endpoint, data = null, token = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const result = await response.json();

        console.log(`\n${method} ${endpoint}`);
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));

        return { status: response.status, data: result };
    } catch (error) {
        console.error(`Error in ${method} ${endpoint}:`, error.message);
        return { status: 500, error: error.message };
    }
}

// Test all APIs
async function testAllAPIs() {
    console.log('🚀 Starting API Tests...\n');
    console.log('='.repeat(60));

    // 1. Health Check
    console.log('\n📍 HEALTH CHECK');
    console.log('='.repeat(60));
    await fetch('http://localhost:5000/health');

    // 2. Sign Up - Admin
    console.log('\n👤 AUTHENTICATION - SIGN UP');
    console.log('='.repeat(60));
    const signUpAdmin = await apiCall('POST', '/auth/signup', {
        employeeId: 'EMP001',
        email: 'admin@dayflow.com',
        password: 'Admin@123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
    });
    if (signUpAdmin.data.token) adminToken = signUpAdmin.data.token;

    // 3. Sign Up - HR
    const signUpHR = await apiCall('POST', '/auth/signup', {
        employeeId: 'EMP002',
        email: 'hr@dayflow.com',
        password: 'Hr@12345',
        firstName: 'HR',
        lastName: 'Manager',
        role: 'HR'
    });
    if (signUpHR.data.token) hrToken = signUpHR.data.token;

    // 4. Sign Up - Employee
    const signUpEmployee = await apiCall('POST', '/auth/signup', {
        employeeId: 'EMP003',
        email: 'employee@dayflow.com',
        password: 'Employee@123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE'
    });
    if (signUpEmployee.data.token) {
        employeeToken = signUpEmployee.data.token;
        employeeId = signUpEmployee.data.user.id;
    }

    // 5. Sign In - Admin
    console.log('\n🔐 AUTHENTICATION - SIGN IN');
    console.log('='.repeat(60));
    const signInAdmin = await apiCall('POST', '/auth/signin', {
        email: 'admin@dayflow.com',
        password: 'Admin@123'
    });
    if (signInAdmin.data.token) adminToken = signInAdmin.data.token;

    // 6. Get Current User
    console.log('\n👨 AUTHENTICATION - GET CURRENT USER');
    console.log('='.repeat(60));
    await apiCall('GET', '/auth/me', null, adminToken);

    // 7. Get My Profile
    console.log('\n📋 EMPLOYEE - GET MY PROFILE');
    console.log('='.repeat(60));
    await apiCall('GET', '/employees/me', null, employeeToken);

    // 8. Update My Profile
    console.log('\n✏️ EMPLOYEE - UPDATE MY PROFILE');
    console.log('='.repeat(60));
    await apiCall('PUT', '/employees/me', {
        phoneNumber: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
    }, employeeToken);

    // 9. Get All Employees (Admin)
    console.log('\n👥 EMPLOYEE - GET ALL EMPLOYEES');
    console.log('='.repeat(60));
    await apiCall('GET', '/employees', null, adminToken);

    // 10. Check In
    console.log('\n⏰ ATTENDANCE - CHECK IN');
    console.log('='.repeat(60));
    await apiCall('POST', '/attendance/checkin', {
        location: 'Office',
        notes: 'On time'
    }, employeeToken);

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 11. Check Out
    console.log('\n🏁 ATTENDANCE - CHECK OUT');
    console.log('='.repeat(60));
    await apiCall('POST', '/attendance/checkout', {
        notes: 'End of day'
    }, employeeToken);

    // 12. Get Attendance Summary
    console.log('\n📊 ATTENDANCE - GET SUMMARY');
    console.log('='.repeat(60));
    await apiCall('GET', `/attendance/summary/${employeeId}?month=1&year=2026`, null, adminToken);

    // 13. Apply Leave
    console.log('\n🏖️ LEAVE - APPLY LEAVE');
    console.log('='.repeat(60));
    const leaveResponse = await apiCall('POST', '/leaves/apply', {
        leaveType: 'SICK',
        startDate: '2026-01-10',
        endDate: '2026-01-11',
        reason: 'Medical checkup',
        halfDay: false
    }, employeeToken);
    if (leaveResponse.data.data) leaveId = leaveResponse.data.data.id;

    // 14. Get All Leaves
    console.log('\n📝 LEAVE - GET ALL LEAVES');
    console.log('='.repeat(60));
    await apiCall('GET', '/leaves', null, adminToken);

    // 15. Approve Leave
    if (leaveId) {
        console.log('\n✅ LEAVE - APPROVE LEAVE');
        console.log('='.repeat(60));
        await apiCall('PATCH', `/leaves/${leaveId}/approve`, {
            approverComments: 'Approved for medical reasons'
        }, adminToken);
    }

    // 16. Get Leave Balance
    console.log('\n💼 LEAVE - GET LEAVE BALANCE');
    console.log('='.repeat(60));
    await apiCall('GET', `/leaves/balance/${employeeId}`, null, employeeToken);

    // 17. Create Payroll
    console.log('\n💰 PAYROLL - CREATE PAYROLL');
    console.log('='.repeat(60));
    const payrollResponse = await apiCall('POST', '/payroll', {
        employeeId: employeeId,
        basicSalary: 50000,
        houseRentAllowance: 15000,
        medicalAllowance: 3000,
        transportAllowance: 2000,
        otherAllowances: 5000,
        providentFund: 6000,
        taxDeduction: 8000,
        otherDeductions: 0,
        bankAccountNumber: '1234567890',
        bankName: 'State Bank',
        bankIfscCode: 'SBIN0001234',
        currency: 'INR',
        effectiveFrom: '2026-01-01'
    }, adminToken);
    if (payrollResponse.data.data) payrollId = payrollResponse.data.data.id;

    // 18. Get Employee Payroll
    console.log('\n💵 PAYROLL - GET EMPLOYEE PAYROLL');
    console.log('='.repeat(60));
    await apiCall('GET', `/payroll/employee/${employeeId}`, null, adminToken);

    // 19. Dashboard - Employee View
    console.log('\n📊 DASHBOARD - EMPLOYEE VIEW');
    console.log('='.repeat(60));
    await apiCall('GET', '/dashboard', null, employeeToken);

    // 20. Dashboard - Admin View
    console.log('\n📊 DASHBOARD - ADMIN VIEW');
    console.log('='.repeat(60));
    await apiCall('GET', '/dashboard', null, adminToken);

    console.log('\n' + '='.repeat(60));
    console.log('✅ All API Tests Completed!');
    console.log('='.repeat(60));
}

// Run tests
testAllAPIs().catch(console.error);
