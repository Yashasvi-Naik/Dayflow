reate a complete responsive web application called Dayflow — Human Resource Management System (HRMS).

Tagline: “Every workday, perfectly aligned.”

Build both the UI/UX design and functional frontend experience. Do not create a collection of disconnected screens. Create a coherent multi-page HRMS web application with shared navigation, reusable components, realistic mock data, role-based experiences, and connected interactions.

The product should look like a polished modern SaaS product that could realistically be used by a company.

1. DESIGN SYSTEM

Use a sophisticated warm corporate aesthetic.

Color palette
Primary background: Warm Ivory #F7F2EA
Secondary background: Light Beige #EDE3D5
Cards: Soft White #FFFDFC
Primary accent: Deep Maroon #641F2B
Primary text: Dark Brown #2F2420
Secondary text: Muted Brown #806D63
Borders: Soft Beige/Brown
Success: Muted Green
Warning/Pending: Muted Amber
Error/Rejected: Muted Red

Use deep maroon as the primary brand/action color, not as the dominant background.

Typography should use a modern clean sans-serif such as Inter, Manrope, or DM Sans.

Design characteristics:

Clean
Minimal
Premium
Professional
Spacious
Corporate but approachable
Rounded cards
Subtle shadows
Thin borders
Consistent spacing
Clear typography hierarchy
Modern line icons

Avoid excessive gradients, neon colors, glassmorphism, excessive animations, or decorative elements that reduce usability.

2. APPLICATION ROLES

The application has two roles:

Employee

Employees can:

View dashboard
View/edit limited profile information
Check in and check out
View personal attendance
Apply for leave
Track leave requests
View salary information
View notifications
HR / Admin

HR can:

View workforce dashboard
Manage employees
View all attendance
Filter attendance
View leave requests
Approve/reject leave
Add comments to leave decisions
View payroll
Edit salary structures
Edit employee information

The navigation and dashboard must change depending on the logged-in role.

3. GLOBAL LAYOUT

For desktop, use a persistent left sidebar.

Sidebar:

Dayflow logo

Employee navigation:

Dashboard
My Profile
Attendance
Leave
Payroll
Notifications
Logout

HR navigation:

Dashboard
Employees
Attendance
Leave Requests
Payroll
Notifications
Logout

Use a top header containing:

Page title
Search where relevant
Notification icon
User avatar
User name
Role indicator

The sidebar should have a clear active state using deep maroon.

On mobile, collapse the sidebar into a hamburger/menu drawer.

4. LOGIN PAGE

Create a polished Dayflow login screen.

Include:

Dayflow logo
“Every workday, perfectly aligned.”
Email input
Password input
Remember me
Forgot password
Sign In button
Sign Up link

Use a split or balanced layout with the login form on one side and a subtle workplace/HR visual panel on the other.

Do not make the visual panel overly decorative.

Login should support two demo roles.

Use mock credentials:

Employee
Email: employee@dayflow.com
Password: password

HR
Email: hr@dayflow.com
Password: password

Successful login should route to the correct dashboard.

Incorrect credentials should display an error state.

5. EMPLOYEE DASHBOARD

Create a polished employee dashboard.

Header:

Good morning, Rahul.

Subtitle:

“Here’s your workday overview.”

Show four summary cards:

Today’s Attendance
Status
Check-in time
Check-out time
Working hours
Leave Balance
Paid leave
Sick leave
Unpaid leave
Pending Requests
Number of pending requests
Attendance Summary
Present
Absent
Leave

Include a large primary Check In / Check Out button.

Initial state:

“Not Checked In”

After clicking:

“Checked In — 9:12 AM”

After checkout:

“Checked Out — 6:04 PM”

Update the displayed attendance state.

Below this, include:

Attendance Overview

A weekly visual showing attendance status.

Recent Activity

Examples:

Checked in at 9:12 AM
Leave request submitted
Leave request approved
Profile updated
Upcoming Leave

Show upcoming approved/pending leave.

6. EMPLOYEE PROFILE

Create a detailed My Profile page.

Header section:

Profile picture
Employee name
Employee ID
Designation
Department
Employment status

Sections:

Personal Information
Full Name
Email
Phone
Address
Job Information
Employee ID
Department
Designation
Joining Date
Employment Type
Reporting Manager
Salary Information
Basic Salary
Allowances
Deductions
Net Salary
Documents

Create document cards for:

Offer Letter
Identity Document
Joining Documents

Add Edit Profile.

Employees may edit only:

Phone
Address
Profile picture

Use a modal or side panel for editing.

7. EMPLOYEE ATTENDANCE

Create an Attendance page.

Top section:

Current date
Current status
Check-in
Check-out
Working hours

Include:

Today | This Week | This Month

filters/tabs.

Create an attendance table:

Date | Check-in | Check-out | Working Hours | Status

Status badges:

Present
Absent
Half-day
Leave

Add date navigation and filtering.

Employees can only see their own attendance.

8. EMPLOYEE LEAVE

Create a Leave Management page.

Top summary cards:

Paid Leave Remaining
Sick Leave Remaining
Unpaid Leave
Pending Requests

Primary button:

Apply for Leave

When clicked, open a clean modal/form.

Fields:

Leave Type
Start Date
End Date
Number of Days
Remarks

Leave types:

Paid Leave
Sick Leave
Unpaid Leave

Submit button:

Submit Request

After submission, add the request to Leave History with status:

Pending

Display Leave History:

Leave Type | Date Range | Days | Reason | Status | Comments

Use:

Green = Approved
Amber = Pending
Red = Rejected
9. EMPLOYEE PAYROLL

Create a read-only Payroll page.

Show:

Current Salary
Basic Salary
HRA
Allowances
Deductions
Net Salary

Use cards and a clear salary breakdown.

Add a monthly payroll history section if appropriate.

Employees cannot edit salary information.

10. NOTIFICATIONS

Create a notification panel/page.

Employee notifications:

“Your leave request has been approved.”
“You checked in at 9:12 AM.”
“Your leave request is pending.”

Show unread/read states.

Use toast notifications for important actions.

11. HR DASHBOARD

Create a separate HR/Admin dashboard.

Header:

Good morning, Ananya.

Subtitle:

“Here’s your workforce overview.”

Top KPI cards:

Total Employees

124

Present Today

108

On Leave

8

Pending Requests

5

Below the KPIs, create:

Attendance Overview

A clean chart showing:

Present
Absent
Half-day
Leave

Provide filters:

Today
This Week
This Month

Then:

Pending Leave Requests

Show recent requests with:

Employee | Leave Type | Dates | Status | Action

Actions:

Approve

Reject

Then:

Employee Directory Preview

Show a few employees and provide:

View All Employees

12. HR EMPLOYEES PAGE

Create a complete employee management page.

Header:

Employees

Subtitle:

“Manage your organization’s workforce.”

Include:

Search employee
Department filter
Employment status filter
Add Employee button

Employee table:

Employee | Employee ID | Department | Designation | Status | Actions

Actions:

View
Edit

Clicking an employee opens their detailed profile.

13. HR EMPLOYEE PROFILE

Create an HR-specific employee profile.

Include:

Profile picture
Personal details
Job details
Attendance summary
Leave history
Payroll
Documents

HR has an:

Edit Employee

button.

Unlike employees, HR can edit all employee details.

14. HR ATTENDANCE PAGE

Create a workforce attendance management page.

Include:

Date selector
Search employee
Department filter
Status filter

Table:

Employee | Department | Check-in | Check-out | Hours | Status

Statuses:

Present
Absent
Half-day
Leave

Include a summary section showing total:

Present
Absent
Half-day
On Leave
15. HR LEAVE REQUESTS

Create a dedicated Leave Requests page.

Top tabs:

Pending | Approved | Rejected | All

Table:

Employee | Leave Type | Date Range | Days | Reason | Status | Action

For pending requests show:

Approve

Reject

When Reject is selected, open a modal requesting:

Reason / Comment

When Approve is selected, immediately change status to:

Approved

The employee's Leave page and dashboard must reflect the change.

16. HR PAYROLL

Create a Payroll Management page.

Table:

Employee | Department | Basic Salary | Allowances | Deductions | Net Salary | Action

HR can:

View salary
Edit salary structure

Clicking Edit opens a salary modal.

Fields:

Basic Salary
HRA
Allowances
Deductions
Net Salary

Employees must have read-only access.

17. CORE INTERACTIONS

Make the prototype genuinely interactive.

Attendance workflow

Employee login

→ Dashboard

→ Click Check In

→ Status becomes Present

→ Check-in time appears

→ Click Check Out

→ Check-out time appears

→ Working hours displayed

Leave workflow

Employee login

→ Leave

→ Apply for Leave

→ Select Sick Leave

→ Select dates

→ Add reason

→ Submit

→ Status becomes Pending

HR workflow

HR login

→ Dashboard

→ Pending request appears

→ Leave Requests

→ Open request

→ Approve or Reject

→ Status changes

→ Employee receives notification

→ Employee dashboard reflects updated status

Profile workflow

Employee

→ My Profile

→ Edit Profile

→ Change phone/address/profile picture

→ Save

→ Profile updates

Employee management workflow

HR

→ Employees

→ Search employee

→ View employee

→ Edit employee

→ Save changes

→ Employee information updates

18. SAMPLE DATA

Populate the interface with realistic fictional data.

Employees:

Rahul Sharma — Software Engineer
Ananya Patil — HR Executive
Arjun Mehta — UI Designer
Priya Nair — Marketing Executive
Rohan Desai — Backend Developer

Use realistic:

Departments
Attendance records
Leave requests
Salary values
Notifications
Dates

Do not leave the dashboard empty.

19. ROLE-BASED ACCESS

Employee cannot access:

HR dashboard
Other employees
Other employees' attendance
Other employees' salary
HR management functions

HR can access:

All employees
All attendance
All leave requests
Payroll
Employee editing

The interface must clearly communicate which role is currently active.

20. RESPONSIVE DESIGN

Desktop:

Persistent sidebar
Multi-column dashboards
Tables
Charts
Spacious cards

Tablet:

Responsive grid
Adapted tables
Collapsible sidebar

Mobile:

Hamburger navigation
Stacked dashboard cards
Responsive forms
Horizontally scrollable tables where necessary
Touch-friendly buttons
21. COMPONENT CONSISTENCY

Create reusable components for:

Sidebar
Header
KPI cards
Buttons
Input fields
Dropdowns
Tables
Status badges
Modals
Toast notifications
Profile cards
Employee cards
Charts
Empty states
Loading states

Maintain the same component style throughout the entire application.

22. UX DETAILS

Every important action must provide feedback.

Examples:

After check-in:

“You have successfully checked in at 9:12 AM.”

After leave submission:

“Leave request submitted successfully.”

After HR approval:

“Leave request approved.”

After rejection:

“Leave request rejected.”

After profile update:

“Profile updated successfully.”

Use subtle toast notifications.

Include form validation and clear error messages.

23. IMPORTANT HACKATHON FOCUS

Prioritize a polished and functional MVP rather than unnecessary complexity.

The most important working features are:

Login
Role-based Employee/HR experience
Employee dashboard
HR dashboard
Attendance check-in/check-out
Attendance history
Leave application
HR leave approval/rejection
Employee management
Profile management
Payroll visibility
Notifications
Consistent state updates between Employee and HR

The main demonstration should be:

Employee checks in → Employee applies for leave → HR sees request → HR approves → Employee receives notification and sees approved status.

Make this workflow especially polished and obvious.

24. FINAL PRODUCT IMPRESSION

The final website should look like a real modern SaaS HR platform.

The visual identity should communicate:

Professional — Calm — Organized — Reliable — Human

Use warm ivory and beige as the foundation, deep maroon as the brand/action accent, and dark brown for typography.

Do not over-design the interface.

Focus on:

Excellent hierarchy + clean UX + realistic data + functional workflows + consistent design.

The final result should be a complete Dayflow HRMS web application rather than a static collection of mockup screens.