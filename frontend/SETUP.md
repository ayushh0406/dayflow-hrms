# DayFlow HRMS - Frontend Setup & Run Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Navigate to frontend directory:**
```bash
cd /Users/abhishek/project/dayflow/dayflow-hrms/dayflow-hrms/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:5173
```

## 📁 Available Pages

### Sign In Page
- URL: `http://localhost:5173/` or `http://localhost:5173/sign-in`
- Features:
  - Login ID/Email input
  - Password input with show/hide toggle
  - Form validation
  - Loading state on submit

### Sign Up Page
- URL: `http://localhost:5173/sign-up`
- Features:
  - Company name input with logo upload
  - Name, Email, Phone inputs
  - Password with confirmation
  - Password visibility toggle
  - Form validation
  - Instructions note section

### Dashboard Page
- URL: `http://localhost:5173/dashboard`
- Features:
  - Employee grid with cards
  - Real-time search
  - Status indicators (Green/Yellow dots, Airplane icon)
  - Check In/Out button
  - Profile menu dropdown
  - NEW button for adding employees
  - Click cards to view employee details

## 🎨 Design Implementation

### Exact Design Features Implemented:

✅ **Dark Theme**
- Background: `#0a0a0a` (primary), `#1a1a1a` (secondary)
- Card background: `#1f1f1f`
- Input background: `#2a2a2a`

✅ **Purple Primary Color**
- Primary: `#a855f7`
- Primary Dark: `#9333ea`
- Primary Light: `#c084fc`

✅ **Components**
- Logo placeholder area (gray box with "App/Web Logo" text)
- Input fields with labels ending in `:-`
- Purple "SIGN IN" / "Sign Up" buttons (uppercase)
- Password toggle (eye icons using SVG)
- Upload icon for company logo
- Company name display (green text when entered)
- Responsive layout for all screen sizes

✅ **Typography**
- Font: Inter (with system fallbacks)
- Clean, modern spacing
- Proper font weights and sizes

✅ **Fully Responsive Design**
- **Desktop (1024px+)**: Larger padding and comfortable spacing
- **Tablet (768px - 1023px)**: Optimized card width and padding
- **Mobile (480px - 767px)**: Compact layout with adjusted sizes
- **Small Mobile (<480px)**: Minimized padding and font sizes

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📂 Project Structure

```
src/
├── components/
│   └── common/
│       ├── Button/          # Reusable button component
│       └── Input/           # Input with password toggle & file upload
├── pages/
│   ├── SignInPage.tsx       # Login page
│   ├── SignUpPage.tsx       # Registration page
│   └── AuthPages.module.css # Shared auth styles
├── styles/
│   ├── variables.css        # CSS variables (colors, spacing, etc.)
│   ├── global.css           # Global styles
│   └── index.css            # Root styles
├── constants/
│   ├── api.constants.ts     # API endpoints
│   └── routes.constants.ts  # Route paths
├── utils/
│   └── helpers/
│       └── employeeHelpers.ts # Login ID generation logic
└── types/
    └── enums.ts             # TypeScript enums
```

## 🎯 Key Features Implemented

### Login ID Generation Logic (As per Design Notes)

The system automatically generates Login IDs in this format:
```
[Company Code][Name Code][Year][Serial]
```

**Example:** `OIDO20220001`
- `OI` → Odoo India (Company Name - first letters)
- `DO` → Employee name (first 2 of first name + first 2 of last name)
- `2022` → Year of Joining
- `0001` → Serial Number for that year

### Password Auto-Generation

For HR/Admin creating new employees:
- System generates a secure random password
- 12 characters minimum
- Includes uppercase, lowercase, numbers, and symbols
- Employee can change on first login

### Form Validation

**Sign In:**
- Login ID/Email required
- Password required

**Sign Up:**
- Company name required
- Name required
- Email validation (format check)
- Phone validation (10 digits)
- Password minimum 8 characters
- Password confirmation match

## 🎨 Customization

### Change Colors
Edit `/src/styles/variables.css`:
```css
:root {
  --color-primary: #a855f7;  /* Change primary color */
  --bg-primary: #0a0a0a;     /* Change background */
  /* ... */
}
```

### Add New Pages
1. Create page in `/src/pages/YourPage.tsx`
2. Import in `/src/App.tsx`
3. Add route logic

## 🔐 Environment Variables

Create `.env` file in frontend root:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📱 Responsive Design

The design is fully responsive across all devices:

### Desktop (1024px and above)
- Card width: up to 560px for Sign Up, 480px for Sign In
- Comfortable padding: 56px vertical, 48-60px horizontal
- Large logo area with ample spacing
- Spacious form fields with 20px gap

### Tablet (768px - 1023px)
- Adjusted card padding for medium screens
- Optimized font sizes
- Maintained visual hierarchy

### Mobile (480px - 767px)
- Compact card padding: 32px vertical, 24px horizontal
- Reduced logo size while maintaining readability
- Adjusted form field spacing: 20px gap
- Touch-friendly input fields (13px padding)

### Small Mobile (below 480px)
- Minimal padding: 24px vertical, 20px horizontal
- Smaller font sizes for better fit
- Compact logo: 20px vertical, 32px horizontal
- Reduced form gap: 16px
- Touch-optimized buttons and inputs

## 🐛 Troubleshooting

### Port already in use
```bash
# Use different port
npm run dev -- --port 3001
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Check tsconfig.json path aliases match vite.config.ts
```

## 📝 Notes from Designer

As implemented based on the design context:

1. **Normal users cannot register** - Only HR/Admin can create employee accounts through the system
2. **Auto-generated passwords** - System creates secure first-time passwords for new employees
3. **Login ID format** - Follows the specified format: `[CompanyCode][NameCode][Year][Serial]`
4. **Password change required** - Employees must change system-generated password on first login

## 🚀 Next Steps

1. ✅ Authentication pages completed
2. ✅ Dashboard page completed
3. ⬜ Integrate with backend API
4. ⬜ Add React Router for proper routing
5. ⬜ Build Employee Profile view page
6. ⬜ Implement Attendance tracking page
7. ⬜ Create Leave management module
8. ⬜ Add Payroll section
9. ⬜ Build Reports & Analytics

## 📞 Support

For issues or questions:
1. Check console for errors (`F12` → Console tab)
2. Verify all dependencies installed
3. Ensure Node.js version is 18+

---

**Ready to build!** 🎉 Run `npm run dev` and visit `http://localhost:5173`