# 🎓 Admin Panel for MCQs

> **upGrad School of Technology**

A comprehensive and modern Admin Portal designed for creating, managing, and organizing Multiple Choice Questions (MCQs). This application leverages **Google Sheets** as a real-time database, offering a seamless and cost-effective solution for content management.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![Google Sheets API](https://img.shields.io/badge/Google_Sheets-API-34A853)

---

## 🚀 Key Features

### 📝 MCQ Management
- **Create MCQs**: Robust form with support for:
  - **Rich Text**: Markdown support for bold, italics, lists, etc.
  - **Mathematics**: Full LaTeX support (e.g., `$E=mc^2$`) for complex equations.
  - **Live Preview**: Real-time rendering of the question and options as you type.
  - **Difficulty Levels**: Categorize questions as Very Easy, Easy, Medium, Hard, or Challenge.
- **Dashboard**: Centralized hub to:
  - **Search & Filter**: Instantly find MCQs by ID, Subject, Topic, or Question text.
  - **Quick Actions**: View details, Edit content, Delete entries, and Copy IDs with a single click.
  - **Visual Indicators**: Color-coded badges for difficulty levels and correct options.

### 🏆 Contest & Assessment
- **Contest Generator**: Create contest JSON configurations by validating and aggregating specific MCQ IDs.
- **Validation**: Automatically checks if entered IDs exist in the database before generation.

### 💾 Data Persistence
- **Google Sheets Integration**: 
  - Acts as a zero-maintenance, collaborative database.
  - Real-time updates (CRUD operations).
  - Data remains accessible and portable (exportable to CSV/Excel).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `clsx` + `tailwind-merge`
- **Database**: Google Sheets (via `googleapis` Node.js client)
- **Forms**: `react-hook-form` + `zod` (Schema Validation)
- **Rendering**: 
  - `react-markdown` (Markdown to HTML)
  - `rehype-katex` & `remark-math` (LaTeX Math Rendering)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `uuid` (Unique ID generation)

---

## 📋 Google Sheets Structure

The application strictly requires the following columns in your Google Sheet.
**Note:** The header names must match exactly.

| Col | Header | Description | Data Type |
| :--- | :--- | :--- | :--- |
| **A** | `id` | Unique Identifier (UUID) | String |
| **B** | `subject` | Subject Name (e.g., Physics) | String |
| **C** | `topic` | Main Topic (e.g., Mechanics) | String |
| **D** | `subtopic` | Specific Subtopic | String |
| **E** | `type` | Question Type (e.g., MCQ) | String |
| **F** | `question` | Question Text (Markdown/LaTeX) | String |
| **G** | `optionA` | Option A Text | String |
| **H** | `optionB` | Option B Text | String |
| **I** | `optionC` | Option C Text | String |
| **J** | `optionD` | Option D Text | String |
| **K** | `correctOption`| Correct Answer Key (A/B/C/D) | Char |
| **L** | `explanation` | Solution/Explanation | String |
| **M** | `difficulty` | Difficulty Level | String |

> **Important:** Ensure your spreadsheet has these exact headers in the first row (Row 1). Data starts from Row 2.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or higher) installed.
- A **Google Cloud Project** with the "Google Sheets API" enabled.
- A **Service Account** created in that project with a JSON key file downloaded.

### 2. Google Sheet Setup
1. Create a new Google Sheet.
2. Add the headers listed above in the first row.
3. Share the sheet with your Service Account Email (found in the JSON key) and give it **Editor** access.
4. Note down the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

### 3. Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mcq-admin-panel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Rename `.env.local.example` to `.env.local`.
   - Update the file with your credentials:

   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID="your_spreadsheet_id_here"
   BASIC_AUTH_USER="admin"
   BASIC_AUTH_PASSWORD="change-me"
   ```
   > **Tip:** For the Private Key, ensure you keep the `\n` newline characters or wrap the entire key in double quotes.
   > **Security:** If `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` are set, all pages and API routes are protected with HTTP Basic Auth.

4. **Run the Application**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```bash
├── app/
│   ├── api/            # Backend API Routes (Next.js)
│   │   └── mcqs/       # CRUD endpoints for MCQs
│   ├── contest/        # Contest creation page
│   ├── create/         # New MCQ creation page
│   ├── edit/           # Edit existing MCQ page
│   ├── view/           # View MCQ details page
│   ├── globals.css     # Global styles & Tailwind directives
│   ├── layout.tsx      # Root layout & Navbar wrapper
│   └── page.tsx        # Dashboard (Home) page
├── components/
│   ├── MCQForm.tsx     # Reusable form for Create/Edit
│   ├── Navbar.tsx      # Navigation bar
│   ├── Preview.tsx     # Markdown & LaTeX renderer
│   └── ui/             # Reusable UI components (Button, Input, etc.)
├── lib/
│   └── googleSheets.ts # Google Sheets API client helper
└── public/             # Static assets
```

---

## 🔧 Troubleshooting

- **Error: "No sheets found"**: Ensure your Google Sheet is not empty and has at least one sheet (tab).
- **Error: "Missing Google Sheets credentials"**: Double-check your `.env.local` file. Ensure the variable names match exactly.
- **Error: "Unable to parse range"**: Ensure your Sheet title is valid. The app escapes sheet names automatically while building range strings.
- **Styles missing**: Ensure `globals.css` is imported in `layout.tsx` and Tailwind is scanning the correct directories in `tailwind.config.ts`.
- **Lint command asks setup questions**: Ensure `eslint.config.mjs` exists and run `npm run lint`.

---

## 📜 License

Licensed under the Apache License 2.0. See `LICENSE`.
