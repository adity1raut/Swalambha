# Election Management System - Frontend

A complete, professional Election Management System built with React for hackathons and startup demos.

## 🎯 Features

### Admin Panel
- **Dashboard**: Overview of elections, voters, and candidates
- **Voter Management**: Upload, approve, reject, and manage voters
- **Candidate Management**: Review and approve candidate applications
- **Election Setup**: Create and configure elections
- **Results**: View election results with visualizations

### Voter Panel
- **Dashboard**: Personal voting overview
- **View Elections**: Browse active, upcoming, and completed elections
- **Cast Votes**: Secure voting interface with confirmation
- **Candidate Application**: Apply as a candidate for positions
- **Voting History**: View complete voting records

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Professional styling
- **Vite** - Fast development and build tool

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Sidebar.jsx      # Admin sidebar
│   │   ├── DashboardCard.jsx # Statistics cards
│   │   ├── Table.jsx        # Data table component
│   │   ├── Modal.jsx        # Modal dialog
│   │   ├── Button.jsx       # Button component
│   │   └── FormInput.jsx    # Form input component
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── RoleSelection.jsx # Admin/Voter selection
│   │   │
│   │   ├── admin/           # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── VoterManagement.jsx
│   │   │   ├── CandidateManagement.jsx
│   │   │   ├── ElectionSetup.jsx
│   │   │   └── Results.jsx
│   │   │
│   │   └── voter/           # Voter pages
│   │       ├── VoterDashboard.jsx
│   │       ├── Elections.jsx
│   │       ├── Vote.jsx
│   │       ├── CandidateApplication.jsx
│   │       └── VotingHistory.jsx
│   │
│   ├── utils/               # Utilities
│   │   └── dummyData.js     # Mock data for demo
│   │
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📝 Usage Guide

### For Demo/Presentation

1. **Home Page** - Start here to showcase the landing page
2. **Role Selection** - Choose Admin or Voter panel
3. **Admin Panel** - Navigate through all admin features
4. **Voter Panel** - Demonstrate the voting experience

### Admin Features (Demo)
- Upload voters via CSV/Excel (UI only)
- Approve/reject voters and candidates
- Create new elections
- View election results

### Voter Features (Demo)
- View available elections
- Cast votes for candidates
- Apply as a candidate
- View voting history

## 🎨 Design Theme

- **Color Scheme**: White background with blue accents
- **Style**: Clean, modern, professional
- **Layout**: Responsive, mobile-friendly
- **Components**: Reusable and scalable

## 🔌 Backend Integration (Future)

All pages include `// TODO: Connect to backend API` comments marking where API calls should be added:

```javascript
// Example locations for API integration:
// - Voter Management: handleApprove(), handleReject()
// - Vote Submission: confirmVote()
// - Candidate Application: handleSubmit()
// - Election Creation: handleCreateElection()
```

### Suggested API Structure
```
POST   /api/voters/upload          - Upload voters
GET    /api/voters                 - Get all voters
PATCH  /api/voters/:id/approve     - Approve voter
POST   /api/elections              - Create election
GET    /api/elections              - Get elections
POST   /api/votes                  - Submit vote
POST   /api/candidates/apply       - Apply as candidate
GET    /api/results/:electionId    - Get results
```

## 🚫 What's NOT Included

This is a **frontend-only** demo:
- ❌ No backend server
- ❌ No authentication system
- ❌ No database
- ❌ No API integration
- ❌ No blockchain functionality

## 📊 Dummy Data

The application uses mock data from `src/utils/dummyData.js`:
- 5 sample voters
- 4 sample candidates
- 3 sample elections
- 2 voting history records
- 2 result sets

## 🎯 Use Cases

- **Hackathon Demo**: Complete, working UI ready to present
- **Startup Pitch**: Professional interface for fundraising
- **College Projects**: Learning React and modern web development
- **Portfolio**: Showcase full-stack development skills

## 🔧 Customization

### Changing Theme Colors
Edit Tailwind classes in components:
- Primary: `blue-600` → your color
- Success: `green-600` → your color
- Danger: `red-600` → your color

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation in `Navbar.jsx` or `Sidebar.jsx`

## 📦 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 🤝 Contributing

This is a demo project. Feel free to:
- Fork and customize
- Use as a template
- Learn from the code structure
- Extend with backend integration

## 📄 License

Open source - use freely for learning and demos.

## 👨‍💻 Development Notes

### Code Quality
- Component-based architecture
- Clean, readable code
- Proper file organization
- Consistent naming conventions
- Reusable components

### Best Practices
- React hooks for state management
- React Router for navigation
- Tailwind CSS for styling
- Modular component design
- Clear separation of concerns

---

**Built for hackathons, demos, and learning** 🚀

For questions or suggestions, check the TODO comments in the code for backend integration points.
