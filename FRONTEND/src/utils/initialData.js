export const INITIAL_ALTITUDE = {
  currentMeters: 6150,
  maxMeters: 8611, // K2 Summit height
  seasonName: "Fall Semester 2026",
  peakGoal: "First Class Honors & AI Research Publication"
};

export const INITIAL_OBJECTIVES = [
  {
    id: "obj-1",
    title: "Draft K2.OS Architecture & Core Modules Specification",
    category: "Projects",
    stage: "summit", // basecamp | ascent | ridge | summit
    priority: "High",
    dueDate: "2026-07-25",
    subtasks: [
      { id: "st-1", text: "Define Mission Control & Memory Core schemas", completed: true },
      { id: "st-2", text: "Build Neural Journal sentiment tagger", completed: true },
      { id: "st-3", text: "Integrate Canvas node graph viewer", completed: true }
    ],
    altitudeImpact: 450
  },
  {
    id: "obj-2",
    title: "Complete Advanced Machine Learning OEL Submission",
    category: "Academics",
    stage: "ridge",
    priority: "Critical",
    dueDate: "2026-07-28",
    subtasks: [
      { id: "st-4", text: "Implement Transformer attention visualizer", completed: true },
      { id: "st-5", text: "Train benchmark models on GPU cluster", completed: false }
    ],
    altitudeImpact: 600
  },
  {
    id: "obj-3",
    title: "Prepare Personal Basecamp Weekly Review",
    category: "Growth",
    stage: "ascent",
    priority: "Medium",
    dueDate: "2026-07-24",
    subtasks: [
      { id: "st-6", text: "Review Neural Journal entries", completed: false },
      { id: "st-7", text: "Update Memory Core context nodes", completed: false }
    ],
    altitudeImpact: 200
  },
  {
    id: "obj-4",
    title: "Explore LMS Canvas API Integration for Auto-Sync",
    category: "Future Systems",
    stage: "basecamp",
    priority: "Low",
    dueDate: "2026-08-05",
    subtasks: [
      { id: "st-8", text: "Generate student token", completed: false },
      { id: "st-9", text: "Test course assignment webhook", completed: false }
    ],
    altitudeImpact: 150
  }
];

export const INITIAL_MEMORIES = [
  {
    id: "mem-1",
    topic: "Core Mission & Philosophy",
    category: "Values",
    content: "Inspired by K2 mountain. Believes in discipline, preparation, adaptability, and resilience. Life is an uphill climb requiring a centralized basecamp.",
    tags: ["Philosophy", "K2", "Mindset"],
    lastUpdated: "2026-07-20",
    strength: 98,
    connectedNodeIds: ["mem-2", "mem-3"]
  },
  {
    id: "mem-2",
    topic: "AI Engineering & Systems Architecture",
    category: "Interests",
    content: "Loves building second brains, custom agents, graph memory systems, and modern dark glass interfaces.",
    tags: ["AI", "React", "Architecture"],
    lastUpdated: "2026-07-21",
    strength: 92,
    connectedNodeIds: ["mem-1", "mem-4"]
  },
  {
    id: "mem-3",
    topic: "Deep Work Schedule Preference",
    category: "Preferences",
    content: "Peak cognitive focus between 08:00 AM - 12:30 PM. Prefers 90-minute Pomodoro sprints with ambient alpine audio.",
    tags: ["Productivity", "Schedule", "Focus"],
    lastUpdated: "2026-07-18",
    strength: 85,
    connectedNodeIds: ["mem-1"]
  },
  {
    id: "mem-4",
    topic: "Machine Learning Coursework & Deadlines",
    category: "Academics",
    content: "Enrolled in CS802 Advanced Machine Learning & CS704 Distributed Systems. Needs high grade retention.",
    tags: ["LMS", "ML", "Exams"],
    lastUpdated: "2026-07-22",
    strength: 90,
    connectedNodeIds: ["mem-2"]
  }
];

export const INITIAL_JOURNALS = [
  {
    id: "j-1",
    title: "Navigating the Basecamp Ridge",
    date: "2026-07-22",
    mood: "Energized",
    tags: ["Climbing", "Architecture", "Reflections"],
    content: `Today felt like reaching Camp 2. Information overhead has been high lately across LMS, scattered Google Docs, and messy task apps.

Building K2.OS is going to unify all of this. The Memory Core concept is crucial—having an AI that retains my personal preferences, active projects, and learning context means I never have to start from scratch.

Goal for tomorrow: Focus on execution of the ML assignment before diving deep into LMS API hooks.`,
    aiInsights: {
      sentiment: "Positive & Driven (88%)",
      keyThemes: ["Context Unification", "Focus Management", "Execution over Planning"],
      actionableAdvice: "Protect your 08:00 AM - 12:30 PM deep work window tomorrow for the ML assignment."
    }
  },
  {
    id: "j-2",
    title: "Overcoming Mid-Semester Cognitive Load",
    date: "2026-07-19",
    mood: "Focused",
    tags: ["Productivity", "Mindset"],
    content: `Felt slightly overwhelmed by multiple concurrent deadlines. Realized that endless task planning without execution creates anxiety. K2.OS Objectives should highlight high-altitude impact tasks first.`,
    aiInsights: {
      sentiment: "Balanced & Reflective (74%)",
      keyThemes: ["Cognitive Fatigue", "Task Prioritization"],
      actionableAdvice: "Break down large projects into <= 3 subtasks to prevent procrastination."
    }
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: "msg-1",
    sender: "assistant",
    timestamp: "15:35",
    text: "Greetings. K2 Basecamp AI online. Memory Core loaded with 4 context nodes and active objectives at 6,150m altitude. How shall we navigate your mountain today?"
  }
];

export const INITIAL_FUTURE_SYSTEMS = [
  {
    id: "sys-lms",
    name: "LMS Auto-Sync Engine",
    description: "Bi-directional sync with Canvas, Moodle, and Google Classroom to ingest assignments directly into Objectives.",
    status: "Beta Ready",
    connected: false,
    icon: "GraduationCap"
  },
  {
    id: "sys-cal",
    name: "Calendar & Focus Sentinel",
    description: "Syncs Google Calendar & Outlook. Automatically blocks out deep work periods based on Memory Core preferences.",
    status: "Active",
    connected: true,
    icon: "Calendar"
  },
  {
    id: "sys-res",
    name: "Resource Recommendation Engine",
    description: "Curates academic research papers (arXiv, PubMed) relevant to current Neural Journal topics.",
    status: "Configured",
    connected: true,
    icon: "BookOpen"
  },
  {
    id: "sys-auto",
    name: "Data Automation Workflows",
    description: "Automated daily webhooks to archive notes, back up Memory Core, and generate weekly performance metrics.",
    status: "Standby",
    connected: false,
    icon: "Workflow"
  }
];
