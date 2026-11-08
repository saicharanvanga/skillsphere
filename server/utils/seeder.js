const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const { Skill } = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillsphere';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Skill.deleteMany();
    await Project.deleteMany();
    await Certification.deleteMany();
    console.log('[Seeder] Cleared old collections.');

    // Create Sample Student User
    const demoStudent = await User.create({
      name: 'Alex Rivera',
      email: 'student@skillsphere.edu',
      password: 'Password123!',
      headline: 'Full-Stack Developer & Pre-Final Year CSE Student',
      bio: 'Enthusiastic computer science undergraduate specializing in modern web engineering, distributed systems, and machine learning. Actively building production-grade projects and seeking 2026 software engineering internships.',
      institution: 'Metropolitan Institute of Technology',
      department: 'Computer Science & Engineering',
      graduationYear: '2026',
      socialLinks: {
        github: 'https://github.com/alexrivera-dev',
        linkedin: 'https://linkedin.com/in/alexrivera-tech',
        portfolio: 'https://alexrivera.dev',
        twitter: 'https://x.com/alexrivera_dev',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    console.log(`[Seeder] Created Demo User: ${demoStudent.email}`);

    // Create Sample Skills across all 7 categories
    const sampleSkills = [
      {
        user: demoStudent._id,
        name: 'JavaScript (ES6+)',
        category: 'Programming Languages',
        proficiencyLevel: 'Expert',
        progress: 95,
        status: 'Completed',
        description: 'Deep understanding of closures, event loop, async/await, prototypes, and modern ECMAScript features.',
      },
      {
        user: demoStudent._id,
        name: 'TypeScript',
        category: 'Programming Languages',
        proficiencyLevel: 'Advanced',
        progress: 80,
        status: 'Learning',
        description: 'Strong proficiency with type gymnastics, generics, interfaces, unions, and TS configurations in full-stack setups.',
      },
      {
        user: demoStudent._id,
        name: 'Python',
        category: 'Programming Languages',
        proficiencyLevel: 'Advanced',
        progress: 85,
        status: 'Completed',
        description: 'Used for backend microservices with FastAPI/Flask, algorithmic problem solving, and data manipulation.',
      },
      {
        user: demoStudent._id,
        name: 'React.js',
        category: 'Web Development',
        proficiencyLevel: 'Advanced',
        progress: 90,
        status: 'Completed',
        description: 'SPA architecture, custom hooks, context management, performance optimization, and modern UI components.',
      },
      {
        user: demoStudent._id,
        name: 'Node.js & Express',
        category: 'Web Development',
        proficiencyLevel: 'Advanced',
        progress: 88,
        status: 'Completed',
        description: 'RESTful API design, JWT auth, middleware chaining, rate limiting, and database abstraction.',
      },
      {
        user: demoStudent._id,
        name: 'Tailwind CSS & Modern UI',
        category: 'Web Development',
        proficiencyLevel: 'Advanced',
        progress: 92,
        status: 'Completed',
        description: 'Utility-first styling, mobile-first responsive design, component accessibility, and dark mode.',
      },
      {
        user: demoStudent._id,
        name: 'MongoDB & Mongoose',
        category: 'Database Management',
        proficiencyLevel: 'Advanced',
        progress: 85,
        status: 'Completed',
        description: 'Schema modeling, indexing, aggregation pipelines, transactions, and performance profiling.',
      },
      {
        user: demoStudent._id,
        name: 'PostgreSQL',
        category: 'Database Management',
        proficiencyLevel: 'Intermediate',
        progress: 65,
        status: 'Learning',
        description: 'Relational data modeling, ACID transactions, complex JOIN queries, and Prisma ORM.',
      },
      {
        user: demoStudent._id,
        name: 'Data Structures & Algorithms',
        category: 'Data Structures and Algorithms',
        proficiencyLevel: 'Advanced',
        progress: 80,
        status: 'Learning',
        description: 'Solved 250+ LeetCode problems covering Dynamic Programming, Trees, Graphs, Heaps, and Sorting.',
      },
      {
        user: demoStudent._id,
        name: 'Machine Learning Foundations',
        category: 'Artificial Intelligence and Machine Learning',
        proficiencyLevel: 'Intermediate',
        progress: 60,
        status: 'Learning',
        description: 'Supervised and unsupervised algorithms, scikit-learn, exploratory data analysis, and model validation.',
      },
      {
        user: demoStudent._id,
        name: 'Git & GitHub Collaboration',
        category: 'Tools and Technologies',
        proficiencyLevel: 'Expert',
        progress: 95,
        status: 'Completed',
        description: 'Branching strategies, interactive rebasing, merge conflict resolution, PR workflows, and GitHub Actions CI/CD.',
      },
      {
        user: demoStudent._id,
        name: 'Docker & Containerization',
        category: 'Tools and Technologies',
        proficiencyLevel: 'Intermediate',
        progress: 55,
        status: 'Learning',
        description: 'Multi-stage Dockerfiles, Docker Compose multi-container services, and container networking.',
      },
      {
        user: demoStudent._id,
        name: 'Technical Communication & Leadership',
        category: 'Soft Skills',
        proficiencyLevel: 'Advanced',
        progress: 85,
        status: 'Completed',
        description: 'Leading student development club sprints, giving technical seminars, and writing engineering documentation.',
      },
    ];

    await Skill.insertMany(sampleSkills);
    console.log(`[Seeder] Seeded ${sampleSkills.length} sample skills.`);

    // Create Sample Projects
    const sampleProjects = [
      {
        user: demoStudent._id,
        title: 'SkillSphere – Interactive Skill & Portfolio Tracker',
        description: 'A comprehensive full-stack MERN platform empowering university students to monitor technical competencies, track learning milestones with dynamic visualizations, and showcase a verified public portfolio.',
        technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Recharts', 'JWT'],
        githubUrl: 'https://github.com/alexrivera-dev/skillsphere',
        liveDemoUrl: 'https://skillsphere.demo.app',
        completionDate: new Date('2026-03-15'),
        featured: true,
      },
      {
        user: demoStudent._id,
        title: 'CloudPulse – Distributed API Health Monitoring System',
        description: 'Microservice monitoring dashboard tracking latency percentiles, uptime SLAs, and error budgets across cloud endpoints with automated incident alerting.',
        technologies: ['TypeScript', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
        githubUrl: 'https://github.com/alexrivera-dev/cloudpulse',
        liveDemoUrl: 'https://cloudpulse.demo.app',
        completionDate: new Date('2025-11-20'),
        featured: true,
      },
      {
        user: demoStudent._id,
        title: 'DevCollab – Real-Time Collaborative Code Editor',
        description: 'Browser-based collaborative development workspace featuring syntax highlighting, operational transformation for concurrent multi-user editing, and real-time execution sandboxes.',
        technologies: ['React', 'WebSockets', 'Node.js', 'Monaco Editor'],
        githubUrl: 'https://github.com/alexrivera-dev/devcollab',
        liveDemoUrl: '',
        completionDate: new Date('2025-08-10'),
        featured: false,
      },
    ];

    await Project.insertMany(sampleProjects);
    console.log(`[Seeder] Seeded ${sampleProjects.length} sample projects.`);

    // Create Sample Certifications
    const sampleCertifications = [
      {
        user: demoStudent._id,
        name: 'AWS Certified Cloud Practitioner (CLF-C02)',
        issuingOrganization: 'Amazon Web Services',
        issueDate: new Date('2025-09-15'),
        credentialUrl: 'https://aws.amazon.com/verification',
        credentialId: 'AWS-CCP-92837482',
      },
      {
        user: demoStudent._id,
        name: 'Meta Front-End Developer Professional Certificate',
        issuingOrganization: 'Meta / Coursera',
        issueDate: new Date('2025-06-30'),
        credentialUrl: 'https://coursera.org/verify/professional-cert/meta-fe',
        credentialId: 'META-FE-7729103',
      },
      {
        user: demoStudent._id,
        name: 'MongoDB Certified Node.js Developer',
        issuingOrganization: 'MongoDB University',
        issueDate: new Date('2025-12-05'),
        credentialUrl: 'https://university.mongodb.com/certificates',
        credentialId: 'MONGO-DEV-448109',
      },
    ];

    await Certification.insertMany(sampleCertifications);
    console.log(`[Seeder] Seeded ${sampleCertifications.length} sample certifications.`);

    console.log('[Seeder] Successfully completed data seeding!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
