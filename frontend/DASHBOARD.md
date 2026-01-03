# Dashboard Page - Implementation Guide

## 🎯 Overview

The Dashboard page is the main landing page after successful login. It displays all employees in a card grid layout with their attendance status and provides quick access to check-in/out functionality.

## ✨ Features Implemented

### 1. **Header Section**
- **Company Logo**: Left side display (placeholder text or actual logo)
- **Navigation Tabs**: 
  - Employees (active)
  - Attendance
  - Time Off
- **Check In/Out Button** (Orange):
  - Shows red dot when checked out
  - Shows green dot when checked in
  - Toggles between "Check In" and "Check Out"
- **User Profile Menu** (Blue border):
  - Avatar with blue circular border
  - Dropdown menu with:
    - My Profile (opens profile in form view)
    - Log Out

### 2. **Toolbar**
- **NEW Button** (Purple): Opens new employee creation form
- **Search Bar**: Filters employees by name in real-time

### 3. **Employee Grid**
- Responsive grid layout (3-4 cards per row on desktop)
- Each card displays:
  - **Profile Picture**: Default avatar icon if no image
  - **Employee Name**: Bold, primary text
  - **Position**: Secondary text
  - **Department**: Tertiary text
  - **Status Indicator** (Top-right corner):
    - 🟢 Green dot = Present
    - ✈️ Airplane icon = On Leave
    - 🟡 Yellow dot = Absent

### 4. **Interactions**
- **Click on Card**: Opens employee profile in view-only (non-editable) mode
- **Hover Effect**: Card lifts up with shadow and purple border
- **Check In/Out**: Updates status indicator color
- **Search**: Real-time filtering of employee cards

## 📁 File Structure

```
src/
├── pages/
│   ├── DashboardPage.tsx           # Main dashboard component
│   └── DashboardPage.module.css    # Dashboard styles
├── components/
│   ├── layout/
│   │   └── Header/                 # Header with navigation & profile
│   │       ├── Header.tsx
│   │       ├── Header.module.css
│   │       └── index.ts
│   └── common/
│       ├── EmployeeCard/           # Employee card component
│       │   ├── EmployeeCard.tsx
│       │   ├── EmployeeCard.module.css
│       │   └── index.ts
│       ├── Avatar/                 # Avatar/profile picture
│       │   ├── Avatar.tsx
│       │   ├── Avatar.module.css
│       │   └── index.ts
│       └── StatusIndicator/        # Status dot/icon
│           ├── StatusIndicator.tsx
│           ├── StatusIndicator.module.css
│           └── index.ts
```

## 🎨 Design Specifications

### Colors
- **Header Background**: `#1f1f1f` (--bg-card)
- **Body Background**: `#0a0a0a` (--bg-primary)
- **Card Background**: `#1f1f1f` (--bg-card)
- **NEW Button**: `#a855f7` (purple)
- **Check In/Out Button**: `#f97316` (orange)
- **Profile Border**: `#3b82f6` (blue)

### Status Indicators
- **Green Dot**: `#22c55e` - Employee is present
- **Yellow Dot**: `#f59e0b` - Employee is absent (no time off applied)
- **Airplane Icon**: `#3b82f6` (blue background) - On leave
- **Orange Dot**: `#f97316` - Half day

### Typography
- **Card Name**: 16px, weight 600
- **Position**: 14px, secondary color
- **Department**: 13px, tertiary color
- **Nav Items**: 15px, weight 500

### Spacing
- **Card Padding**: 24px
- **Grid Gap**: 24px (16px on mobile)
- **Header Padding**: 12px vertical, 24px horizontal

## 📱 Responsive Breakpoints

### Desktop (1024px+)
```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 24px;
```

### Tablet (768px - 1023px)
```css
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
gap: 20px;
```

### Mobile (480px - 767px)
```css
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 16px;
/* Navigation tabs hidden */
```

### Small Mobile (<480px)
```css
grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
gap: 12px;
/* Toolbar becomes vertical */
```

## 🔧 Component API

### DashboardPage
```typescript
// No props - standalone page component
```

### Header
```typescript
interface HeaderProps {
  companyLogo?: string;
  companyName?: string;
  userName: string;
  userAvatar?: string;
  isCheckedIn: boolean;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}
```

### EmployeeCard
```typescript
interface EmployeeCardProps {
  id: string;
  name: string;
  profilePicture?: string;
  position?: string;
  department?: string;
  status: AttendanceStatus;
  onClick?: () => void;
}
```

### StatusIndicator
```typescript
interface StatusIndicatorProps {
  status: AttendanceStatus; // 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY'
  size?: 'sm' | 'md' | 'lg';
}
```

### Avatar
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}
```

## 🚀 Usage

### Accessing the Dashboard
```
URL: http://localhost:5173/dashboard
```

### After Sign In
The sign in page redirects to `/dashboard` on successful authentication.

## 🧪 Testing Checklist

### Desktop
- [ ] Header displays correctly with all elements
- [ ] NEW button is visible and clickable
- [ ] Search bar filters employees in real-time
- [ ] Employee cards display in grid (3-4 per row)
- [ ] Status indicators show correct icons/colors
- [ ] Cards are clickable and show hover effect
- [ ] Check In/Out button toggles status
- [ ] Profile menu opens/closes correctly
- [ ] My Profile option is clickable
- [ ] Log Out option works

### Tablet
- [ ] Grid adjusts to 2-3 cards per row
- [ ] Navigation tabs remain visible
- [ ] All functionality works

### Mobile
- [ ] Navigation tabs hidden
- [ ] Toolbar becomes vertical
- [ ] Grid shows 1-2 cards per row
- [ ] Touch-friendly card sizes
- [ ] Profile menu works on touch

## 🔄 Future Enhancements

### Phase 1 (Current)
- ✅ Display employee cards with status
- ✅ Check In/Out functionality
- ✅ Profile menu with logout
- ✅ Search employees
- ✅ Click card to view profile

### Phase 2 (Upcoming)
- [ ] Integrate with real API
- [ ] Add pagination for large employee lists
- [ ] Add filters (by department, status, etc.)
- [ ] Add sorting options
- [ ] Show employee count badge
- [ ] Add loading states
- [ ] Add empty state graphics

### Phase 3 (Advanced)
- [ ] Real-time status updates
- [ ] Bulk check-in/out
- [ ] Export employee list
- [ ] Quick actions menu per card
- [ ] Advanced search with filters
- [ ] Grid/List view toggle

## 💡 Tips

### Mock Data
Currently using mock data in `DashboardPage.tsx`. Replace with actual API calls:

```typescript
// Replace mockEmployees with:
const { data: employees, isLoading } = useEmployees();
```

### Status Colors
Status indicators automatically choose color based on attendance status:
- `PRESENT` → Green dot
- `ABSENT` → Yellow dot  
- `LEAVE` → Blue airplane icon
- `HALF_DAY` → Orange dot

### Profile View
When clicking a card, implement navigation to view-only profile:
```typescript
const handleEmployeeClick = (employeeId: string) => {
  navigate(`/employees/${employeeId}`);
  // Or show modal with profile details
};
```

## 🐛 Known Limitations

1. **No Routing**: Currently using simple path checking. Implement React Router for proper routing.
2. **Mock Data**: Employee data is hardcoded. Needs API integration.
3. **No Persistence**: Check-in status resets on refresh.
4. **No Loading States**: Add skeleton loaders for better UX.

## 📚 Related Documentation

- `SETUP.md` - Setup instructions
- `TESTING.md` - Testing guidelines
- `HRMS-STRUCTURE.md` - Overall project structure

---

**Dashboard is ready for testing! Navigate to `/dashboard` to see it in action.** 🎉