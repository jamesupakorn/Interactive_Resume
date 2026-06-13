// Skills are language-independent; only level labels change per language.
const skills = [
  { name: "Java", category: "expert" },
  { name: "JSP (JavaServer Pages)", category: "expert" },
  { name: "JavaScript", category: "expert" },
  { name: "HTML5", category: "expert" },
  { name: "CSS", category: "expert" },
  { name: "Bootstrap", category: "expert" },
  { name: "Spring Boot", category: "intermediate" },
  { name: "C# / .NET Framework", category: "intermediate" },
  { name: "React", category: "intermediate" },
  { name: "Python", category: "basic" },
  { name: "NET Core MVC", category: "basic" },
  { name: "AngularJS", category: "basic" },
  { name: "React Native", category: "basic" },
  { name: "SQL", category: "database" },
  { name: "MySQL", category: "database" },
  { name: "PostgreSQL", category: "database" },
  { name: "Oracle", category: "database" },
  { name: "Three.js", category: "basic" },
  { name: "MongoDB", category: "database" },
  { name: "Git", category: "tools" },
  { name: "Adobe Photoshop", category: "tools" },
  { name: "Adobe Illustrator", category: "tools" },
];

// Localized resume content shown in both Resume and Life Journey pages.
const content = {
  th: {
    eyebrow: "Interactive Resume",
    name: "ศุภกร แรงกสิวิทย์",
    subtitle: "Sr. Programmer / Full Stack Developer",
    switchTheme: "Switch Theme",
    contactBtn: "ติดต่อ",
    openAvatarLab: "เส้นทางชีวิต",
    backToResume: "← Resume",
    navLinks: [
      { href: "#profile", label: "โปรไฟล์" },
      { href: "#skills", label: "ทักษะ" },
      { href: "#experience", label: "ประสบการณ์" },
      { href: "#education", label: "การศึกษา" },
      { href: "#portfolio", label: "ผลงาน" },
      { href: "#contact", label: "ติดต่อ" },
    ],
    heroStats: [
      { value: "5+", label: "ปีประสบการณ์" },
      { value: "Full Stack", label: "Developer" },
      { value: "Java · React", label: "Core Stack" },
    ],
    availableLabel: "🟢 พร้อมรับโอกาสใหม่",
    sections: {
      profile: "สรุปโปรไฟล์",
      skills: "ทักษะด้านเทคนิค",
      experience: "ประสบการณ์ทำงาน",
      softSkills: "ทักษะด้านบุคคล",
      education: "การศึกษา",
      contact: "ข้อมูลติดต่อ",
      portfolio: "ผลงาน",
    },
    filters: {
      all: "ทั้งหมด",
      expert: "เชี่ยวชาญ",
      intermediate: "ระดับกลาง",
      basic: "พื้นฐาน",
      database: "ฐานข้อมูล",
      tools: "เครื่องมือ",
    },
    skillLevel: {
      expert: "เชี่ยวชาญ",
      intermediate: "ระดับกลาง",
      basic: "พื้นฐาน",
      database: "ฐานข้อมูล",
      tools: "เครื่องมือ",
    },
    profileSummary:
      "Senior Full Stack Developer ประสบการณ์ 5+ ปี เชี่ยวชาญ Java · Spring Boot · JSP · React พัฒนาระบบจริงใน Domain Healthcare (ระบบกล้องรถพยาบาล, คิวผู้ป่วย, Tele Pharma, EMS Bot), HR Management และ Financial Services มีประสบการณ์ครบวงจรทั้ง Backend API, Frontend UI/UX และ Technical Consulting สำหรับทีมข้ามสาย",
    avatarLabTitle: "Life Journey",
    avatarLabDescription:
      "เดินตามเส้นทางชีวิตจากอดีตสู่ปัจจุบัน แล้วดูหมุดประวัติสำคัญทีละช่วงบนทางเดินเดียว",
    avatarLabHint:
      "W / S หรือลูกศรขึ้น-ลง เพื่อเดินหน้า-ถอยหลังบนเส้นทาง · Shift เพื่อเร่งความเร็ว",
    avatarIntroTitle: "แนะนำตัว",
    avatarIntroLead: "เริ่มจากรู้จักตัวตนก่อน แล้วค่อยเดินผ่านเส้นทางชีวิตทีละช่วง",
    avatarJourneyNow: "จุดที่กำลังยืนอยู่",
    journeyIntroTitle: "จุดเริ่มต้น",
    journeyIntroDate: "เริ่มสำรวจจากอดีต แล้วเดินไปจนถึงปัจจุบัน",
    journeyPresentSection: "ปัจจุบัน",
    journeyPresentTitle: "วันนี้ของศุภกร",
    journeySidebarTitle: "เส้นทางประวัติ",
    journeyProgressLabel: "ระยะทางที่เดิน",
    experiences: [
      {
        title: "Sr. Programmer | Entronica Co., Ltd.",
        date: "พฤษภาคม 2567 - ปัจจุบัน",
        description: [
          "ออกแบบและพัฒนา Backend ด้วย Java Spring Boot สำหรับระบบใหม่และ API Development",
          "ทำหน้าที่ Backup Consultant วิเคราะห์และแก้ปัญหาทางเทคนิคที่ซับซ้อนให้ทีม",
        ],
      },
      {
        title: "Project Management Office | INTERNATIONAL RESEARCH CORPORATION",
        date: "พฤศจิกายน 2566 - เมษายน 2567",
        description: [
          "ควบคุมการส่งมอบงานโปรแกรมให้ตรงเวลาและตรวจสอบคุณภาพงานอย่างเข้มงวด",
          "ประสานงานระหว่าง Vendor และลูกค้า เพื่อลดความเสี่ยงของความล่าช้าในโครงการ",
        ],
      },
      {
        title: "Full Stack Web Developer | myHR Corporation Limited",
        date: "มิถุนายน 2564 - ตุลาคม 2566",
        description: [
          "พัฒนาและออกแบบระบบ HRM แบบ Full Stack ทั้ง Backend และ Frontend",
          "ทำงานร่วมกับทีม Presale เก็บ Requirement ปรับปรุงระบบ และออกแบบ UX/UI เบื้องต้น",
          "พัฒนาด้วย JSP, AngularJS, JavaScript และเฟรมเวิร์กภายในที่ใช้ Java/XML",
        ],
      },
      {
        title: "Programmer | บริษัท สุพรีมโพดักซ์ จำกัด",
        date: "ธันวาคม 2561 - พฤษภาคม 2564",
        description: [
          "ออกแบบ UX/UI และดูแลฐานข้อมูล รวมถึงรับ Requirement หน้าไซต์งาน",
          "พัฒนาระบบดูข้อมูลกล้องรถพยาบาลแบบ Real-time (C#/.NET Framework)",
          "พัฒนาระบบเรียกคิวผู้ป่วย, ระบบ Tele Pharma และ EMS Bot/Chatbot",
        ],
      },
      {
        title: "เจ้าหน้าที่ธุรการ / IT Support | วิทยาลัยพณิชยการธนบุรี",
        date: "พฤษภาคม 2560 - พฤศจิกายน 2561",
        description: [
          "ทำหน้าที่ IT Support ก่อนย้ายไปดูแลงานวิจัยและเอกสารราชการ",
          "พัฒนาทักษะด้านการจัดการข้อมูลและการประสานงานเอกสาร",
        ],
      },
      {
        title: "เจ้าหน้าที่แนะนำสินเชื่อ | ธนาคารไทยเครดิตเพื่อรายย่อย",
        date: "มีนาคม 2559 - เมษายน 2560",
        description: [
          "แนะนำผลิตภัณฑ์สินเชื่อและบริหารจัดการหนี้",
          "พัฒนาทักษะการสื่อสาร การโน้มน้าว และการบริหารความสัมพันธ์กับลูกค้า",
        ],
      },
    ],
    softSkills: [
      "การแก้ปัญหาและการให้คำปรึกษา: วิเคราะห์ปัญหาซับซ้อนและช่วยทีมแก้ปัญหาได้รวดเร็ว",
      "การสื่อสารและการบริหารลูกค้า: มีมนุษยสัมพันธ์ดี ทำงานร่วมกับทีมและลูกค้าได้อย่างมีประสิทธิภาพ",
      "ทัศนคติการทำงาน: เรียนรู้ไว ใจเย็น พร้อมพัฒนาตัวเองอย่างต่อเนื่อง",
    ],
    education: [
      "ปริญญาตรี (พ.ศ. 2559-2561): สาขาระบบสารสนเทศ | มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร",
      "ปวส. (พ.ศ. 2557-2559): สาขาวิชาคอมพิวเตอร์ธุรกิจ | วิทยาลัยพณิชยการธนบุรี",
      "ปวช. (พ.ศ. 2554-2557): สาขาวิชาคอมพิวเตอร์ธุรกิจ | วิทยาลัยพณิชยการธนบุรี",
      "มัธยมศึกษาตอนต้น (พ.ศ. 2551-2554): โรงเรียนโพธิสารพิทยากร",
    ],
    portfolio: [
      {
        title: "Interactive Resume",
        description:
          "เว็บ Portfolio แบบ Interactive พัฒนาด้วย React + Three.js มี 3D Avatar, Life Journey timeline, theme toggle และรองรับดาวน์โหลด CV หลายภาษา",
        tech: ["React", "Three.js", "Vite"],
        url: "https://jamesupakorn.github.io/Interactive_Resume/",
        repo: "https://github.com/jamesupakorn/Interactive_Resume",
        label: "ดูผลงาน",
      },
      {
        title: "Finance Tracker",
        description:
          "แอปพลิเคชันติดตามการเงินส่วนบุคคล ออกแบบมาเพื่อช่วยบันทึกรายรับ-รายจ่าย วิเคราะห์ข้อมูล และสรุปสถานะการเงินได้อย่างชัดเจน",
        tech: ["React", "Next.js", "MongoDB", "Vercel"],
        url: "https://finance-track-one.vercel.app/profiles",
        repo: "https://github.com/jamesupakorn/FinanceTrack",
        label: "ดูผลงาน",
      },
      {
        title: "ToothBin",
        description:
          "ระบบจัดการร้านกาแฟแบบ Full Stack รองรับเมนู ตะกร้าสินค้า จัดการ Stock และหน้า Admin แยก Frontend/Backend ชัดเจน",
        tech: ["React", "Node.js", "PostgreSQL", "Supabase", "Vercel"],
        url: "https://toothbin.vercel.app/",
        repo: "https://github.com/jamesupakorn/ToothBin",
        label: "ดูผลงาน",
      },
      {
        title: "Tooth Node API",
        description:
          "บริการ Backend API สำหรับระบบ ToothBin รองรับการเชื่อมต่อข้อมูลและการทำงานฝั่งเซิร์ฟเวอร์",
        tech: ["Node.js", "Express", "Supabase", "Vercel"],
        url: "https://tooth-node-api.vercel.app/",
        repo: "https://github.com/jamesupakorn/ToothBin",
        label: "ดูผลงาน",
      },
    ],
    repoTitle: "GitHub Repositories",
    repoLabel: "ดู Code",
    repositories: [
      {
        name: "FinanceTrack",
        url: "https://github.com/jamesupakorn/FinanceTrack",
      },
      {
        name: "Interactive_Resume",
        url: "https://github.com/jamesupakorn/Interactive_Resume",
      },
      {
        name: "ToothBin",
        url: "https://github.com/jamesupakorn/ToothBin",
      },
    ],
    contact: {
      phone: "โทร: 093-772-0044",
      email: "อีเมล: jamesupakorn@hotmail.com",
      line: "Line: manofmoon",
      github: "GitHub: jamesupakorn",
      linkedin: "LinkedIn: ศุภกร",
    },
    moveControls: {
      forward: "↑ เดินหน้า",
      backward: "↓ ถอยหลัง",
      sprint: "⚡ เร่ง",
    },
  },
  en: {
    eyebrow: "Interactive Resume",
    name: "Supakorn Raengkasiwit",
    subtitle: "Sr. Programmer / Full Stack Developer",
    switchTheme: "Switch Theme",
    contactBtn: "Contact",
    openAvatarLab: "Life Journey",
    backToResume: "← Resume",
    navLinks: [
      { href: "#profile", label: "Profile" },
      { href: "#skills", label: "Skills" },
      { href: "#experience", label: "Experience" },
      { href: "#education", label: "Education" },
      { href: "#portfolio", label: "Portfolio" },
      { href: "#contact", label: "Contact" },
    ],
    heroStats: [
      { value: "5+", label: "Years Exp." },
      { value: "Full Stack", label: "Developer" },
      { value: "Java · React", label: "Core Stack" },
    ],
    availableLabel: "🟢 Open to Opportunities",
    sections: {
      profile: "Profile Summary",
      skills: "Technical Skills",
      experience: "Work Experience",
      softSkills: "Soft Skills",
      education: "Education",
      contact: "Contact",
      portfolio: "Portfolio",
    },
    filters: {
      all: "All",
      expert: "Expert",
      intermediate: "Intermediate",
      basic: "Basic",
      database: "Database",
      tools: "Tools",
    },
    skillLevel: {
      expert: "Expert",
      intermediate: "Intermediate",
      basic: "Basic",
      database: "Database",
      tools: "Tools",
    },
    profileSummary:
      "Senior Full Stack Developer with 5+ years of experience across Java · Spring Boot · JSP · React. Delivered production systems in Healthcare (real-time ambulance monitoring, patient queue, Tele Pharma, EMS Bot), HRM, and Fintech domains. Experienced in end-to-end Backend API development, Frontend UI/UX, and technical consulting for cross-functional teams.",
    avatarLabTitle: "Life Journey",
    avatarLabDescription:
      "Walk through a single life path from the past to the present and discover key milestones as you move.",
    avatarLabHint: "W / S or Up / Down to move along the path · Hold Shift to sprint",
    avatarIntroTitle: "Introduction",
    avatarIntroLead: "Start with who I am, then walk forward through each stage of my journey.",
    avatarJourneyNow: "Current Position",
    journeyIntroTitle: "The Beginning",
    journeyIntroDate: "Start in the past and walk toward the present",
    journeyPresentSection: "Present",
    journeyPresentTitle: "Supakorn Today",
    journeySidebarTitle: "Journey Timeline",
    journeyProgressLabel: "Path Progress",
    experiences: [
      {
        title: "Sr. Programmer | Entronica Co., Ltd.",
        date: "May 2024 – Present",
        description: [
          "Designed and developed Backend services using Java Spring Boot for new system builds and API development.",
          "Served as Backup Consultant, analyzing complex technical problems and accelerating the team's resolution process.",
        ],
      },
      {
        title: "Project Management Office | INTERNATIONAL RESEARCH CORPORATION",
        date: "November 2023 – April 2024",
        description: [
          "Oversaw program delivery timelines and enforced strict quality checks on all deliverables.",
          "Acted as a liaison between vendors and clients, reducing the risk of project delivery delays.",
        ],
      },
      {
        title: "Full Stack Web Developer | myHR Corporation Limited",
        date: "June 2021 – October 2023",
        description: [
          "Developed and designed a Full Stack HRM (Human Resource Management) system covering both Backend and Frontend.",
          "Collaborated with the Presale team to gather requirements, improve the system, and conduct initial UX/UI design.",
          "Built with JSP, AngularJS, JavaScript, and an in-house MVC framework using Java/XML.",
        ],
      },
      {
        title: "Programmer | Supreme Products Co., Ltd.",
        date: "December 2018 – May 2021",
        description: [
          "Designed UX/UI and managed database architecture; gathered on-site client requirements.",
          "Developed a real-time ambulance camera monitoring system displaying camera, GPS, and vital signs (C#/.NET Framework).",
          "Built a patient queue management system, Tele Pharma video-call platform, and EMS Bot/Chatbot system.",
        ],
      },
      {
        title: "Administrative Officer / IT Support | Thonburi Commercial College",
        date: "May 2017 – November 2018",
        description: [
          "Provided IT Support for 6 months before transitioning to research administration and official documentation.",
          "Developed document management and data administration skills.",
        ],
      },
      {
        title: "Loan Officer | Thai Credit Retail Bank",
        date: "March 2016 – April 2017",
        description: [
          "Advised clients on loan products and managed debt portfolios.",
          "Developed skills in communication, persuasion, and client relationship management.",
        ],
      },
    ],
    softSkills: [
      "Problem-Solving & Consulting: Quickly analyzes complex issues and provides effective technical consultation to the team (Sr. Programmer level).",
      "Communication & Client Management: Outgoing with strong interpersonal skills; experienced in persuasion and building client relationships.",
      "Work Attitude: Fast learner, calm under pressure, and continuously self-improving.",
    ],
    education: [
      "Bachelor's Degree (2016–2018): Information Systems | Rajamangala University of Technology Phra Nakhon",
      "High Vocational Certificate – ปวส. (2014–2016): Business Computer | Thonburi Commercial College",
      "Vocational Certificate – ปวช. (2011–2014): Business Computer | Thonburi Commercial College",
      "Lower Secondary (2008–2011): Photisarnpittayakorn School",
    ],
    portfolio: [
      {
        title: "Interactive Resume",
        description:
          "An interactive portfolio built with React and Three.js, featuring a 3D Avatar, Life Journey timeline, theme toggle, and multi-language CV download.",
        tech: ["React", "Three.js", "Vite"],
        url: "https://jamesupakorn.github.io/Interactive_Resume/",
        repo: "https://github.com/jamesupakorn/Interactive_Resume",
        label: "View Project",
      },
      {
        title: "Finance Tracker",
        description:
          "A personal finance tracking application for recording income and expenses, analyzing spending patterns, and summarizing financial status clearly.",
        tech: ["React", "Next.js", "MongoDB", "Vercel"],
        url: "https://finance-track-one.vercel.app/profiles",
        repo: "https://github.com/jamesupakorn/FinanceTrack",
        label: "View Project",
      },
      {
        title: "ToothBin",
        description:
          "A full-stack cafe management system supporting menus, shopping cart, stock management, and an Admin dashboard with clearly separated Frontend and Backend.",
        tech: ["React", "Node.js", "PostgreSQL", "Supabase", "Vercel"],
        url: "https://toothbin.vercel.app/",
        repo: "https://github.com/jamesupakorn/ToothBin",
        label: "View Project",
      },
      {
        title: "Tooth Node API",
        description:
          "A backend API service for ToothBin, handling data connectivity and server-side operations.",
        tech: ["Node.js", "Express", "Supabase", "Vercel"],
        url: "https://tooth-node-api.vercel.app/",
        repo: "https://github.com/jamesupakorn/ToothBin",
        label: "View Project",
      },
    ],
    repoTitle: "GitHub Repositories",
    repoLabel: "View Code",
    repositories: [
      {
        name: "FinanceTrack",
        url: "https://github.com/jamesupakorn/FinanceTrack",
      },
      {
        name: "Interactive_Resume",
        url: "https://github.com/jamesupakorn/Interactive_Resume",
      },
      {
        name: "ToothBin",
        url: "https://github.com/jamesupakorn/ToothBin",
      },
    ],
    contact: {
      phone: "Tel: 093-772-0044",
      email: "Email: jamesupakorn@hotmail.com",
      line: "Line: manofmoon",
      github: "GitHub: jamesupakorn",
      linkedin: "LinkedIn: Supakorn",
    },
    moveControls: {
      forward: "↑ Forward",
      backward: "↓ Backward",
      sprint: "⚡ Sprint",
    },
  },
};

export { content, skills };
