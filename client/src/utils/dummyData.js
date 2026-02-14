// Dummy data for the Election Management System
// TODO: Replace with actual API calls when backend is ready

export const dummyVoters = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    voterId: "V001",
    status: "Approved",
    registeredDate: "2026-01-15",
    hasVoted: false
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    voterId: "V002",
    status: "Approved",
    registeredDate: "2026-01-16",
    hasVoted: true
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    voterId: "V003",
    status: "Pending",
    registeredDate: "2026-02-10",
    hasVoted: false
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    voterId: "V004",
    status: "Approved",
    registeredDate: "2026-01-20",
    hasVoted: false
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.b@example.com",
    voterId: "V005",
    status: "Rejected",
    registeredDate: "2026-02-01",
    hasVoted: false
  }
];

export const dummyCandidates = [
  {
    id: 1,
    name: "Alice Cooper",
    email: "alice.c@example.com",
    candidateId: "C001",
    position: "President",
    status: "Approved",
    manifesto: "Committed to transparency, innovation, and student welfare. Will work towards better infrastructure and communication.",
    votes: 45,
    party: "Independent"
  },
  {
    id: 2,
    name: "Bob Taylor",
    email: "bob.t@example.com",
    candidateId: "C002",
    position: "President",
    status: "Approved",
    manifesto: "Focus on academic excellence and student engagement. Promise to enhance campus facilities and organize more events.",
    votes: 38,
    party: "Progressive Party"
  },
  {
    id: 3,
    name: "Carol Martinez",
    email: "carol.m@example.com",
    candidateId: "C003",
    position: "Vice President",
    status: "Pending",
    manifesto: "Dedicated to creating an inclusive environment and improving student support services.",
    votes: 0,
    party: "Unity Alliance"
  },
  {
    id: 4,
    name: "Daniel Lee",
    email: "daniel.l@example.com",
    candidateId: "C004",
    position: "Secretary",
    status: "Approved",
    manifesto: "Will ensure transparent communication and efficient administration of student affairs.",
    votes: 52,
    party: "Independent"
  }
];

export const dummyElections = [
  {
    id: 1,
    title: "Student Council Election 2026",
    description: "Annual election for student council representatives",
    startDate: "2026-02-20",
    endDate: "2026-02-22",
    status: "Active",
    totalVoters: 500,
    votedCount: 83,
    positions: ["President", "Vice President", "Secretary", "Treasurer"]
  },
  {
    id: 2,
    title: "Class Representative Election",
    description: "Election for class representatives across all departments",
    startDate: "2026-03-01",
    endDate: "2026-03-03",
    status: "Upcoming",
    totalVoters: 500,
    votedCount: 0,
    positions: ["Class Rep - CS", "Class Rep - ECE", "Class Rep - ME"]
  },
  {
    id: 3,
    title: "Sports Committee Election 2025",
    description: "Previous year's sports committee selection",
    startDate: "2025-11-15",
    endDate: "2025-11-20",
    status: "Completed",
    totalVoters: 450,
    votedCount: 423,
    positions: ["Sports Secretary", "Assistant Secretary"]
  }
];

export const dummyVotingHistory = [
  {
    id: 1,
    electionTitle: "Student Council Election 2026",
    votedDate: "2026-02-21",
    position: "President",
    status: "Confirmed"
  },
  {
    id: 2,
    electionTitle: "Sports Committee Election 2025",
    votedDate: "2025-11-18",
    position: "Sports Secretary",
    status: "Confirmed"
  }
];

export const dummyResults = [
  {
    electionId: 1,
    electionTitle: "Student Council Election 2026 - President",
    candidates: [
      { name: "Alice Cooper", votes: 45, percentage: 54.2 },
      { name: "Bob Taylor", votes: 38, percentage: 45.8 }
    ],
    totalVotes: 83,
    winner: "Alice Cooper"
  },
  {
    electionId: 3,
    electionTitle: "Sports Committee Election 2025 - Sports Secretary",
    candidates: [
      { name: "Michael Scott", votes: 245, percentage: 57.9 },
      { name: "Dwight Schrute", votes: 178, percentage: 42.1 }
    ],
    totalVotes: 423,
    winner: "Michael Scott"
  }
];
