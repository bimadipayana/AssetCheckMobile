# Product Requirements Document

# Monthly Asset Check

## 1. Product Overview

**Product Name:** Monthly Asset Check  
**Product Type:** Mobile application and web dashboard  
**Primary Use Case:** Monthly asset stock opname for branch operations  
**Primary Users:** Field officers, supervisors, and administrators

Monthly Asset Check is a system for monthly asset inspection and stock opname. The system helps field teams record the condition, location, and photo evidence of operational assets such as splicer tools, Togo Biznet Power tools, OTDR devices, cables, closures, and other company assets.

Each branch and each asset has a unique QR code. Field officers use the mobile app to scan the QR code, verify the branch or asset, fill in the monthly inspection form, upload photos, and submit the data. Supervisors and administrators use the web dashboard to monitor progress, review submissions, manage master data, generate QR codes, and export reports.

## 2. Problem Statement

The current monthly asset stock opname process is often manual and difficult to monitor. This creates several operational risks:

- Asset data may be incomplete or inconsistent.
- Photo evidence may be scattered or lost.
- Field teams may submit duplicate records for the same asset and month.
- Supervisors may not have real-time visibility of branch progress.
- Damaged, missing, or unchecked assets may be difficult to identify quickly.
- Monthly reports take too long to prepare.

## 3. Product Goals

- Make monthly asset inspection easier for field teams.
- Ensure every branch and asset can be identified through QR code scanning.
- Store inspection data, asset condition, notes, GPS information, and photo evidence in one system.
- Allow supervisors and admins to monitor monthly SO progress per branch.
- Reduce duplicate, incomplete, or inaccurate asset records.
- Speed up monthly reporting through exportable data.

## 4. Target Users

### 4.1 Field Officer

Field officers are responsible for scanning QR codes, checking physical assets, filling inspection forms, uploading photos, and submitting monthly SO data.

### 4.2 Supervisor

Supervisors monitor progress, review inspection submissions, check damaged or missing assets, and request revisions when needed.

### 4.3 Admin

Admins manage users, branches, assets, QR codes, categories, access roles, settings, and reports.

## 5. Role And Permission Summary

| Feature | Admin | Supervisor | Field Officer |
|---|---:|---:|---:|
| Login | Yes | Yes | Yes |
| Scan QR Code | Yes | Yes | Yes |
| Submit Inspection | Yes | Yes | Yes |
| View Mobile Tasks | Yes | Yes | Yes |
| View Web Dashboard | Yes | Yes | Limited |
| Manage Branches | Yes | No | No |
| Manage Assets | Yes | No | No |
| Generate QR Codes | Yes | No | No |
| Review Inspection | Yes | Yes | No |
| Request Revision | Yes | Yes | No |
| Export Reports | Yes | Yes | No |
| Manage Users | Yes | No | No |
| Manage Settings | Yes | No | No |

---

# Part A: Mobile Application Requirements

## A1. Mobile App Purpose

The mobile app is designed for field users who perform monthly asset inspections directly at branch locations. The app must be simple, fast, readable, and easy to use in operational environments.

The main mobile workflow is:

1. User logs in.
2. User opens the home screen.
3. User scans a branch QR code or asset QR code.
4. User verifies the branch or asset information.
5. User fills out the monthly inspection form.
6. User uploads asset photos.
7. User submits the inspection data.
8. Data is synced to the central system and becomes visible on the web dashboard.

## A2. Mobile Navigation

The mobile app should use bottom navigation with these main menus:

- Home
- Scan
- Tasks
- History
- Profile

Additional screens can be opened from these menus, such as photo upload, inspection detail, and upload queue.

## A3. Mobile Screens And Requirements

## A3.1 Login Screen

### Purpose

Allow authorized users to access the mobile app.

### Content

- App logo
- App name: Monthly Asset Check
- Subtitle: Monthly asset inspection for branch operations
- Email or username input
- Password input
- Login button
- Forgot password link
- Secure access message

### Functional Requirements

- User can log in using registered credentials.
- System validates email or username and password.
- System identifies user role after login.
- System stores the session securely.
- User can log out from the profile screen.

### Error States

- Invalid credentials
- Inactive account
- Network error
- Required fields are empty

## A3.2 Home Screen

### Purpose

Provide a quick overview of monthly SO progress and direct access to scanning.

### Content

- User greeting
- User name
- Assigned branch
- Current month and year
- Monthly SO progress percentage
- Total assets checked
- Total assets pending
- Total damaged assets
- Total missing assets
- Main button: Scan QR Code
- Quick menu:
  - Branch Tasks
  - Inspection History
  - Upload Queue
  - Profile

### Functional Requirements

- Show progress based on the selected or assigned branch.
- Show current monthly SO status.
- Allow user to open QR scanner from the main action.
- Allow user to open branch task list.
- Allow user to view inspection history.
- Allow user to access upload queue when offline or sync is pending.

## A3.3 QR Code Scanner Screen

### Purpose

Allow users to scan branch or asset QR codes.

### Content

- Camera scanner view
- Scanner frame
- Instruction text: Scan a branch or asset QR code
- Flashlight toggle
- Manual code entry button
- Recent scanned item preview

### Functional Requirements

- Scan and read QR codes using the device camera.
- Detect QR code type: branch or asset.
- Validate QR code against registered data.
- Redirect user to branch scan result when QR code belongs to a branch.
- Redirect user to asset scan result when QR code belongs to an asset.
- Allow manual code input if camera scan fails.

### Error States

- Invalid QR code
- QR code not registered
- Camera permission denied
- Network unavailable

## A3.4 Branch Scan Result Screen

### Purpose

Display branch information after a branch QR code is scanned.

### Display Data

- Branch name
- Branch code
- Region
- Address
- Current month SO status
- Total assets
- Checked assets
- Pending assets
- Damaged assets
- Missing assets
- Progress bar

### Actions

- View Asset List
- Scan Asset QR

### Functional Requirements

- Show accurate branch data based on scanned QR code.
- Show monthly SO progress for that branch.
- Allow user to continue to asset list.
- Allow user to scan an asset under the branch.

## A3.5 Asset Scan Result Screen

### Purpose

Display asset information after an asset QR code is scanned.

### Display Data

- Asset photo
- Asset name
- Asset category
- Asset code
- Serial number
- Assigned branch
- Default location
- Last inspection date
- Last known condition
- Current monthly inspection status

### Actions

- Start Inspection
- View History

### Functional Requirements

- Show asset details based on scanned QR code.
- Show whether the asset has already been inspected in the current month.
- Allow user to start inspection if the asset is pending or revision is required.
- Allow user to view past inspection records.

### Rules

- If the asset has already been submitted and approved for the current month, field officer cannot submit another final inspection.
- If revision is requested, field officer can update and resubmit the inspection.

## A3.6 Monthly Inspection Form Screen

### Purpose

Allow field users to submit monthly asset inspection data.

### Fields

- Month
- Year
- Branch
- Asset name
- Asset category
- Asset code
- Serial number
- Asset condition
- Current location
- Inspector name
- Notes
- GPS latitude
- GPS longitude
- Photo evidence

### Asset Condition Options

- Good
- Minor Damage
- Major Damage
- Missing
- Needs Review

### Functional Requirements

- Auto-fill branch and asset data after QR scan.
- Allow user to select asset condition.
- Allow user to enter current location.
- Allow user to add notes.
- Capture GPS coordinate if permission is granted.
- Require at least one photo before final submission.
- Allow user to save as draft.
- Allow user to submit final inspection.

### Validation Rules

- Month is required.
- Year is required.
- Branch is required.
- Asset is required.
- Condition is required.
- At least one photo is required.
- Missing asset must include notes.
- Damaged asset must include damage detail photo.
- One asset can only have one final inspection record per month.

## A3.7 Photo Upload Screen

### Purpose

Allow users to capture and upload photo evidence for asset inspection.

### Content

- Camera capture button
- Upload from gallery button
- Photo thumbnail grid
- Photo label selector
- Delete photo action
- Continue button

### Photo Label Options

- Front View
- Serial Number
- Damage Detail
- Location Proof

### Functional Requirements

- User can take a photo using camera.
- User can upload image from gallery.
- User can upload multiple photos.
- User can preview uploaded photos.
- User can remove photos before submission.
- User can assign labels to photos.
- Photos should be compressed without losing important visual detail.

## A3.8 Branch Task List Screen

### Purpose

Show all assets that need to be inspected in a selected branch.

### Content

- Branch name
- Current month
- Search bar
- Filter chips:
  - All
  - Pending
  - Checked
  - Damaged
  - Missing
- Asset list

### Asset List Item Data

- Asset thumbnail
- Asset name
- Asset category
- Asset code
- Status badge
- Last updated time

### Functional Requirements

- Display all assets assigned to the branch.
- Allow search by asset name, asset code, or serial number.
- Allow filtering by inspection status.
- Allow user to open asset detail.
- Provide floating scan button for quick QR scanning.

## A3.9 Inspection History Screen

### Purpose

Allow users to view previous inspection records.

### Content

- Month filter
- Branch filter
- Search input
- Inspection list

### Inspection List Item Data

- Asset name
- Branch
- Inspection date
- Condition status
- Inspector name
- Photo count

### Functional Requirements

- User can search inspection records.
- User can filter records by month and branch.
- User can open inspection detail.
- Field officers can only see records relevant to their access scope.

## A3.10 Inspection Detail Screen

### Purpose

Show a complete submitted inspection record.

### Display Data

- Asset name
- Asset code
- Asset category
- Branch
- Month and year
- Condition
- Location
- Inspector
- Date and time
- GPS coordinate
- Notes
- Photo gallery
- Review status

### Actions

- Share
- Download report, if allowed

### Functional Requirements

- Display all submitted data clearly.
- Show photo evidence in a gallery.
- Show review status such as submitted, approved, or revision requested.

## A3.11 Upload Queue Screen

### Purpose

Support unstable field connectivity by showing data waiting to sync.

### Content

- Connection status
- Pending upload count
- Failed upload count
- Synced count
- Queue list
- Sync Now button

### Queue Item Data

- Asset name
- Branch
- Photo count
- Upload status
- Retry action for failed items

### Functional Requirements

- Save draft or pending inspection locally when internet connection is unstable.
- Show upload status.
- Allow user to retry failed uploads.
- Sync data automatically when connection is restored.
- Allow manual sync.

## A3.12 Profile Screen

### Purpose

Allow users to view account information and access account settings.

### Content

- User avatar
- Full name
- Role
- Assigned branch
- Email
- Account details
- Change password
- Notification settings
- Help center
- Logout
- App version

### Functional Requirements

- User can view profile information.
- User can change password.
- User can log out.

---

# Part B: Website Dashboard Requirements

## B1. Website Dashboard Purpose

The website dashboard is designed for administrators and supervisors to manage master data, monitor monthly SO progress, review inspection submissions, generate QR codes, manage users, configure settings, and export reports.

The dashboard must be data-focused, professional, readable, and suitable for operational monitoring.

## B2. Website Navigation

The website dashboard should use sidebar navigation with these menus:

- Dashboard
- Branches
- Assets
- QR Codes
- Monthly SO
- Reports
- Users
- Settings

The top bar should include:

- Global search
- Month selector
- Notifications
- User profile menu

## B3. Website Pages And Requirements

## B3.1 Login Page

### Purpose

Allow admin and supervisor users to access the dashboard.

### Content

- App logo
- App name
- Email or username input
- Password input
- Login button
- Forgot password link

### Functional Requirements

- Authenticate user credentials.
- Redirect users based on role and permission.
- Prevent unauthorized dashboard access.

## B3.2 Dashboard Overview Page

### Purpose

Provide high-level visibility of monthly asset SO progress.

### Metrics

- Total assets
- Assets checked this month
- Pending assets
- Damaged assets
- Missing assets
- Completion rate
- Total branches
- Branches completed
- Branches pending

### Visual Components

- Summary cards
- Branch completion chart
- Asset condition chart
- Asset category distribution chart
- Recent inspection activity table
- Branch progress table

### Functional Requirements

- Show data based on selected month.
- Allow filtering by branch or region.
- Highlight branches with low completion.
- Highlight damaged and missing assets.
- Show latest inspection submissions.

## B3.3 Branch Management Page

### Purpose

Allow admins to manage branch master data and branch QR codes.

### Table Columns

- Branch name
- Branch code
- Region
- Address
- Total assets
- Monthly SO progress
- QR code status
- Status
- Actions

### Actions

- Add branch
- Edit branch
- View branch detail
- Deactivate branch
- Generate QR code
- Download QR code
- Print QR code

### Branch Data Fields

- Branch name
- Branch code
- Region
- Address
- Status

### Functional Requirements

- Admin can create a new branch.
- Admin can update branch data.
- Admin can deactivate a branch.
- Admin can generate unique QR code for each branch.
- Admin can download or print branch QR code.
- System prevents duplicate branch code.

## B3.4 Asset Management Page

### Purpose

Allow admins to manage asset master data and asset QR codes.

### Table Columns

- Asset photo
- Asset name
- Category
- Asset code
- Serial number
- Assigned branch
- Current condition
- Last inspection date
- QR code status
- Status
- Actions

### Actions

- Add asset
- Edit asset
- View asset detail
- Deactivate asset
- Generate QR code
- Download QR code
- Print QR code

### Asset Data Fields

- Asset name
- Asset category
- Asset code
- Serial number
- Assigned branch
- Default location
- Initial condition
- Asset photo
- Status

### Functional Requirements

- Admin can create a new asset.
- Admin can update asset information.
- Admin can assign asset to branch.
- Admin can deactivate asset.
- Admin can generate unique QR code for each asset.
- Admin can download or print asset QR code.
- System prevents duplicate asset code and serial number where required.

## B3.5 QR Code Management Page

### Purpose

Allow admins to generate, preview, download, and print QR codes for branches and assets.

### Content

- Tabs:
  - Branch QR Codes
  - Asset QR Codes
- Search bar
- Filters:
  - Branch
  - Category
  - QR status
- QR code grid or table
- QR code detail preview

### QR Item Data

- QR code preview
- Name
- Code
- Type
- Branch
- QR status
- Created date

### Actions

- Generate selected QR codes
- Download selected QR codes
- Print selected QR codes
- Regenerate QR code, admin only

### Functional Requirements

- Admin can generate QR codes individually.
- Admin can generate QR codes in bulk.
- Admin can download QR codes as image or PDF.
- Admin can print QR codes.
- System stores QR value and links it to branch or asset data.
- QR code must be readable by the mobile app scanner.

## B3.6 Monthly SO Monitoring Page

### Purpose

Allow supervisors and admins to monitor monthly inspection progress and review submitted records.

### Filters

- Month
- Branch
- Region
- Asset category
- Condition
- Inspector
- Review status

### Summary Cards

- Total required inspections
- Completed
- Pending
- Damaged
- Missing
- Revision requested

### Table Columns

- Branch
- Asset name
- Category
- Asset code
- Condition
- Inspector
- Submitted date
- Photo count
- Review status
- Actions

### Actions

- View inspection detail
- Approve inspection
- Request revision
- Export filtered data

### Functional Requirements

- Display monthly SO records for selected month.
- Show branch progress.
- Show pending assets that have not been inspected.
- Show damaged and missing assets clearly.
- Allow supervisors to approve submitted inspection records.
- Allow supervisors to request revision with notes.

## B3.7 Inspection Review Detail Page

### Purpose

Allow supervisors and admins to review complete inspection submissions.

### Display Data

- Asset photo
- Asset name
- Asset code
- Serial number
- Asset category
- Branch
- Inspection month and year
- Condition
- Current location
- Inspector
- Submitted date and time
- GPS coordinate
- Notes
- Photo evidence gallery
- Timeline activity
- Review status

### Timeline Events

- QR scanned
- Form filled
- Photos uploaded
- Submitted
- Approved or revision requested

### Actions

- Approve
- Request revision
- Export detail

### Functional Requirements

- Show all inspection data in a clear review format.
- Allow photo evidence to be enlarged.
- Allow supervisor or admin to approve inspection.
- Allow supervisor or admin to request revision with mandatory reason.
- Store review action history.

## B3.8 Reports Page

### Purpose

Allow admins and supervisors to generate and export monthly SO reports.

### Report Filters

- Month
- Branch
- Region
- Asset category
- Condition
- Inspector
- Review status

### Report Summary

- Total assets
- Checked assets
- Pending assets
- Damaged assets
- Missing assets
- Completion percentage

### Report Types

- Monthly SO report
- Branch report
- Asset category report
- Damaged asset report
- Missing asset report
- Pending asset report

### Export Options

- Export Excel
- Export PDF
- Print

### Functional Requirements

- Generate reports based on selected filters.
- Export report to Excel.
- Export report to PDF.
- Show printable layout.
- Include photo links or photo attachments based on export configuration.

## B3.9 User Management Page

### Purpose

Allow admins to manage user accounts and access roles.

### Table Columns

- Name
- Email
- Role
- Assigned branch
- Status
- Last login
- Actions

### Actions

- Add user
- Edit user
- Disable user
- Reset password
- Assign role
- Assign branch

### User Data Fields

- Full name
- Email
- Password
- Role
- Assigned branch
- Account status

### Functional Requirements

- Admin can create a user account.
- Admin can update user information.
- Admin can assign roles.
- Admin can assign branch access.
- Admin can disable inactive users.
- Admin can reset user password.
- System prevents duplicate email.

## B3.10 Settings Page

### Purpose

Allow admins to configure system settings.

### Settings Sections

- Asset Categories
- Condition Status Options
- Monthly SO Schedule
- QR Code Format
- Photo Upload Rules
- Notification Settings

### Default Asset Categories

- Splicer
- Togo Biznet Power
- OTDR
- Cable
- Closure

### Default Condition Statuses

- Good
- Minor Damage
- Major Damage
- Missing
- Needs Review

### Functional Requirements

- Admin can add, edit, or deactivate asset categories.
- Admin can configure condition options.
- Admin can configure monthly SO period.
- Admin can configure photo upload rules.
- Admin can configure notification preferences.

---

# Part C: Shared System Requirements

## C1. Authentication And Authorization

- The system must support secure login.
- The system must support role-based access control.
- The system must prevent unauthorized access to restricted pages and actions.
- User sessions must expire based on security settings.
- Passwords must be stored securely using hashing.

## C2. QR Code Requirements

- Each branch must have one unique QR code.
- Each asset must have one unique QR code.
- QR code value must identify whether the code belongs to a branch or an asset.
- QR code must be scannable from the mobile app.
- Admin must be able to generate, download, and print QR codes.
- Regenerated QR codes must be tracked in history if possible.

## C3. Photo Requirements

- Inspection must include at least one photo.
- Damaged asset should include a damage detail photo.
- Missing asset should include supporting note and optional location proof.
- Photos must be stored securely.
- Photos must be viewable from mobile history and web dashboard review pages.

## C4. Offline And Sync Requirements

- Mobile app should support saving drafts locally.
- Mobile app should queue submissions when connection is unavailable.
- Mobile app should retry failed uploads.
- Sync status must be visible to users.
- Duplicate submissions must be prevented during retry.

## C5. Notification Requirements

- Notify users when monthly SO period starts.
- Remind field officers about pending assets.
- Notify supervisors when damaged or missing assets are submitted.
- Notify field officers when revision is requested.
- Notify users when upload succeeds or fails.

## C6. Validation Rules

- One asset can only have one approved final inspection per month.
- Required fields must be completed before submission.
- Invalid QR codes must be rejected.
- Duplicate branch codes are not allowed.
- Duplicate asset codes are not allowed.
- Field officers can only submit records within their allowed branch scope, unless configured otherwise.
- Approved records cannot be edited by field officers.
- Revision records must include revision reason.

## C7. Data Objects

## C7.1 User

- id
- full_name
- email
- password_hash
- role
- branch_id
- status
- last_login_at
- created_at
- updated_at

## C7.2 Branch

- id
- branch_name
- branch_code
- region
- address
- qr_code_value
- status
- created_at
- updated_at

## C7.3 Asset

- id
- asset_name
- asset_category_id
- asset_code
- serial_number
- branch_id
- default_location
- current_condition
- asset_photo_url
- qr_code_value
- status
- created_at
- updated_at

## C7.4 Asset Category

- id
- category_name
- status
- created_at
- updated_at

## C7.5 Inspection

- id
- asset_id
- branch_id
- month
- year
- condition
- current_location
- inspector_id
- notes
- gps_latitude
- gps_longitude
- review_status
- submitted_at
- approved_by
- approved_at
- revision_reason
- created_at
- updated_at

## C7.6 Inspection Photo

- id
- inspection_id
- photo_url
- photo_label
- uploaded_at

## C7.7 QR Code

- id
- qr_code_value
- qr_type
- reference_id
- status
- generated_by
- generated_at

## C7.8 Activity Log

- id
- user_id
- activity_type
- reference_type
- reference_id
- description
- created_at

## C8. Suggested API Modules

- Authentication API
- User API
- Branch API
- Asset API
- Asset Category API
- QR Code API
- Inspection API
- Photo Upload API
- Dashboard API
- Report API
- Notification API

## C9. Suggested Tech Stack

- Mobile App: Flutter or React Native
- Web Dashboard: React.js or Next.js
- Backend: Node.js, NestJS, Express.js, or Laravel
- Database: PostgreSQL or MySQL
- Storage: Cloud storage or secure server storage
- Authentication: JWT or OAuth
- QR Code: QR code generator and scanner library
- Export: Excel and PDF generator

## C10. MVP Scope

The MVP should include:

- Mobile login
- Web login
- Role-based access
- Branch management
- Asset management
- QR code generation
- Mobile QR code scanning
- Monthly inspection form
- Photo upload
- Inspection history
- Upload queue basic support
- Dashboard overview
- Monthly SO monitoring
- Inspection review
- Excel export

## C11. Future Enhancements

- Full offline mode
- GPS geofencing
- Push notifications
- Multi-level approval workflow
- Barcode support
- AI photo validation
- Asset movement tracking
- Integration with ERP or internal asset system
- Digital signature for reports
- Advanced analytics and anomaly detection

## C12. Success Metrics

- At least 90% of assets are inspected before the monthly SO deadline.
- Duplicate monthly inspection records are reduced.
- Manual report preparation time is reduced.
- Supervisors can monitor branch progress in near real time.
- Every submitted inspection has valid photo evidence.
- Damaged and missing assets are easier to identify and follow up.

