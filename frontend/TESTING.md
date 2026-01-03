# Testing Guide - DayFlow HRMS Frontend

## 🧪 Manual Testing Checklist

### Sign In Page (`/` or `/sign-in`)

#### Desktop Testing (1024px+)
- [ ] Page loads correctly with centered card
- [ ] Logo placeholder displays "App/Web Logo"
- [ ] Login ID/Email input field visible with label "Login ID/Email :-"
- [ ] Password input field visible with label "Password :-"
- [ ] Password toggle icon (eye) works correctly
- [ ] "SIGN IN" button is purple and uppercase
- [ ] "Don't have an account? Sign Up" link is visible and clickable
- [ ] Card has proper padding (56px vertical, 48px horizontal)
- [ ] Dark theme colors are correct

#### Tablet Testing (768px - 1023px)
- [ ] Card adjusts width appropriately
- [ ] All elements remain visible and accessible
- [ ] Font sizes are readable
- [ ] Spacing is comfortable

#### Mobile Testing (480px - 767px)
- [ ] Card padding reduces to 32px vertical, 24px horizontal
- [ ] Logo size adjusts appropriately
- [ ] Input fields are touch-friendly
- [ ] Button is easy to tap
- [ ] Text remains readable

#### Small Mobile Testing (<480px)
- [ ] Card padding reduces to 24px vertical, 20px horizontal
- [ ] All elements fit without horizontal scroll
- [ ] Font sizes adjust for small screens
- [ ] Form gap reduces to 16px
- [ ] Touch targets are at least 44px

#### Functionality Testing
- [ ] Empty form shows validation errors on submit
- [ ] Valid credentials show loading state
- [ ] Loading spinner displays during submit
- [ ] Error message displays for invalid credentials
- [ ] Form resets after successful submission

#### Validation Testing
- [ ] Login ID required error displays when empty
- [ ] Password required error displays when empty
- [ ] Error messages clear when user starts typing

---

### Sign Up Page (`/sign-up`)

#### Desktop Testing (1024px+)
- [ ] Page loads correctly with wider card (560px max)
- [ ] Logo placeholder displays correctly
- [ ] Company name input with upload icon visible
- [ ] All 6 input fields display properly:
  - Company Name :-
  - Name :-
  - Email :-
  - Phone :-
  - Password :-
  - Confirm Password :-
- [ ] Company name displays in green when entered
- [ ] Password toggle works on both password fields
- [ ] Upload icon is clickable
- [ ] "Sign Up" button is purple
- [ ] "Already have an account? Sign In" link works
- [ ] Card has proper padding (56px vertical, 60px horizontal)

#### Tablet Testing (768px - 1023px)
- [ ] Card adjusts width appropriately
- [ ] All 6 fields remain accessible
- [ ] Company name display is visible
- [ ] Upload functionality works

#### Mobile Testing (480px - 767px)
- [ ] Card padding adjusts (32px vertical, 24px horizontal)
- [ ] All fields are touch-friendly
- [ ] Company name display remains visible
- [ ] Form gap is 20px

#### Small Mobile Testing (<480px)
- [ ] Card padding minimal (24px vertical, 20px horizontal)
- [ ] No horizontal scroll
- [ ] All fields accessible
- [ ] Form gap is 16px

#### Functionality Testing
- [ ] File upload works (company logo)
- [ ] Company name displays in green after typing
- [ ] Empty form shows validation errors
- [ ] Valid form shows loading state
- [ ] Success message displays after submission

#### Validation Testing
- [ ] Company name required
- [ ] Name required
- [ ] Email required and format validated
- [ ] Phone required and 10 digits validated
- [ ] Password minimum 8 characters
- [ ] Confirm password matches password
- [ ] Upload file is image type only

---

## 🎨 Visual Testing

### Colors
- [ ] Background: `#0a0a0a`
- [ ] Card background: `#1f1f1f`
- [ ] Input background: `#2a2a2a`
- [ ] Primary button: `#a855f7`
- [ ] Company name text: `#22c55e` (green)
- [ ] Text primary: `#ffffff`
- [ ] Text secondary: `#a0a0a0`

### Typography
- [ ] Font family is Inter or system fallback
- [ ] Labels are 14px (13px on mobile)
- [ ] Inputs are 15px (14px on mobile)
- [ ] Button text is 15px (14px on mobile)
- [ ] Company display is 28px (20px on mobile)

### Spacing
- [ ] Form fields have 20px gap (16px on mobile)
- [ ] Logo has proper margin below (40px)
- [ ] Submit button has 8px margin top
- [ ] Link text has 24px margin top

---

## 🌐 Browser Testing

Test on multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 📱 Device Testing

Test on actual devices if possible:
- [ ] iPhone (various sizes)
- [ ] Android phone
- [ ] iPad
- [ ] Desktop monitor (1920x1080)
- [ ] Laptop (1366x768)

---

## ⚡ Performance Testing

- [ ] Page loads in under 2 seconds
- [ ] No console errors
- [ ] No console warnings
- [ ] Smooth animations and transitions
- [ ] Password toggle is instant
- [ ] Form submission is responsive

---

## ♿ Accessibility Testing

- [ ] Tab navigation works correctly
- [ ] Focus states are visible
- [ ] Screen reader can read labels
- [ ] Error messages are announced
- [ ] Button has proper ARIA label
- [ ] Color contrast meets WCAG AA standards

---

## 🐛 Known Issues

Document any issues found:
- None currently

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Device: ___________
Browser: ___________
Screen Size: ___________

Sign In Page: ✅ / ❌
Sign Up Page: ✅ / ❌
Responsive: ✅ / ❌
Functionality: ✅ / ❌

Notes:
_________________________________
_________________________________
```