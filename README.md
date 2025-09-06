# OnboardX

OnboardX is a modern, multi-step onboarding application built with Next.js, React, and Zod. It provides a robust, user-friendly interface for collecting and validating employee information, including personal details, job specifics, skills, emergency contacts, and a final review step.

---

## Live Demo

- **Application:** https://onboardpage.netlify.app/
- **API Endpoint (after form submission):** https://onboardpage.netlify.app/api


## How to Run the Project

1. *Install Dependencies*

   Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

   ```bash
   npm install
   ```

2. *Start the Development Server*

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

3. *Build for Production*

   ```bash
   npm run build
   npm start
   ```

---

## Handling of Complex Logic

### 1. *Multi-Step Form Navigation and Validation*

- The onboarding process is divided into distinct steps, each represented by a dedicated React component under components/pages/.
- Form state and validation are managed using react-hook-form and zod. Each step only validates its relevant fields, improving user experience and performance.
- Navigation between steps is controlled by the main OnboardingPage.jsx component, which ensures that users cannot proceed without passing validation for the current step.

### 2. *Dynamic Skill Selection*

- Skills are dynamically loaded based on the selected department, using a mapping defined in lib/data.js. This ensures that users only see relevant skills for their role, reducing confusion and improving data quality.

### 3. *Conditional Logic and Field Requirements*

- *Remote Work Preference:* If a user selects a remote work preference greater than 50%, a "Manager Approved" checkbox appears and is required for submission. This is enforced both in the UI and in the Zod schema (lib/schemas.js).
- *Emergency Contact:* If the user's age is under 21 (calculated from their date of birth), additional guardian contact fields are displayed and validated.
- *Start Date Restrictions:* For HR and Finance departments, the start date cannot be on a Friday or Saturday. This is checked in the schema's superRefine method.

### 4. *Review and Confirmation*

- The final step (Page5_Review.jsx) presents all entered information in a read-only format for user review. Submission is only allowed after the user confirms the accuracy of their information via a required checkbox.

---

## Assumptions Made

- *Skill Data Structure:* It is assumed that lib/data.js exports a mapping of departments to arrays of skills (skillsByDepartment).
- *Phone Number Format:* All phone numbers must follow the format +1-123-456-7890, as enforced by the regular expression in the schema.
- *Profile Picture Upload:* Only JPEG and PNG files up to 2MB are accepted for profile pictures.
- *Age Calculation:* Age is calculated based on the provided date of birth, and all users must be at least 18 years old to proceed.
- *Salary Handling:* For contract roles, salary is treated as an hourly rate; for other roles, it is treated as an annual salary.
- *Form Submission:* The form data is sent to /api as a FormData object, with file and JSON fields handled appropriately.
- *UI Consistency:* All form controls use custom UI components from components/ui/ for a consistent look and feel.

---

## Folder Structure

- app/ — Next.js app entry point and global styles.
- components/ — UI components and page-level form steps.
- lib/ — Shared logic, data, and validation schemas.
- package.json — Project dependencies and scripts.

---

For further details or customization, please refer to the source code and comments