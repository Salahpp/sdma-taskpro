// SDMA TaskPro - Core React Application Logic (Agency OS)

const { useState, useEffect, useMemo } = React;

// --- MOCK DATABASE SEED DATA ---
const DEFAULT_USERS = [];

const DEFAULT_LEAVE_TEMPLATES = [
  { id: "lt-1", type: "Paid Leave (PL)", allowance: 15, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "lt-2", type: "Sick Leave (SL)", allowance: 10, color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { id: "lt-3", type: "Casual Leave (CL)", allowance: 12, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
];

const DEFAULT_OVERTIME_TEMPLATES = [
  { id: "ot-1", name: "Standard Overtime (Weekday)", rateMultiplier: 1.5, minHours: 2 },
  { id: "ot-2", name: "Holiday/Weekend Overtime", rateMultiplier: 2.0, minHours: 1 }
];

const DEFAULT_HOLIDAYS_LIST = [
  { id: "h-1", name: "New Year's Day", date: "2026-01-01", type: "Public" },
  { id: "h-2", name: "Eid Al-Fitr Holiday", date: "2026-04-10", type: "Public" },
  { id: "h-3", name: "Independence Day", date: "2026-08-15", type: "Public" },
  { id: "h-4", name: "Diwali festival", date: "2026-11-08", type: "Optional" }
];

const DEFAULT_LEAVES = [
  { id: "l-1", userId: "u-3", startDate: "2026-07-12", endDate: "2026-07-14", reason: "Family event at hometown", type: "Paid Leave (PL)", status: "Approved", approvedBy: "u-2" },
  { id: "l-2", userId: "u-6", startDate: "2026-07-20", endDate: "2026-07-20", reason: "Sudden high fever", type: "Sick Leave (SL)", status: "Approved", approvedBy: "u-2" }
];

const DEFAULT_EXPENSE_CLAIMS = [
  { id: "ec-1", userId: "u-3", title: "Meta Ads Account Top-Up", amount: 15000, category: "Marketing Spend", status: "Approved", notes: "Funded Homestead real-estate ads." },
  { id: "ec-2", userId: "u-6", title: "Shutterstock Design Assets Package", amount: 8900, category: "Design Assets", status: "Pending", notes: "Requested licensing package for Kiki Souq designs." }
];

const DEFAULT_CLIENTS = [
  { id: "c-1", companyName: "Homestead", contactPerson: "John Doe", phone: "+91 98765 00001", email: "marketing@homestead.com", website: "https://homestead.com", address: "Malappuram, Kerala", monthlyPackage: "₹45,000/mo", assignedStaff: "u-3", startDate: "2026-01-15", status: "Active", notes: "Real Estate Meta Ads lead gen and organic social media posting." },
  { id: "c-2", companyName: "Future Window Curtains", contactPerson: "Sarah Jenkins", phone: "+91 98765 00002", email: "info@futurecurtains.com", website: "https://futurewindowcurtains.com", address: "Malappuram, Kerala", monthlyPackage: "₹35,000/mo", assignedStaff: "u-3", startDate: "2026-03-01", status: "Active", notes: "Google Ads target search keywords and SEO rankings." },
  { id: "c-3", companyName: "Kiki Souq", contactPerson: "Yousuf Al-Mansoori", phone: "+971 50 123 4567", email: "yousuf@kikisouq.ae", website: "https://kikisouq.ae", address: "Dubai Marina, UAE", monthlyPackage: "₹65,000/mo", assignedStaff: "u-3", startDate: "2025-11-10", status: "Active", notes: "High creative demand. Needs daily TikTok videos and reels." },
  { id: "c-4", companyName: "Essthara Jewels", contactPerson: "Abdul Kader", phone: "+91 98765 00004", email: "info@essthara.com", website: "https://essthara.com", address: "Malappuram, Kerala", monthlyPackage: "₹40,000/mo", assignedStaff: "u-4", startDate: "2026-05-20", status: "Active", notes: "Meta Ads campaign monitoring and budget management." },
  { id: "c-5", companyName: "Job Root", contactPerson: "Nivedith", phone: "+91 98765 00005", email: "contact@jobroot.com", website: "https://jobroot.com", address: "Malappuram, Kerala", monthlyPackage: "₹38,000/mo", assignedStaff: "u-4", startDate: "2026-06-01", status: "Active", notes: "Recruitment Meta Ads campaigns and lead generation quality check." },
  { id: "c-6", companyName: "Atrium School", contactPerson: "Manager", phone: "+91 98765 00006", email: "info@atriumschool.com", website: "https://atriumschool.edu.in", address: "Malappuram, Kerala", monthlyPackage: "₹50,000/mo", assignedStaff: "u-5", startDate: "2026-07-01", status: "Active", notes: "School admissions lead generation and social media campaigns." },
  { id: "c-7", companyName: "Shah Digital Marketing Agency (SDMA)", contactPerson: "Salahudheen PP", phone: "+91 97781 00000", email: "admin@shahdigital.com", website: "https://shahdigitalmarketing.com", address: "Malappuram, Kerala", monthlyPackage: "₹0/mo", assignedStaff: "u-6", startDate: "2024-01-01", status: "Active", notes: "Internal agency branding materials, reels, banners and website designs." },
  { id: "c-8", companyName: "Shah Digital Marketing Academy", contactPerson: "Counselor", phone: "+91 96569 37014", email: "academy@shahdigital.com", website: "https://shahdigital.academy", address: "Malappuram, Kerala", monthlyPackage: "₹0/mo", assignedStaff: "u-6", startDate: "2025-06-01", status: "Active", notes: "Student success posts, course ads, admission posters." },
  { id: "c-9", companyName: "CS Sports", contactPerson: "Organizer", phone: "+91 98765 00009", email: "sports@cssports.com", website: "https://cssports.com", address: "Malappuram, Kerala", monthlyPackage: "₹25,000/mo", assignedStaff: "u-6", startDate: "2026-02-15", status: "Active", notes: "Sports match designs, tournament flyers, promotional reels." },
  { id: "c-10", companyName: "AstroAge (Internal)", contactPerson: "Salahudheen PP", phone: "+91 97781 00000", email: "astro@shahdigital.com", website: "https://astroage.com", address: "Malappuram, Kerala", monthlyPackage: "₹0/mo", assignedStaff: "u-3", startDate: "2025-01-01", status: "Active", notes: "Government jobs portals and blog publishing tracker." },
  { id: "c-11", companyName: "CareerSearch (Internal)", contactPerson: "Salahudheen PP", phone: "+91 97781 00000", email: "career@shahdigital.com", website: "https://careersearch.com", address: "Malappuram, Kerala", monthlyPackage: "₹0/mo", assignedStaff: "u-3", startDate: "2025-01-01", status: "Active", notes: "Gulf recruitment portal and job blogs compilation." }
];

const DEFAULT_PROJECTS = [
  { id: "p-1", clientId: "c-1", name: "Meta Lead Gen Ads", description: "Running high-converting Meta leads campaigns for Homestead.", status: "Active" },
  { id: "p-2", clientId: "c-1", name: "Homestead Organic Posting", description: "Creating and scheduling monthly social media posts and reels.", status: "Active" },
  { id: "p-3", clientId: "c-2", name: "Google Search Ads & SEO", description: "Targeting motorized curtains and blinds keywords on search network.", status: "Active" },
  { id: "p-4", clientId: "c-3", name: "AI Video Production & Socials", description: "TikTok and Snapchat video editing and publishing.", status: "Active" },
  { id: "p-5", clientId: "c-4", name: "Jewelry Meta Ads", description: "Brand awareness and catalog lead ads for gold/diamond collections.", status: "Active" },
  { id: "p-6", clientId: "c-5", name: "Recruitment Leads campaigns", description: "Targeting candidate registrations for Gulf and IT companies.", status: "Active" },
  { id: "p-7", clientId: "c-6", name: "School Admission Meta Ads", description: "Lead generation targeting parents in Malappuram district.", status: "Active" },
  { id: "p-8", clientId: "c-7", name: "Branding Banners & Website", description: "Designing agency flyers, brochures and marketing decks.", status: "Active" },
  { id: "p-9", clientId: "c-8", name: "Student Success Campaigns", description: "Showcasing student success testimonials and registration forms.", status: "Active" },
  { id: "p-10", clientId: "c-9", name: "Match Day Flyers & Reels", description: "Designing match schedule posters and tournament promotional reels.", status: "Active" },
  { id: "p-11", clientId: "c-10", name: "AstroAge Jobs Portal SEO", description: "Publishing government job blogs and setting up keyword optimization.", status: "Active" },
  { id: "p-12", clientId: "c-11", name: "CareerSearch Gulf Blogs", description: "Uploading Gulf employment opportunity listings and indexings.", status: "Active" }
];

const DEFAULT_TASKS = [
  { id: "t-1", title: "Write government job blog for AstroAge", description: "Write 1 SEO optimized blog post, upload featured image, apply internal linking and publish. Share on Facebook, Instagram, WhatsApp and update blog tracker.", clientId: "c-10", projectId: "p-11", category: "SEO & Content", priority: "High", assignedEmployee: "u-3", deadline: "2026-07-26", estimatedHours: 4, status: "In Progress", subtasks: [{id: "s-1", title: "Blog writing", isCompleted: true}, {id: "s-2", title: "Social media sharing", isCompleted: false}], comments: [], attachments: [] },
  { id: "t-2", title: "Write Gulf job blog for CareerSearch", description: "Write 1 Gulf job blog, apply SEO keywords, publish article, share on social media channels and promote on WhatsApp.", clientId: "c-11", projectId: "p-12", category: "SEO & Content", priority: "Medium", assignedEmployee: "u-3", deadline: "2026-07-26", estimatedHours: 3, status: "Not Started", subtasks: [], comments: [], attachments: [] },
  { id: "t-3", title: "Check campaign status & budget for Homestead", description: "Monitor leads count, review CPL (Cost Per Lead), check campaign status, verify ad payments, and submit daily report with optimizations.", clientId: "c-1", projectId: "p-1", category: "Paid Ads", priority: "High", assignedEmployee: "u-3", deadline: "2026-07-26", estimatedHours: 2, status: "Completed", subtasks: [], comments: [], attachments: [] },
  { id: "t-4", title: "Create Homestead posting schedule & publish", description: "Publish daily posts and stories, monitor engagement, research competitors, and compile new creative content ideas.", clientId: "c-1", projectId: "p-2", category: "Social Media", priority: "Medium", assignedEmployee: "u-3", deadline: "2026-07-27", estimatedHours: 3, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-5", title: "Google Ads Monitoring & Keyword research for Future Curtains", description: "Google Ads budget review, click analysis, lead tracking, CPC monitoring, keyword research, negative keyword updates, and search term analysis.", clientId: "c-2", projectId: "p-3", category: "Paid Ads", priority: "High", assignedEmployee: "u-3", deadline: "2026-07-26", estimatedHours: 4, status: "Not Started", subtasks: [], comments: [], attachments: [] },
  { id: "t-6", title: "Kiki Souq Social Media Management", description: "Facebook and Instagram posting, competitor analysis, weekly content planning, and Snapchat/TikTok content brainstorming.", clientId: "c-3", projectId: "p-4", category: "Social Media", priority: "Medium", assignedEmployee: "u-3", deadline: "2026-07-28", estimatedHours: 5, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-7", title: "AstroAge Blog Submission", description: "Write 1 government job blog, perform SEO optimization, publish article, and share on social media/WhatsApp.", clientId: "c-10", projectId: "p-11", category: "SEO & Content", priority: "High", assignedEmployee: "u-4", deadline: "2026-07-26", estimatedHours: 4, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-8", title: "CareerSearch Blog Submission", description: "Write 1 Gulf job blog, perform SEO optimization, publish article, and share on social media/WhatsApp.", clientId: "c-11", projectId: "p-12", category: "SEO & Content", priority: "Medium", assignedEmployee: "u-4", deadline: "2026-07-26", estimatedHours: 4, status: "Not Started", subtasks: [], comments: [], attachments: [] },
  { id: "t-9", title: "Essthara Jewels Meta Ads Optimizations", description: "Campaign monitoring, budget tracking, lead monitoring, CPL analysis, campaign optimization, daily reporting, and weekly strategy suggestions.", clientId: "c-4", projectId: "p-5", category: "Paid Ads", priority: "High", assignedEmployee: "u-4", deadline: "2026-07-26", estimatedHours: 2, status: "Completed", subtasks: [], comments: [], attachments: [] },
  { id: "t-10", title: "Job Root Meta Ads Review", description: "Campaign monitoring, budget review, lead quality analysis, CPL tracking, audience analysis, daily reporting, and weekly strategy planning.", clientId: "c-5", projectId: "p-6", category: "Paid Ads", priority: "Medium", assignedEmployee: "u-4", deadline: "2026-07-27", estimatedHours: 3, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-11", title: "Atrium School Campaign Monitoring", description: "Campaign monitoring, budget analysis, lead tracking, CPL analysis, audience review, campaign optimization, daily report, and strategy suggestions.", clientId: "c-6", projectId: "p-7", category: "Paid Ads", priority: "High", assignedEmployee: "u-5", deadline: "2026-07-26", estimatedHours: 3, status: "Completed", subtasks: [], comments: [], attachments: [] },
  { id: "t-12", title: "Produce Kiki Souq AI Videos & Reels", description: "AI product videos, AI promotional videos, AI reels, video optimization, and video publishing support.", clientId: "c-3", projectId: "p-4", category: "Video Production", priority: "High", assignedEmployee: "u-5", deadline: "2026-07-26", estimatedHours: 6, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-13", title: "AstroAge AI News & Job Shorts", description: "Produce AI news videos, government job videos, and Shorts creation.", clientId: "c-10", projectId: "p-11", category: "Video Production", priority: "Medium", assignedEmployee: "u-5", deadline: "2026-07-27", estimatedHours: 4, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-14", title: "CareerSearch Gulf Recruitment Videos", description: "Recruitment videos, Gulf job videos, AI reels, and short-form video editing.", clientId: "c-11", projectId: "p-12", category: "Video Production", priority: "Medium", assignedEmployee: "u-5", deadline: "2026-07-28", estimatedHours: 4, status: "Not Started", subtasks: [], comments: [], attachments: [] },
  { id: "t-15", title: "Design Homestead Social Banners", description: "Design social media posters, advertisement creatives, reel editing assets, story creatives, and website banner designs.", clientId: "c-1", projectId: "p-2", category: "Graphic Design", priority: "High", assignedEmployee: "u-6", deadline: "2026-07-26", estimatedHours: 5, status: "Waiting Review", subtasks: [], comments: [], attachments: [] },
  { id: "t-16", title: "Design Kiki Souq Product Posters", description: "Product posters, product reels, promotional videos, story designs, and product image editing.", clientId: "c-3", projectId: "p-4", category: "Graphic Design", priority: "High", assignedEmployee: "u-6", deadline: "2026-07-26", estimatedHours: 5, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-17", title: "Design SDMA Branding & Posters", description: "Agency posters, marketing creatives, promotional reels, website banners, and branding materials.", clientId: "c-7", projectId: "p-8", category: "Graphic Design", priority: "Medium", assignedEmployee: "u-6", deadline: "2026-07-28", estimatedHours: 4, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-18", title: "Design Academy Admission Posters", description: "Admission posters, course creatives, student success posts, event posters, and promotional reels.", clientId: "c-8", projectId: "p-9", category: "Graphic Design", priority: "High", assignedEmployee: "u-6", deadline: "2026-07-26", estimatedHours: 4, status: "Completed", subtasks: [], comments: [], attachments: [] },
  { id: "t-19", title: "Design CS Sports Tournament Graphics", description: "Match posters, tournament creatives, social media designs, and promotional videos.", clientId: "c-9", projectId: "p-10", category: "Graphic Design", priority: "Low", assignedEmployee: "u-6", deadline: "2026-07-29", estimatedHours: 6, status: "Not Started", subtasks: [], comments: [], attachments: [] },
  { id: "t-20", title: "Assign & Monitor Daily Team Tasks", description: "Conduct morning stand-up, allocate tasks, monitor progress, resolve issues, and verify completed work.", clientId: "c-7", projectId: "p-8", category: "Management", priority: "High", assignedEmployee: "u-2", deadline: "2026-07-26", estimatedHours: 3, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-21", title: "Verify Team Campaign Reports", description: "Review and verify Meta and Google Ads campaign spends, budgets, and submit compiled reports to CEO.", clientId: "c-7", projectId: "p-8", category: "Management", priority: "High", assignedEmployee: "u-2", deadline: "2026-07-26", estimatedHours: 3, status: "In Progress", subtasks: [], comments: [], attachments: [] },
  { id: "t-22", title: "Conduct Management Stand-up Meeting", description: "Review previous day's reports, campaign performance, and set daily priorities with Team Lead.", clientId: "c-7", projectId: "p-8", category: "Management", priority: "High", assignedEmployee: "u-1", deadline: "2026-07-26", estimatedHours: 2, status: "Completed", subtasks: [], comments: [], attachments: [] }
];

const DEFAULT_CAMPAIGNS = [
  { id: "ca-1", clientId: "c-1", platform: "Meta Ads", budget: 15000, spend: 12000, leads: 84, cpl: 142.85, cpc: 8.5, ctr: 2.4, roas: 3.8, status: "Active", dailyNotes: "Meta lead ads are yielding high CTR, CPL is within target range." },
  { id: "ca-2", clientId: "c-2", platform: "Google Ads", budget: 10000, spend: 9500, leads: 42, cpl: 226.19, cpc: 14.5, ctr: 3.1, roas: 4.2, status: "Active", dailyNotes: "Highly targeted curtains search phrases have excellent conversion rates." },
  { id: "ca-3", clientId: "c-3", platform: "TikTok Ads", budget: 20000, spend: 8500, leads: 110, cpl: 77.27, cpc: 4.0, ctr: 1.8, roas: 5.1, status: "Active", dailyNotes: "Reels sharing summer products are going viral, TikTok CPL is super cheap." },
  { id: "ca-4", clientId: "c-4", platform: "Meta Ads", budget: 18000, spend: 15000, leads: 95, cpl: 157.89, cpc: 9.0, ctr: 2.1, roas: 3.5, status: "Active", dailyNotes: "Jewelry catalog conversion rate is steady, increasing retargeting budget." }
];

const DEFAULT_REPORTS = [
  { id: "r-1", userId: "u-3", date: "2026-07-24", type: "Morning", data: { plannedTasks: "Launch Meta Ads campaign, compile Google search logs.", priority: "Confirm luxury property leads are tracking.", clientWork: "Homestead, Future Window Curtains.", supportRequired: "None" }, isApproved: true, approvedBy: "u-2", submittedAt: "09:15 AM" },
  { id: "r-2", userId: "u-6", date: "2026-07-24", type: "Morning", data: { plannedTasks: "Design posters for curtains summer sale, edit AI promo video.", priority: "Deliver TikTok promo.", clientWork: "Future Curtains, Kiki Souq.", supportRequired: "Canva Pro asset access check." }, isApproved: true, approvedBy: "u-2", submittedAt: "09:45 AM" }
];

const DEFAULT_CREATIVES = [
  { id: "cr-1", taskId: "t-15", designerId: "u-6", title: "Homestead Social Banners", fileType: "Poster", fileUrl: "homestead_banner.png", canvaLink: "https://canva.com/design/homestead-summer-sale", approvalStatus: "Team_Lead", submittedAt: "2026-07-24 15:00" },
  { id: "cr-2", taskId: "t-16", designerId: "u-6", title: "Kiki Souq Product Reels", fileType: "Video", fileUrl: "kikisouq_promo.mp4", canvaLink: "", approvalStatus: "Designer", submittedAt: "2026-07-24 16:30" }
];

const DEFAULT_ATTENDANCE = [
  { id: "a-1", userId: "u-3", date: "2026-07-24", clockIn: "09:12 AM", clockOut: "05:05 PM", isLate: false, onLeave: false, leaveReason: "" },
  { id: "a-2", userId: "u-6", date: "2026-07-24", clockIn: "09:42 AM", clockOut: "05:15 PM", isLate: true, onLeave: false, leaveReason: "" }
];

const DEFAULT_CONTENT = [
  { id: "bl-1", title: "10 Interior Design Hacks for Summer 2026", blogName: "AstroAge", writer: "Zayn Malik", publishDate: "2026-07-20", url: "https://astroage.com/blogs/interior-hacks-2026", seoScore: 92, indexedStatus: "Indexed", socialSharing: "Shared on FB & IG" },
  { id: "bl-2", title: "Top Digital Marketing Skills in Demand for 2026", blogName: "CareerSearch", writer: "Ayesha Khan", publishDate: "2026-07-22", url: "https://careersearch.org/articles/digital-skills-2026", seoScore: 88, indexedStatus: "Crawled (Not Indexed)", socialSharing: "Shared on LinkedIn" }
];

const DEFAULT_SOCIAL = [
  { id: "so-1", platform: "Instagram", posts: 24, stories: 42, reels: 15, scheduled: 5, published: 24 },
  { id: "so-2", platform: "Facebook", posts: 18, stories: 20, reels: 8, scheduled: 2, published: 18 },
  { id: "so-3", platform: "LinkedIn", posts: 10, stories: 5, reels: 0, scheduled: 3, published: 10 },
  { id: "so-4", platform: "TikTok", posts: 14, stories: 0, reels: 14, scheduled: 8, published: 14 }
];

// --- HELPER SVGS (LUCIDE ICON MAP) ---
function Icon({ name, className = "w-5 h-5", onClick = null }) {
  const icons = {
    dashboard: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />,
    users: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    client: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    tasks: <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
    report: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2l6 6m-6-6v6h6" />,
    campaign: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    creative: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v8M8 12h8" />,
    attendance: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    performance: <path d="M18 20V10M12 20V4M6 20v-6" />,
    settings: <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />,
    calendar: <React.Fragment><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" /></React.Fragment>,
    search: <React.Fragment><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></React.Fragment>,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="M20 6L9 17l-5-5" />,
    clock: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" />,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    trash: <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
    edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />,
    alert: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
    ai: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
    bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />,
    link: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
    briefcase: <React.Fragment><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></React.Fragment>,
    leave: <path d="M17 18a5 5 0 0 0-10 0M12 2v7M4.22 10.22l1.42 1.42M19.78 10.22l-1.42 1.42M2 18h20" />,
    payroll: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    expense: <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />,
    muster: <path d="M9 3h11M9 9h11M9 15h11M9 21h11M3 3h.01M3 9h.01M3 15h.01M3 21h.01" />,
    trendingUp: <React.Fragment><path d="M23 6l-9.5 9.5-5-5L1 18" /><polyline points="17 6 23 6 23 12" /></React.Fragment>
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      onClick={onClick}
    >
      {icons[name] || <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />}
    </svg>
  );
}

// --- MAIN REACT COMPONENT ---
function App() {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation Panel Selection
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dark/Light Mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("sdma_dark_mode");
    return saved !== "false"; // Default to dark mode
  });

  // DB States
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState(() => getLS("sdma_clients", DEFAULT_CLIENTS));
  const [projects, setProjects] = useState(() => getLS("sdma_projects", DEFAULT_PROJECTS));
  const [tasks, setTasks] = useState(() => getLS("sdma_tasks", DEFAULT_TASKS));
  const [campaigns, setCampaigns] = useState(() => getLS("sdma_campaigns", DEFAULT_CAMPAIGNS));
  const [reports, setReports] = useState(() => getLS("sdma_reports", DEFAULT_REPORTS));
  const [creatives, setCreatives] = useState(() => getLS("sdma_creatives", DEFAULT_CREATIVES));
  const [attendance, setAttendance] = useState(() => getLS("sdma_attendance", DEFAULT_ATTENDANCE));
  const [leaves, setLeaves] = useState(() => getLS("sdma_leaves", DEFAULT_LEAVES));
  const [leaveTemplates, setLeaveTemplates] = useState(() => getLS("sdma_leave_templates", DEFAULT_LEAVE_TEMPLATES));
  const [overtimeTemplates, setOvertimeTemplates] = useState(() => getLS("sdma_overtime_templates", DEFAULT_OVERTIME_TEMPLATES));
  const [holidaysList, setHolidaysList] = useState(() => getLS("sdma_holidays_list", DEFAULT_HOLIDAYS_LIST));
  const [expenseClaims, setExpenseClaims] = useState(() => getLS("sdma_expense_claims", DEFAULT_EXPENSE_CLAIMS));
  const [blogs, setBlogs] = useState(() => getLS("sdma_blogs", DEFAULT_CONTENT));
  const [social, setSocial] = useState(() => getLS("sdma_social", DEFAULT_SOCIAL));
  const [settings, setSettings] = useState(() => getLS("sdma_settings", {
    officeIn: "09:30 AM",
    officeOut: "05:30 PM",
    workingDays: "Monday to Friday",
    holidays: "New Year, National Day",
    categories: ["Meta Ads", "Google Ads", "SEO & Content", "Graphic Design", "Video Production", "Website Development"],
    priorities: ["Low", "Medium", "High", "Urgent"]
  }));

  // Application-wide Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filterPriority, setFilterPriority] = useState("All");

  // Notifications Log
  const [notifications, setNotifications] = useState(() => getLS("sdma_notifications", [
    { id: "n-1", title: "New Task Assigned", desc: "Launch Meta Ads campaign has been assigned to Zayn.", date: "Today", isRead: false },
    { id: "n-2", title: "Creative Approved", desc: "Sarah Jenkins approved the curtain sales poster.", date: "Yesterday", isRead: true }
  ]));
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Modal forms states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", clientId: "", projectId: "", category: "Meta Ads", priority: "Medium", assignedEmployee: "", deadline: "", estimatedHours: "" });

  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({ companyName: "", contactPerson: "", phone: "", email: "", website: "", address: "", monthlyPackage: "", assignedStaff: "", startDate: "", status: "Active", notes: "" });

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({ name: "", email: "", role: "Digital_Marketer", department: "Digital Marketing", avatar: "", status: "Active" });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", clientId: "", description: "", status: "Active" });

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ type: "Morning", data: { plannedTasks: "", priority: "", clientWork: "", supportRequired: "", completedTasks: "", pendingTasks: "", campaignUpdates: "", blogUpdates: "", socialMediaUpdates: "", clientCommunication: "", issues: "", tomorrowPlan: "" } });

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ clientId: "", platform: "Meta Ads", budget: "", spend: "", leads: "", cpc: "", ctr: "", roas: "", status: "Active", dailyNotes: "" });

  const [showCreativeModal, setShowCreativeModal] = useState(false);
  const [creativeForm, setCreativeForm] = useState({ taskId: "", title: "", fileType: "Poster", fileUrl: "", canvaLink: "" });

  // Toast State
  const [toast, setToast] = useState(null);

  // Attendance states for current day
  const [clockedInTime, setClockedInTime] = useState("");
  const [clockedOutTime, setClockedOutTime] = useState("");

  // AI Modal States
  const [aiModalType, setAiModalType] = useState(null); // 'priorities' | 'seo' | 'campaign' | 'social' | 'overdue' | 'productivity'
  const [aiOutput, setAiOutput] = useState("");

  // Punch Camera Capture states
  const [punchType, setPunchType] = useState(null); // null | 'In' | 'Out'
  const [viewPhoto, setViewPhoto] = useState(null); // null | { title: string, src: string }
  const [viewPayslipData, setViewPayslipData] = useState(null); // null | payslip data object
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordsForm, setPasswordsForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  // Remove former client-side demo identity. Supabase Auth now owns the session.
  useEffect(() => {
    localStorage.removeItem("sdma_current_user");
    localStorage.removeItem("sdma_users");
  }, []);

  const applyAuthContext = (context) => {
    setCurrentUser(context ? context.user : null);
    setUsers(context ? context.users : []);
    setAuthReady(true);
    if (context) setAuthError("");
  };

  useEffect(() => {
    let active = true;
    const auth = window.SDMAAuth;

    if (!auth || !auth.isConfigured) {
      setAuthError("Supabase authentication is not configured. Contact your administrator.");
      setAuthReady(true);
      return () => { active = false; };
    }

    const hydrate = async (authUser) => {
      if (!authUser) {
        if (active) applyAuthContext(null);
        return;
      }
      try {
        const context = await auth.getSessionContext(authUser);
        if (active) applyAuthContext(context);
      } catch (error) {
        await auth.signOut().catch(() => {});
        if (active) {
          setAuthError(error.message || "Could not verify your employee profile.");
          applyAuthContext(null);
        }
      }
    };

    const { data: { subscription } } = auth.onAuthStateChange((event, authUser) => {
      if (!active) return;
      if (event === "SIGNED_OUT" || !authUser) {
        applyAuthContext(null);
      } else {
        window.setTimeout(() => { if (active) void hydrate(authUser); }, 0);
      }
    });

    auth.getCurrentContext()
      .then(context => { if (active) applyAuthContext(context); })
      .catch(error => {
        if (active) {
          setAuthError(error.message || "Could not restore the secure session.");
          applyAuthContext(null);
        }
        void auth.signOut().catch(() => {});
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sync to localStorage

  useEffect(() => { setLS("sdma_clients", clients); }, [clients]);
  useEffect(() => { setLS("sdma_projects", projects); }, [projects]);
  useEffect(() => { setLS("sdma_tasks", tasks); }, [tasks]);
  useEffect(() => { setLS("sdma_campaigns", campaigns); }, [campaigns]);
  useEffect(() => { setLS("sdma_reports", reports); }, [reports]);
  useEffect(() => { setLS("sdma_creatives", creatives); }, [creatives]);
  useEffect(() => { setLS("sdma_attendance", attendance); }, [attendance]);
  useEffect(() => { setLS("sdma_leaves", leaves); }, [leaves]);
  useEffect(() => { setLS("sdma_leave_templates", leaveTemplates); }, [leaveTemplates]);
  useEffect(() => { setLS("sdma_overtime_templates", overtimeTemplates); }, [overtimeTemplates]);
  useEffect(() => { setLS("sdma_holidays_list", holidaysList); }, [holidaysList]);
  useEffect(() => { setLS("sdma_expense_claims", expenseClaims); }, [expenseClaims]);
  useEffect(() => { setLS("sdma_blogs", blogs); }, [blogs]);
  useEffect(() => { setLS("sdma_social", social); }, [social]);
  useEffect(() => { setLS("sdma_settings", settings); }, [settings]);
  
  // Theme styling handler
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark', 'dark-mode');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark', 'dark-mode');
      root.classList.add('light');
    }
    localStorage.setItem("sdma_dark_mode", darkMode);
  }, [darkMode]);

  // Protect restricted tabs from manual state manipulation
  useEffect(() => {
    const restrictedTabs = ["muster-roll", "leave-templates", "overtime-templates", "payroll", "cash-flow", "cashflow"];
    if (restrictedTabs.includes(activeTab) && !isPrivileged()) {
      setActiveTab("dashboard");
      showToast("Access Denied: Management or HR clearance required.", "warning");
    }
  }, [activeTab, currentUser]);

  // Supabase Auth validates identity; PostgreSQL RLS authorizes protected rows.

  // Live Database Synchronization Across Browser Tabs/Windows
  useEffect(() => {
    const handleStorageSync = (e) => {
      if (!e.newValue) return;
      try {
        const data = JSON.parse(e.newValue);
        switch (e.key) {
          case "sdma_tasks": setTasks(data); break;
          case "sdma_clients": setClients(data); break;
          case "sdma_projects": setProjects(data); break;
          case "sdma_campaigns": setCampaigns(data); break;
          case "sdma_reports": setReports(data); break;
          case "sdma_attendance": setAttendance(data); break;
          case "sdma_leaves": setLeaves(data); break;
          case "sdma_notifications": setNotifications(data); break;
          case "sdma_expense_claims": setExpenseClaims(data); break;
          case "sdma_blogs": setBlogs(data); break;
          case "sdma_social": setSocial(data); break;
          case "sdma_settings": setSettings(data); break;
          default: break;
        }
      } catch (err) {
        console.error("Storage sync parse error:", err);
      }
    };
    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, []);

  // Local Storage Utility
  function getLS(key, fallback) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  }
  function setLS(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // Local Date string in local time (e.g. YYYY-MM-DD)
  const getLocalDate = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  // Trigger Toast Notification
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Role verification helper
  const isRole = (rolesArray) => currentUser && rolesArray.includes(currentUser.role);

  // Navigation convenience only. Actual access is enforced by database RLS.
  const isPrivileged = () => !!currentUser && currentUser.authRole === "admin";

  // Login is verified by Supabase Auth, not a local users array.
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthReady(false);
    setAuthError("");
    try {
      const context = await window.SDMAAuth.signIn(loginEmail, loginPassword);
      setCurrentUser(context.user);
      setUsers(context.users);
      setLoginPassword("");
      showToast(`Welcome back, ${context.user.name}! Successfully signed in as ${context.user.role}.`);
    } catch (error) {
      setAuthError(error.message || "Unable to sign in. Please try again.");
    } finally {
      setAuthReady(true);
    }
  };

  // End the current browser session through Supabase Auth.
  const handleLogout = async () => {
    try {
      await window.SDMAAuth.signOut();
    } catch (error) {
      showToast(error.message || "Sign-out could not be confirmed.", "error");
    } finally {
      setCurrentUser(null);
      setUsers([]);
      showToast("Signed out successfully.");
    }
  };

  // Task creation/editing submission
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      const updated = tasks.map(t => t.id === editingTask.id ? { ...t, ...taskForm } : t);
      setTasks(updated);
      showToast("Task updated successfully!");
    } else {
      const newTask = {
        id: `t-${Date.now()}`,
        ...taskForm,
        status: "Not Started",
        subtasks: [],
        comments: [],
        attachments: []
      };
      setTasks([newTask, ...tasks]);
      
      // Trigger notification
      addNotification("New Task Assigned", `Task "${newTask.title}" has been assigned to ${getUserName(newTask.assignedEmployee)}`);
      showToast("New task assigned successfully!");
    }
    setShowTaskModal(false);
    setEditingTask(null);
    setTaskForm({ title: "", description: "", clientId: "", projectId: "", category: "Meta Ads", priority: "Medium", assignedEmployee: "", deadline: "", estimatedHours: "" });
  };

  // Client Submit Handler
  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      const updated = clients.map(c => c.id === editingClient.id ? { ...c, ...clientForm } : c);
      setClients(updated);
      showToast("Client details updated successfully!");
    } else {
      const newClient = {
        id: `c-${Date.now()}`,
        ...clientForm
      };
      setClients([newClient, ...clients]);
      showToast("Client account created successfully!");
    }
    setShowClientModal(false);
    setEditingClient(null);
    setClientForm({ companyName: "", contactPerson: "", phone: "", email: "", website: "", address: "", monthlyPackage: "", assignedStaff: "", startDate: "", status: "Active", notes: "" });
  };

  // Employee creation is performed through trusted Supabase Auth administration.
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    if (!editingStaff) {
      showToast("Create or invite this employee in Supabase Authentication first. Their Staff profile is created automatically.", "warning");
      return;
    }
    try {
      const updated = await window.SDMAAuth.updateProfile(editingStaff.id, staffForm);
      const merged = { ...updated, baseSalary: parseInt(staffForm.baseSalary, 10) || editingStaff.baseSalary || 0 };
      setUsers(users.map(u => u.id === editingStaff.id ? merged : u));
      if (editingStaff.id === currentUser.id) setCurrentUser(merged);
      showToast("Employee profile updated successfully!");
      setShowStaffModal(false);
      setEditingStaff(null);
    } catch (error) {
      showToast(error.message || "Could not update employee profile.", "error");
    }
  };

  const handleStaffDelete = async (id, name) => {
    if (!confirm(`Deactivate ${name}'s employee account? Their access to RLS-protected data will be blocked.`)) return;
    try {
      const target = users.find(u => u.id === id);
      const updated = await window.SDMAAuth.updateProfile(id, {
        name: target ? target.name : name,
        department: target ? target.department : "General",
        role: target ? target.role : "Digital_Marketer",
        status: "Inactive"
      });
      setUsers(users.map(u => u.id === id ? { ...updated, baseSalary: target ? target.baseSalary : 0 } : u));
      if (currentUser && currentUser.id === id) await handleLogout();
      showToast(`Deactivated employee account for ${name}.`);
    } catch (error) {
      showToast(error.message || "Could not deactivate employee.", "error");
    }
  };

  // Supabase verifies the current password and stores the replacement.
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordsForm.newPassword !== passwordsForm.confirmPassword) {
      showToast("New passwords do not match!", "error");
      return;
    }
    if (passwordsForm.newPassword.length < 8) {
      showToast("Use a password with at least 8 characters.", "error");
      return;
    }
    try {
      await window.SDMAAuth.changePassword(currentUser.email, passwordsForm.oldPassword, passwordsForm.newPassword);
      showToast("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordsForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      showToast(error.message || "Could not update password.", "error");
    }
  };

  // Project Submit Handler
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: `p-${Date.now()}`,
      ...projectForm
    };
    setProjects([newProject, ...projects]);
    showToast("Project folder initiated!");
    setShowProjectModal(false);
    setProjectForm({ name: "", clientId: "", description: "", status: "Active" });
  };

  // Report Submission Handler
  const handleReportSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReport = {
      id: `r-${Date.now()}`,
      userId: currentUser.id,
      date: getLocalDate(now),
      type: reportForm.type,
      data: { ...reportForm.data },
      isApproved: false,
      approvedBy: null,
      submittedAt: formattedTime
    };
    setReports([newReport, ...reports]);
    addNotification("Daily Report Pending", `${currentUser.name} submitted a ${reportForm.type} report for review.`);
    showToast(`${reportForm.type} report submitted for review.`);
    setShowReportModal(false);
  };

  // Approval status flows for team lead
  const toggleReportApproval = (id) => {
    const updated = reports.map(r => {
      if (r.id === id) {
        const nextState = !r.isApproved;
        if (nextState) showToast("Report approved!");
        return { ...r, isApproved: nextState, approvedBy: nextState ? currentUser.id : null };
      }
      return r;
    });
    setReports(updated);
  };

  // Campaign data logger submission
  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    const costPerLead = parseFloat(campaignForm.spend) / parseInt(campaignForm.leads || 1);
    const newCampaign = {
      id: `ca-${Date.now()}`,
      ...campaignForm,
      budget: parseFloat(campaignForm.budget),
      spend: parseFloat(campaignForm.spend),
      leads: parseInt(campaignForm.leads),
      cpl: isNaN(costPerLead) ? 0 : parseFloat(costPerLead.toFixed(2)),
      updatedAt: new Date().toISOString()
    };
    setCampaigns([newCampaign, ...campaigns]);
    showToast("Campaign logged successfully.");
    setShowCampaignModal(false);
  };

  // Creative assets upload submission
  const handleCreativeSubmit = (e) => {
    e.preventDefault();
    const newCreative = {
      id: `cr-${Date.now()}`,
      designerId: currentUser.id,
      approvalStatus: "Team_Lead",
      submittedAt: new Date().toLocaleString(),
      ...creativeForm
    };
    setCreatives([newCreative, ...creatives]);
    addNotification("Creative Awaiting Approval", `New ${creativeForm.fileType} upload from ${currentUser.name} demands validation.`);
    showToast("Asset uploaded and sent for approval.");
    setShowCreativeModal(false);
  };

  const handleCreativeStatusChange = (id, nextStatus) => {
    setCreatives(creatives.map(c => c.id === id ? { ...c, approvalStatus: nextStatus } : c));
    showToast(`Asset status updated to ${nextStatus}`);
  };

  // Clock In / Clock Out triggers
  const handleClockIn = () => {
    setPunchType("In");
  };

  const handleClockOut = () => {
    setPunchType("Out");
  };

  // Record punch with camera capture snapshot data
  const handlePunchSubmit = (photoData) => {
    const now = new Date();
    const clockTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (punchType === 'In') {
      const isLate = (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30));
      const log = {
        id: `a-${Date.now()}`,
        userId: currentUser.id,
        date: getLocalDate(now),
        clockIn: clockTime,
        clockOut: "",
        isLate,
        onLeave: false,
        leaveReason: "",
        photoIn: photoData || ""
      };
      setAttendance([log, ...attendance]);
      setClockedInTime(clockTime);
      if (isLate) {
        addNotification("Late Arrival Logged", `${currentUser.name} clocked in late at ${clockTime}`);
        showToast("Clocked in! Late entry logged.", "warning");
      } else {
        showToast("Successfully clocked in with photo capture!");
      }
    } else if (punchType === 'Out') {
      const todayStr = getLocalDate(now);
      const updated = attendance.map(a => {
        if (a.userId === currentUser.id && a.date === todayStr) {
          return { ...a, clockOut: clockTime, photoOut: photoData || "" };
        }
        return a;
      });
      setAttendance(updated);
      setClockedOutTime(clockTime);
      showToast("Successfully clocked out with photo capture!");
    }
    setPunchType(null);
  };

  // Add Dynamic Notification
  const addNotification = (title, desc) => {
    const newNotif = {
      id: `n-${Date.now()}`,
      title,
      desc,
      date: "Just Now",
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    showToast("Marked all notifications as read.");
  };

  // Helper selectors
  const getUserName = (id) => users.find(u => u.id === id)?.name || "Unassigned";
  const getClientName = (id) => clients.find(c => c.id === id)?.companyName || "N/A";
  const getProjectName = (id) => projects.find(p => p.id === id)?.name || "N/A";

  // Calculate working hours between clock-in and clock-out strings
  const calculateHoursWorked = (clockInStr, clockOutStr) => {
    if (!clockInStr || !clockOutStr) return 0;
    const parseTime = (timeStr) => {
      const clean = timeStr.trim().toUpperCase();
      const parts = clean.split(' ');
      const time = parts[0];
      const modifier = parts[1] || '';
      
      let [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours)) hours = 0;
      if (isNaN(minutes)) minutes = 0;
      
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    try {
      const inMin = parseTime(clockInStr);
      const outMin = parseTime(clockOutStr);
      if (outMin > inMin) {
        const diffMin = outMin - inMin;
        return parseFloat((diffMin / 60).toFixed(1));
      }
    } catch (err) {
      console.error("Error parsing hours:", err);
    }
    return 0;
  };

  // Filter Tasks list
  const filteredTasksList = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(t => {
      const matchQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = filterPriority === "All" || t.priority === filterPriority;
      const matchRoleRestriction = currentUser.role === "Digital_Marketer" ? t.assignedEmployee === currentUser.id :
                                   currentUser.role === "Designer" ? t.assignedEmployee === currentUser.id : true;
      return matchQuery && matchPriority && matchRoleRestriction;
    });
  }, [tasks, searchQuery, filterPriority, currentUser]);

  // Global Search Finder Function
  const handleGlobalSearchItemClick = (type, tabName) => {
    setActiveTab(tabName);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    const results = [];
    
    // Clients
    clients.forEach(c => {
      if (c.companyName.toLowerCase().includes(lowerQuery) || c.contactPerson.toLowerCase().includes(lowerQuery)) {
        results.push({ id: c.id, title: c.companyName, label: "Client", tab: "clients" });
      }
    });

    // Tasks
    tasks.forEach(t => {
      if (t.title.toLowerCase().includes(lowerQuery) || t.description.toLowerCase().includes(lowerQuery)) {
        results.push({ id: t.id, title: t.title, label: "Task", tab: "tasks" });
      }
    });

    // Campaigns
    campaigns.forEach(ca => {
      const cName = getClientName(ca.clientId);
      if (cName.toLowerCase().includes(lowerQuery) || ca.platform.toLowerCase().includes(lowerQuery)) {
        results.push({ id: ca.id, title: `${cName} - ${ca.platform}`, label: "Campaign", tab: "campaigns" });
      }
    });

    return results.slice(0, 5);
  }, [searchQuery, clients, tasks, campaigns]);

  // --- AI LOGIC TOOLS ---
  const runAIEngine = (type) => {
    setAiModalType(type);
    setAiOutput("Analyzing databases, plotting trends, and processing metadata...");

    setTimeout(() => {
      let result = "";
      if (type === 'priorities') {
        const assigned = tasks.filter(t => t.assignedEmployee === currentUser.id && t.status !== "Completed");
        if (assigned.length === 0) {
          result = "🎯 No pending tasks found. Rest, check on social profiles, or create standard templates.";
        } else {
          result = `🤖 **AI Workload Priorities for ${currentUser.name}:**\n\n` +
                   assigned.map((t, idx) => `${idx + 1}. **[${t.priority} Priority] ${t.title}**\n   Deadline: ${t.deadline} | Est: ${t.estimatedHours}h\n   *Suggested Step:* Setup environment assets and launch within 4 hours.`).join("\n\n");
        }
      } 
      else if (type === 'campaign') {
        const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
        const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
        const avgCPL = (totalSpend / totalLeads).toFixed(2);
        
        result = `📈 **AI Campaign Audit & CPL Insights:**\n\n` +
                 `- **Aggregate Metrics:** Total Spend: $${totalSpend} | Total Leads: ${totalLeads} | Average CPL: $${avgCPL}\n` +
                 `- **Performers Alert:** *TikTok Ads* ROAS is looking excellent at **5.1x** ($7.72 CPL). Meta lead ads are steady but have higher customer acquisition metrics.\n` +
                 `- **Warning:** *Snapchat Ads* is holding a critical **1.9x ROAS**. CPC has inflated to $0.90.\n` +
                 `- **Action Recommendation:** Pause Snapchat campaigns completely. Re-allocate $500 of spend to high ROAS TikTok target audiences.`;
      } 
      else if (type === 'seo') {
        result = `🔍 **SEO Blog Topic Suggestion Engine (Google Trends 2026):**\n\n` +
                 `1. **Focus Keyword:** "AI Video Automation Tools"\n   *Idea:* How Shah Digital Marketing Agency is leveraging AI to lower lead production costs.\n\n` +
                 `2. **Focus Keyword:** "Local Leads Meta Ads Strategy"\n   *Idea:* Why geo-targeted real estate ads perform 40% better on Meta vs. Google.\n\n` +
                 `3. **Focus Keyword:** "Summer 2026 Home Staging Trends"\n   *Idea:* Boost SEO rank for Homestead Realtors blog. Target high buyer intent queries.`;
      } 
      else if (type === 'social') {
        result = `📱 **AI Social Media Content Blueprint:**\n\n` +
                 `*Idea 1 (Reel/TikTok):* "A day in the life of a Digital Marketer at Shah Agency." Show client performance graphs jumping.\n` +
                 `*Caption:* From coffee to campaigns—here is how we generated 150+ high-quality leads in under 24 hours. 🚀 #AgencyLife #DigitalMarketing\n\n` +
                 `*Idea 2 (Post):* Case study carousel detailing the "Future Window Curtains" campaign ROAS rise to 4.2x.\n` +
                 `*Caption:* Design meets strategy. Read how custom landing pages and optimized search queries transformed curtains traffic. Link in bio!`;
      } 
      else if (type === 'overdue') {
        const today = new Date();
        const flagged = tasks.filter(t => {
          if (t.status === "Completed") return false;
          const deadline = new Date(t.deadline);
          const timeDiff = deadline.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return daysLeft <= 2 || (t.priority === "Urgent" && t.status !== "Waiting Review");
        });

        if (flagged.length === 0) {
          result = "✅ Safe! All active projects/tasks have healthy buffer times.";
        } else {
          result = `🚨 **AI Risk Assessment - Predicted Overdue Tasks:**\n\n` +
                   flagged.map(t => `- **${t.title}** (Assigned: ${getUserName(t.assignedEmployee)})\n  Deadline: ${t.deadline} | Status: *${t.status}*\n  *Risk Factor:* Est. Time remaining requires immediate start to hit schedule.`).join("\n\n");
        }
      }
      else if (type === 'productivity') {
        result = `📊 **Employee Productivity & Analytics Summary:**\n\n` +
                 `- **Zayn Malik (Digital Marketer):** Task completion rate at **82%**. Afternoon communication latency is high. Average delivery time: 1.8 days.\n` +
                 `- **Riya Sen (Graphic Designer):** High output volume. **94%** of designs approved by Team Lead on first iteration. Productivity score: **95/100**.\n` +
                 `- **Overall Trend:** Weekly agency task velocity has accelerated by 15% due to simulated Kanban workflow adoption.`;
      }
      setAiOutput(result);
    }, 1200);
  };

  // --- RENDERING VIEWS ---
  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] p-4">
        <div className="text-center text-slate-400 text-sm">Checking secure employee session…</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] p-4">
        <div className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#E31E24] tracking-tight">SDMA TaskPro</h1>
            <p className="text-neutral-400 text-xs mt-2 uppercase tracking-widest">Shah Digital Marketing Agency Operating System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#E31E24] transition-all"
                placeholder="e.g. admin@shahdigital.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#E31E24] transition-all"
                placeholder="••••••••" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {authError && (
              <div className="text-xs text-red-500 bg-red-950/20 border border-red-900/50 p-3 rounded-lg flex items-center gap-2">
                <Icon name="alert" className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button type="submit" className="w-full py-3 rounded-xl font-bold btn-primary text-sm tracking-wide">
              Sign In to System
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center text-xs text-neutral-500">
            Employee accounts are provisioned by the Shah Digital Marketing administrator.
          </div>
        </div>
      </div>
    );
  }

  // Calculate Global Dashboard Metrics
  const staffCount = users.length;
  const activeClientsCount = clients.filter(c => c.status === "Active").length;
  const activeProjectsCount = projects.filter(p => p.status === "Active").length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const pendingTasks = tasks.filter(t => t.status !== "Completed").length;
  const overdueTasks = tasks.filter(t => {
    if (t.status === "Completed") return false;
    return new Date(t.deadline) < new Date();
  }).length;
  const runningCampaignsCount = campaigns.filter(c => c.status === "Active").length;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-slate-100">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all animate-fade-in ${
          toast.type === "warning" ? "bg-amber-950/80 border-amber-800 text-amber-200" : "bg-[#121212] border-[#E31E24]/30 text-white"
        }`}>
          <div className="w-2 h-2 rounded-full bg-[#E31E24] animate-ping"></div>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-[#121212] border-r border-neutral-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <span className="text-[#E31E24] font-extrabold text-2xl">S</span>DMA TaskPro
            </h2>
            <p className="text-[10px] tracking-widest text-[#E31E24] uppercase font-bold">Manage. Track. Grow.</p>
          </div>
        </div>

        {/* Current Active Account Profile Card */}
        <div className="p-4 border-b border-neutral-850 bg-neutral-900/30 flex items-center justify-between mx-2 my-4 rounded-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#E31E24] text-white font-bold flex items-center justify-center shadow-lg uppercase text-sm border border-neutral-750 shrink-0">
              {currentUser.avatar}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-200 truncate leading-tight">{currentUser.name}</h4>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">{currentUser.role.replace("_", " ")}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)} 
            className="text-neutral-500 hover:text-slate-200 p-1.5 rounded-lg hover:bg-neutral-800 transition-all shrink-0"
            title="Change Password"
          >
            🔑
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto text-slate-400">
          <div className="text-[9px] uppercase tracking-widest text-[#E31E24] font-bold px-4 py-2 mt-2">Operations</div>
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "dashboard" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="dashboard" className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button onClick={() => setActiveTab("tasks")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "tasks" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="tasks" className="w-4 h-4" />
            <span>Task Board</span>
          </button>

          {isRole(["CEO", "Team_Lead"]) && (
            <button onClick={() => setActiveTab("clients")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "clients" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
            }`}>
              <Icon name="client" className="w-4 h-4" />
              <span>Clients & Projects</span>
            </button>
          )}

          <button onClick={() => setActiveTab("campaigns")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "campaigns" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="campaign" className="w-4 h-4" />
            <span>Campaign Manager</span>
          </button>

          <button onClick={() => setActiveTab("creatives")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "creatives" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="creative" className="w-4 h-4" />
            <span>Creative Uploads</span>
          </button>

          <button onClick={() => setActiveTab("reports")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "reports" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="report" className="w-4 h-4" />
            <span>Daily Reports</span>
          </button>

          <div className="text-[9px] uppercase tracking-widest text-[#E31E24] font-bold px-4 py-2 mt-4">HR & Payroll OS</div>
          
          <button onClick={() => setActiveTab("staff-dir")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "staff-dir" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="users" className="w-4 h-4" />
            <span>Staff Directory</span>
          </button>

          <button onClick={() => setActiveTab("attendance")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "attendance" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="clock" className="w-4 h-4" />
            <span>Daily Attendance</span>
          </button>

          {isPrivileged() && (
            <button onClick={() => setActiveTab("muster-roll")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "muster-roll" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
            }`}>
              <Icon name="muster" className="w-4 h-4" />
              <span>Muster Roll</span>
            </button>
          )}

          <button onClick={() => setActiveTab("leaves")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "leaves" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="leave" className="w-4 h-4" />
            <span>Leave Requests</span>
          </button>

          {isPrivileged() && (
            <button onClick={() => setActiveTab("leave-templates")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "leave-templates" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
            }`}>
              <Icon name="calendar" className="w-4 h-4" />
              <span>Leave Templates</span>
            </button>
          )}

          {isPrivileged() && (
            <button onClick={() => setActiveTab("overtime-templates")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overtime-templates" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
            }`}>
              <Icon name="creative" className="w-4 h-4" />
              <span>Overtime Templates</span>
            </button>
          )}

          <button onClick={() => setActiveTab("holidays-list")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "holidays-list" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="calendar" className="w-4 h-4" />
            <span>Holidays Registry</span>
          </button>

          {isPrivileged() && (
            <button onClick={() => setActiveTab("payroll")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "payroll" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
            }`}>
              <Icon name="payroll" className="w-4 h-4" />
              <span>Salary / Payroll</span>
            </button>
          )}

          {isPrivileged() && (
            <button onClick={() => setActiveTab("cash-flow")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "cash-flow" || activeTab === "cashflow" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
            }`}>
              <Icon name="trendingUp" className="w-4 h-4" />
              <span>Cash Flow</span>
            </button>
          )}

          <button onClick={() => setActiveTab("expenses")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "expenses" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="expense" className="w-4 h-4" />
            <span>Expense Templates</span>
          </button>

          <div className="text-[9px] uppercase tracking-widest text-neutral-600 font-bold px-4 py-2 mt-4">Utilities</div>

          <button onClick={() => setActiveTab("performance")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "performance" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
          }`}>
            <Icon name="performance" className="w-4 h-4" />
            <span>Productivity Score</span>
          </button>

          {isRole(["CEO"]) && (
            <button onClick={() => setActiveTab("settings")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "settings" ? "bg-[#1C1C1E] border border-neutral-800 text-[#E31E24]" : "hover:text-slate-200 hover:bg-neutral-900/50"
            }`}>
              <Icon name="settings" className="w-4 h-4" />
              <span>Admin Settings</span>
            </button>
          )}
        </nav>

        {/* AI Action Quick Launch Panel */}
        <div className="p-4 mx-3 my-4 bg-neutral-900/40 border border-neutral-850 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#E31E24] animate-ping"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Operations Assistant</span>
          </div>
          <p className="text-[10px] text-neutral-500 mb-3">Trigger automated optimization models on current campaign dataset.</p>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button onClick={() => runAIEngine("priorities")} className="bg-[#1C1C1E] hover:bg-neutral-800 text-slate-300 py-1.5 rounded font-bold border border-neutral-800 text-center">🎯 Task Priorities</button>
            <button onClick={() => runAIEngine("campaign")} className="bg-[#1C1C1E] hover:bg-neutral-800 text-slate-300 py-1.5 rounded font-bold border border-neutral-800 text-center">📈 CPL Summarizer</button>
            <button onClick={() => runAIEngine("seo")} className="bg-[#1C1C1E] hover:bg-neutral-800 text-slate-300 py-1.5 rounded font-bold border border-neutral-800 text-center">🔍 SEO Topics</button>
            <button onClick={() => runAIEngine("social")} className="bg-[#1C1C1E] hover:bg-neutral-800 text-slate-300 py-1.5 rounded font-bold border border-neutral-800 text-center">📱 Social Content</button>
          </div>
        </div>

        {/* Logout button */}
        <div className="p-4 border-t border-neutral-850 flex items-center justify-between">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#1C1C1E] hover:bg-red-950/20 hover:text-[#E31E24] border border-neutral-800 transition-all">
            <Icon name="logout" className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN PAGE SHELL CONTROLLER --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP INTERACTIVE GLASS HEADER */}
        <header className="h-16 border-b border-neutral-800 px-8 bg-[#121212]/80 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          
          {/* SEARCH MODULE BAR */}
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-500">
              <Icon name="search" className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#E31E24] transition-all"
              placeholder="Search clients, campaigns, tasks, or blog writers..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(!!e.target.value);
              }}
            />

            {/* Quick search dropdown */}
            {showSearchResults && (
              <div className="absolute top-12 left-0 right-0 bg-[#121212] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold px-3 py-1.5 border-b border-neutral-850">Global Search Matches</p>
                {searchResults.length === 0 ? (
                  <p className="text-xs text-neutral-500 px-3 py-4 text-center">No results match your query.</p>
                ) : (
                  searchResults.map(res => (
                    <button 
                      key={res.id} 
                      onClick={() => handleGlobalSearchItemClick(res.label, res.tab)}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-800 rounded-lg flex items-center justify-between transition-all"
                    >
                      <span className="text-xs font-semibold text-slate-200">{res.title}</span>
                      <span className="text-[10px] uppercase font-bold text-[#E31E24] bg-[#E31E24]/10 px-2 py-0.5 rounded border border-[#E31E24]/20">{res.label}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Dark Mode Switcher */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-[#1C1C1E] hover:bg-neutral-800 border border-neutral-800 transition-all text-slate-300"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {/* Simulated Live Time Status */}
            <div className="text-right hidden md:block">
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Office Timing: 09:30 - 05:30</p>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24] animate-pulse"></div>
                <p className="text-[10px] text-neutral-500 font-mono">July 24, 2026</p>
              </div>
            </div>

            {/* Notification drop indicator */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="p-2 rounded-lg bg-[#1C1C1E] hover:bg-neutral-800 border border-neutral-800 text-slate-300 relative transition-all"
              >
                <Icon name="bell" className="w-5 h-5" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E31E24] animate-pulse"></span>
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-3 w-80 bg-[#121212] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 bg-[#1C1C1E] border-b border-neutral-850 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Alert Center</span>
                    <button onClick={markAllNotificationsRead} className="text-[10px] text-[#E31E24] hover:underline font-bold">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-850">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-neutral-850 transition-all ${n.isRead ? 'opacity-60' : ''}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-200">{n.title}</span>
                          <span className="text-[9px] text-neutral-500">{n.date}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Digital Clock-In Quick Switch */}
            <div className="flex items-center gap-2">
              {attendance.some(a => a.userId === currentUser.id && a.date === getLocalDate()) ? (
                // Checked In. Show Out trigger.
                attendance.find(a => a.userId === currentUser.id && a.date === getLocalDate()).clockOut ? (
                  <span className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-500 rounded-xl text-xs font-bold">
                    Checked Out
                  </span>
                ) : (
                  <button 
                    onClick={handleClockOut} 
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    ⏰ Clock Out
                  </button>
                )
              ) : (
                <button 
                  onClick={handleClockIn} 
                  className="px-3 py-1.5 bg-[#E31E24] hover:bg-[#C21319] text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  ⏰ Clock In
                </button>
              )}
            </div>
          </div>
        </header>

        {/* --- MAIN PAGE VIEW CONTENT ROUTER --- */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB: DASHBOARD VIEW (CEO & General Users) */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">Welcome Back, {currentUser.name}</h1>
                  <p className="text-xs text-neutral-400 mt-1">Daily Operations and Marketing Dashboard metrics summary.</p>
                </div>

                <div className="flex gap-2">
                  {isRole(["CEO", "Team_Lead"]) && (
                    <>
                      <button onClick={() => setShowClientModal(true)} className="flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1E] border border-neutral-800 text-xs font-bold rounded-xl text-slate-200 hover:bg-neutral-800 transition-all">
                        <Icon name="plus" className="w-3.5 h-3.5 text-[#E31E24]" /> Add Client
                      </button>
                      <button onClick={() => setShowProjectModal(true)} className="flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1E] border border-neutral-800 text-xs font-bold rounded-xl text-slate-200 hover:bg-neutral-800 transition-all">
                        <Icon name="plus" className="w-3.5 h-3.5 text-[#E31E24]" /> Create Project
                      </button>
                      <button onClick={() => { setEditingTask(null); setTaskForm({ title: "", description: "", clientId: "", projectId: "", category: "Meta Ads", priority: "Medium", assignedEmployee: "", deadline: "", estimatedHours: "" }); setShowTaskModal(true); }} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all">
                        <Icon name="plus" className="w-3.5 h-3.5" /> Assign Task
                      </button>
                    </>
                  )}
                  {isRole(["Digital_Marketer", "Designer"]) && (
                    <button onClick={() => { setReportForm({ type: "Morning", data: { plannedTasks: "", priority: "", clientWork: "", supportRequired: "", completedTasks: "", pendingTasks: "", campaignUpdates: "", blogUpdates: "", socialMediaUpdates: "", clientCommunication: "", issues: "", tomorrowPlan: "" } }); setShowReportModal(true); }} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all">
                      <Icon name="plus" className="w-3.5 h-3.5" /> Submit Daily Report
                    </button>
                  )}
                </div>
              </div>

              {/* CEO KPI MATRIX */}
              {isRole(["CEO"]) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 card-hover">
                    <div className="flex items-center justify-between mb-3 text-neutral-500">
                      <span className="text-xs uppercase font-bold tracking-wider">Total Team Staff</span>
                      <Icon name="users" className="w-4 h-4 text-[#E31E24]" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">{staffCount}</h3>
                    <p className="text-[10px] text-green-500 mt-2 font-semibold">⚡ Present Today: {attendance.filter(a => a.date === getLocalDate() && !a.onLeave).length}</p>
                  </div>

                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 card-hover">
                    <div className="flex items-center justify-between mb-3 text-neutral-500">
                      <span className="text-xs uppercase font-bold tracking-wider">Active Client Portfolios</span>
                      <Icon name="client" className="w-4 h-4 text-[#E31E24]" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">{activeClientsCount}</h3>
                    <p className="text-[10px] text-neutral-500 mt-2">Projects in Pipeline: {activeProjectsCount}</p>
                  </div>

                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 card-hover">
                    <div className="flex items-center justify-between mb-3 text-neutral-500">
                      <span className="text-xs uppercase font-bold tracking-wider">Active Task Status</span>
                      <Icon name="tasks" className="w-4 h-4 text-[#E31E24]" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">{completedTasks} <span className="text-xs font-semibold text-neutral-500">/ {totalTasks} Done</span></h3>
                    <p className="text-[10px] text-red-400 mt-2 font-semibold">🚨 Overdue Deadlines: {overdueTasks}</p>
                  </div>

                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5 card-hover">
                    <div className="flex items-center justify-between mb-3 text-neutral-500">
                      <span className="text-xs uppercase font-bold tracking-wider">Campaign Performance</span>
                      <Icon name="campaign" className="w-4 h-4 text-[#E31E24]" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">{runningCampaignsCount} <span className="text-xs font-semibold text-neutral-500">Active</span></h3>
                    <p className="text-[10px] text-green-500 mt-2 font-semibold">⭐ High ROAS TikTok campaign running</p>
                  </div>
                </div>
              )}

              {/* TEAM LEAD KPI CARD VIEW */}
              {isRole(["Team_Lead"]) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">Pending Task Approvals</h4>
                    <p className="text-2xl font-extrabold text-white">{tasks.filter(t => t.status === "Waiting Review").length} Tasks</p>
                    <p className="text-[10px] text-neutral-500 mt-2">Requires verification before signing off.</p>
                  </div>

                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">Reports Review Queue</h4>
                    <p className="text-2xl font-extrabold text-white">{reports.filter(r => !r.isApproved).length} Reports</p>
                    <p className="text-[10px] text-neutral-500 mt-2 font-bold text-amber-500">⚠️ Verify Daily Morning & Evening summaries.</p>
                  </div>

                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">Campaign Optimization Alerts</h4>
                    <p className="text-2xl font-extrabold text-red-500">ROAS Alert</p>
                    <p className="text-[10px] text-neutral-400 mt-2">Snapchat campaign budget efficiency is below target.</p>
                  </div>
                </div>
              )}

              {/* STAFF KPI DETAILS */}
              {isRole(["Digital_Marketer", "Designer"]) && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">My Assigned Tasks</span>
                    <h3 className="text-xl font-extrabold mt-1 text-white">{tasks.filter(t => t.assignedEmployee === currentUser.id && t.status !== "Completed").length} Pending</h3>
                  </div>
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Tasks Completed</span>
                    <h3 className="text-xl font-extrabold mt-1 text-green-500">{tasks.filter(t => t.assignedEmployee === currentUser.id && t.status === "Completed").length} Done</h3>
                  </div>
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Work Hours Logged</span>
                    <h3 className="text-xl font-extrabold mt-1 text-white">8.5 hrs</h3>
                  </div>
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Productivity Index</span>
                    <h3 className="text-xl font-extrabold mt-1 text-[#E31E24]">92%</h3>
                  </div>
                </div>
              )}

              {/* MANAGEMENT FEED: TODAY'S PRESENCE & WEBCAM SNAPSHOTS */}
              {(isPrivileged() || isRole(["Team_Lead"])) && (
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                    <div>
                      <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">👥 Today's Presence & Webcam Snapshots</h3>
                      <p className="text-[10px] text-neutral-500 mt-1">Real-time webcam captures when checking in or out (Indian Standard Time).</p>
                    </div>
                    <span className="text-[10px] bg-[#E31E24]/10 text-[#E31E24] px-2.5 py-1 rounded border border-[#E31E24]/20 font-bold uppercase tracking-wider">
                      Active: {attendance.filter(a => a.date === getLocalDate() && !a.onLeave).length} Present
                    </span>
                  </div>

                  {attendance.filter(a => a.date === getLocalDate()).length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-500 italic">
                      No team attendance logged yet for today ({getLocalDate()}).
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {attendance.filter(a => a.date === getLocalDate()).map(a => {
                        const emp = users.find(u => u.id === a.userId);
                        return (
                          <div key={a.id} className="bg-[#1C1C1E] border border-neutral-855 rounded-xl p-3 flex flex-col justify-between card-hover">
                            <div>
                              <div className="relative aspect-video w-full rounded-lg bg-neutral-900 overflow-hidden border border-neutral-800 flex items-center justify-center">
                                {a.photoIn ? (
                                  <img 
                                    src={a.photoIn} 
                                    alt="Check-in Capture" 
                                    onClick={() => setViewPhoto({ title: `${emp?.name} - Clock In Snapshot`, src: a.photoIn })}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-all"
                                  />
                                ) : (
                                  <span className="text-[10px] text-neutral-600 font-bold">No Capture</span>
                                )}
                                {a.isLate && (
                                  <span className="absolute top-1 right-1 text-[8px] bg-amber-600/90 text-white font-black px-1 py-0.5 rounded border border-amber-500 uppercase animate-pulse">LATE</span>
                                )}
                              </div>

                              <h4 className="text-xs font-bold text-slate-200 mt-2 truncate">{emp?.name || "Employee"}</h4>
                              <p className="text-[9px] text-[#E31E24] font-bold uppercase tracking-wider mt-0.5 truncate">{emp?.role.replace("_", " ")}</p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-neutral-855 text-[9px] text-neutral-400 space-y-1 font-mono">
                              <div className="flex justify-between">
                                <span>Clock-in:</span>
                                <span>{a.clockIn || "--:--"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Clock-out:</span>
                                <span>{a.clockOut || "--:--"}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* INTERACTIVE CUSTOM SVG CHARTS BLOCK */}
              {isRole(["CEO"]) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart 1: Monthly Growth Trends */}
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4 flex items-center justify-between">
                      <span>Monthly Agency Lead Growth & CPL Trend</span>
                      <span className="text-[9px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono">2026 Fiscal</span>
                    </h4>
                    
                    <div className="relative w-full h-64 flex items-end justify-between px-4 pt-6 border-b border-l border-neutral-800">
                      {/* Grid background lines */}
                      <div className="absolute left-0 right-0 top-1/4 border-t border-neutral-900/60 pointer-events-none"></div>
                      <div className="absolute left-0 right-0 top-2/4 border-t border-neutral-900/60 pointer-events-none"></div>
                      <div className="absolute left-0 right-0 top-3/4 border-t border-neutral-900/60 pointer-events-none"></div>

                      {/* SVG Line path for Leads graph */}
                      <svg className="absolute inset-0 w-full h-full p-6 text-[#E31E24] opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 5,90 Q 25,60 50,40 T 95,15" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path d="M 5,90 Q 25,60 50,40 T 95,15 L 95,100 L 5,100 Z" fill="currentColor" opacity="0.3" />
                      </svg>

                      {/* Bar graph simulations */}
                      <div className="flex flex-col items-center w-8 z-10 group">
                        <div className="bg-[#E31E24]/60 w-5 h-20 rounded-t-sm group-hover:bg-[#E31E24] transition-all relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-all font-mono">42 leads</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-2 font-bold">Jan</span>
                      </div>

                      <div className="flex flex-col items-center w-8 z-10 group">
                        <div className="bg-[#E31E24]/60 w-5 h-28 rounded-t-sm group-hover:bg-[#E31E24] transition-all relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-all font-mono">60 leads</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-2 font-bold">Feb</span>
                      </div>

                      <div className="flex flex-col items-center w-8 z-10 group">
                        <div className="bg-[#E31E24]/60 w-5 h-36 rounded-t-sm group-hover:bg-[#E31E24] transition-all relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-all font-mono">82 leads</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-2 font-bold">Mar</span>
                      </div>

                      <div className="flex flex-col items-center w-8 z-10 group">
                        <div className="bg-[#E31E24]/80 w-5 h-44 rounded-t-sm group-hover:bg-[#E31E24] transition-all relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-all font-mono">110 leads</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-2 font-bold">Apr</span>
                      </div>

                      <div className="flex flex-col items-center w-8 z-10 group">
                        <div className="bg-[#E31E24] w-5 h-52 rounded-t-sm transition-all relative">
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-all font-mono">140 leads</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-2 font-bold">May</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart 2: Department Output */}
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4">Department Resource Distribution</h4>
                    
                    <div className="flex items-center justify-around h-64">
                      {/* SVG Donut Circle */}
                      <div className="relative w-36 h-36">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1A1A1A" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E31E24" strokeWidth="3.2" strokeDasharray="50 100" strokeDashoffset="25" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="30 100" strokeDashoffset="75" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94A3B8" strokeWidth="3" strokeDasharray="20 100" strokeDashoffset="5" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-white">100%</span>
                          <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">Active Capacity</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-[#E31E24] rounded-full"></span>
                          <div>
                            <p className="font-bold text-slate-200">Paid Media (50%)</p>
                            <p className="text-[10px] text-neutral-500">Meta & Google Campaigns</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-[#475569] rounded-full"></span>
                          <div>
                            <p className="font-bold text-slate-200">Design Production (30%)</p>
                            <p className="text-[10px] text-neutral-500">Posters, Videos, Canva Links</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-[#94A3B8] rounded-full"></span>
                          <div>
                            <p className="font-bold text-slate-200">SEO & Operations (20%)</p>
                            <p className="text-[10px] text-neutral-500">Blogs, Reporting, Audits</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CEO & TEAM LEAD: STAFF TASKS & DAILY REPORTS OVERVIEW */}
              {(isPrivileged() || isRole(["Team_Lead"])) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Section: Active Staff Tasks Tracker */}
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">📋 Active Staff Tasks Tracker</h4>
                      <span className="text-[10px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold">
                        {tasks.filter(t => t.status !== "Completed").length} Active
                      </span>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {tasks.filter(t => t.status !== "Completed").length === 0 ? (
                        <p className="text-xs text-neutral-500 italic py-4 text-center">No active tasks found in system.</p>
                      ) : (
                        tasks.filter(t => t.status !== "Completed").map(t => {
                          const emp = users.find(u => u.id === t.assignedEmployee);
                          return (
                            <div key={t.id} className="bg-[#1C1C1E] border border-neutral-855 p-3.5 rounded-xl flex items-center justify-between text-xs gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono">{t.category}</span>
                                  <span className={`text-[8px] font-bold px-1 rounded ${
                                    t.priority === "Urgent" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                    t.priority === "High" ? "bg-amber-500/10 text-amber-400" :
                                    "bg-neutral-800 text-neutral-400"
                                  }`}>{t.priority}</span>
                                </div>
                                <h5 className="font-bold text-slate-200 truncate">{t.title}</h5>
                                <p className="text-[10px] text-neutral-500 mt-0.5">Assigned to: **{emp?.name || "Unassigned"}** | Due: {t.deadline}</p>
                              </div>

                              <div className="text-right shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                                  t.status === "Waiting Review" ? "bg-amber-500/10 text-amber-400 animate-pulse border border-amber-500/20" :
                                  t.status === "In Progress" ? "bg-blue-500/10 text-blue-400" :
                                  "bg-neutral-900 text-neutral-500"
                                }`}>{t.status}</span>
                                {t.status === "Waiting Review" && (
                                  <button 
                                    onClick={() => {
                                      setActiveTab("tasks");
                                      showToast("Verify and Approve the task from Kanban Board");
                                    }}
                                    className="block text-[8px] text-[#E31E24] hover:underline font-extrabold uppercase tracking-widest mt-1.5"
                                  >
                                    Verify Tasks
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Section: Staff Daily Reports Review Queue */}
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">☀️ Staff Daily Reports Queue</h4>
                      <span className="text-[10px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold">
                        {reports.filter(r => !r.isApproved).length} Pending Review
                      </span>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {reports.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic py-4 text-center">No operations reports submitted yet.</p>
                      ) : (
                        reports.slice(0, 10).map(r => {
                          const author = users.find(u => u.id === r.userId);
                          return (
                            <div key={r.id} className="bg-[#1C1C1E] border border-neutral-855 p-3.5 rounded-xl space-y-2 text-xs">
                              <div className="flex items-center justify-between pb-1 border-b border-neutral-850">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-[#E31E24] text-white flex items-center justify-center font-bold text-[9px] uppercase">
                                    {author?.avatar || "OP"}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-slate-200">{author?.name}</h5>
                                    <p className="text-[9px] text-neutral-500">{r.date} | {r.submittedAt}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                                    r.type === "Morning" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                                  }`}>
                                    {r.type}
                                  </span>
                                  
                                  {isRole(["Team_Lead"]) ? (
                                    <button 
                                      onClick={() => toggleReportApproval(r.id)}
                                      className={`text-[9px] font-extrabold px-2 py-1 rounded transition-all ${
                                        r.isApproved ? "bg-green-500/10 text-green-400" : "bg-[#E31E24] text-white hover:bg-[#C21319]"
                                      }`}
                                    >
                                      {r.isApproved ? "Approved ✓" : "Approve"}
                                    </button>
                                  ) : (
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                      r.isApproved ? "text-green-400 bg-green-500/10" : "text-amber-400 bg-amber-500/10"
                                    }`}>
                                      {r.isApproved ? "Approved ✓" : "Pending Approval"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-[10px] text-neutral-400 line-clamp-2">
                                {r.type === "Morning" ? (
                                  <span><strong>Planned Tasks:</strong> {r.data?.plannedTasks || r.plannedTasks || ""}</span>
                                ) : (
                                  <span><strong>Completed Tasks:</strong> {r.data?.completedTasks || r.completedTasks || ""}</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* STAFF EXECUTIVES: MY TASKS & MY RECENT DAILY REPORTS */}
              {currentUser && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Section: My Active Tasks */}
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">📋 My Assigned Tasks Pipeline</h4>
                      <span className="text-[10px] bg-[#E31E24]/10 text-[#E31E24] px-2 py-0.5 rounded border border-[#E31E24]/20 font-bold">
                        {tasks.filter(t => t.assignedEmployee === currentUser.id && t.status !== "Completed").length} Pending
                      </span>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {tasks.filter(t => t.assignedEmployee === currentUser.id && t.status !== "Completed").length === 0 ? (
                        <p className="text-xs text-neutral-500 italic py-6 text-center">🎉 Excellent! No pending tasks assigned to you.</p>
                      ) : (
                        tasks.filter(t => t.assignedEmployee === currentUser.id && t.status !== "Completed").map(t => (
                          <div key={t.id} className="bg-[#1C1C1E] border border-neutral-850 p-4 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono">{t.category}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                                t.priority === "Urgent" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                t.priority === "High" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                "bg-neutral-800 text-neutral-400"
                              }`}>{t.priority}</span>
                            </div>

                            <h5 className="font-bold text-slate-200">{t.title}</h5>
                            <p className="text-[10px] text-neutral-500 line-clamp-2">{t.description}</p>
                            
                            <div className="pt-2 border-t border-neutral-855 flex items-center justify-between text-[9px] text-neutral-500">
                              <span>Estimated Hours: {t.estimatedHours}h | Due: {t.deadline}</span>
                              <span className={`font-bold uppercase tracking-wider ${
                                t.status === "Waiting Review" ? "text-amber-400 animate-pulse" : "text-blue-400"
                              }`}>{t.status}</span>
                            </div>

                            <div className="pt-2 border-t border-neutral-850 flex justify-end gap-2 text-[9px]">
                              {t.status === "Not Started" && (
                                <button 
                                  onClick={() => {
                                    setTasks(tasks.map(x => x.id === t.id ? { ...x, status: "In Progress" } : x));
                                    showToast(`Task "${t.title}" moved to In Progress!`);
                                  }}
                                  className="w-full py-1.5 bg-neutral-850 hover:bg-neutral-800 text-slate-300 font-bold rounded"
                                >
                                  Start Work
                                </button>
                              )}

                              {t.status === "In Progress" && (
                                    <button 
                                      onClick={() => {
                                        setTasks(tasks.map(x => x.id === t.id ? { ...x, status: "Waiting Review" } : x));
                                        showToast(`Task "${t.title}" sent for Team Lead review!`);
                                      }}
                                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded"
                                    >
                                      Submit for Review
                                    </button>
                              )}

                              {t.status === "Waiting Review" && (
                                <span className="w-full text-center text-neutral-500 italic py-1">Awaiting Team Lead approval...</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Section: My Daily Reports */}
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300">☀️ My Recent Daily Reports</h4>
                      <span className="text-[10px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold">
                        {reports.filter(r => r.userId === currentUser.id).length} Submitted
                      </span>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {reports.filter(r => r.userId === currentUser.id).length === 0 ? (
                        <p className="text-xs text-neutral-500 italic py-6 text-center">No reports submitted yet. Punch in and submit operations updates.</p>
                      ) : (
                        reports.filter(r => r.userId === currentUser.id).slice(0, 10).map(r => (
                          <div key={r.id} className="bg-[#1C1C1E] border border-neutral-855 p-3.5 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between pb-1 border-b border-neutral-850">
                              <div>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded mr-2 ${
                                  r.type === "Morning" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                                }`}>
                                  ☀️ {r.type}
                                </span>
                                <span className="text-[9px] text-neutral-500">{r.date} at {r.submittedAt}</span>
                              </div>

                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                r.isApproved ? "text-green-400 bg-green-500/10" : "text-amber-400 bg-amber-500/10 animate-pulse"
                              }`}>
                                {r.isApproved ? "Approved ✓" : "Pending Review"}
                              </span>
                            </div>

                            <div className="text-[10px] text-neutral-400 leading-relaxed">
                              {r.type === "Morning" ? (
                                <p><strong>Tasks Planned:</strong> {r.data?.plannedTasks || r.plannedTasks || ""}</p>
                              ) : (
                                <p><strong>Tasks Completed:</strong> {r.data?.completedTasks || r.completedTasks || ""}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Feed: Active Client Projects Grid */}
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4">Active Client Portfolios</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map(c => (
                    <div key={c.id} className="bg-[#1C1C1E] border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-slate-200">{c.companyName}</h5>
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                            c.status === "Active" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-neutral-800 border border-neutral-700 text-neutral-500"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mb-4 line-clamp-2">{c.notes}</p>
                      </div>

                      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
                        <span>Assigned Lead: {getUserName(c.assignedStaff)}</span>
                        <span className="font-bold text-[#E31E24]">{isPrivileged() ? c.monthlyPackage : "₹Hidden (HR/Management Only)"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TASKS VIEW (Kanban Board) */}
          {activeTab === "tasks" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">Simulated Kanban Board</h1>
                  <p className="text-xs text-neutral-400 mt-1">One-click status shifts and drag-and-drop simulated pipeline.</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Filter priorities */}
                  <select 
                    value={filterPriority} 
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-[#1C1C1E] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E31E24]"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>

                  {isRole(["CEO", "Team_Lead"]) && (
                    <button onClick={() => { setEditingTask(null); setTaskForm({ title: "", description: "", clientId: "", projectId: "", category: "Meta Ads", priority: "Medium", assignedEmployee: "", deadline: "", estimatedHours: "" }); setShowTaskModal(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all shadow-md">
                      <Icon name="plus" className="w-4 h-4" /> Create & Assign Task
                    </button>
                  )}
                </div>
              </div>

              {/* The Kanban Board structure */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Column: To Do */}
                <div className="bg-[#121212] border border-neutral-800/80 rounded-xl p-4 flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                    <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider">To Do (Not Started)</span>
                    <span className="text-[10px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold">
                      {filteredTasksList.filter(t => t.status === "Not Started").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {filteredTasksList.filter(t => t.status === "Not Started").map(t => (
                      <KanbanCard key={t.id} task={t} />
                    ))}
                  </div>
                </div>

                {/* Column: In Progress */}
                <div className="bg-[#121212] border border-neutral-800/80 rounded-xl p-4 flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                    <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">In Progress</span>
                    <span className="text-[10px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold">
                      {filteredTasksList.filter(t => t.status === "In Progress").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {filteredTasksList.filter(t => t.status === "In Progress").map(t => (
                      <KanbanCard key={t.id} task={t} />
                    ))}
                  </div>
                </div>

                {/* Column: Review */}
                <div className="bg-[#121212] border border-neutral-800/80 rounded-xl p-4 flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Review Queue</span>
                    <span className="text-[10px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold">
                      {filteredTasksList.filter(t => t.status === "Waiting Review").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {filteredTasksList.filter(t => t.status === "Waiting Review").map(t => (
                      <KanbanCard key={t.id} task={t} />
                    ))}
                  </div>
                </div>

                {/* Column: Completed */}
                <div className="bg-[#121212] border border-neutral-800/80 rounded-xl p-4 flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
                    <span className="text-xs font-extrabold text-green-400 uppercase tracking-wider">Completed</span>
                    <span className="text-[10px] bg-neutral-850 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold">
                      {filteredTasksList.filter(t => t.status === "Completed").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {filteredTasksList.filter(t => t.status === "Completed" || t.status === "Rejected").map(t => (
                      <KanbanCard key={t.id} task={t} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CLIENTS MANAGEMENT VIEW (CRUD) */}
          {activeTab === "clients" && isRole(["CEO", "Team_Lead"]) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">Clients & Project Folders</h1>
                  <p className="text-xs text-neutral-400 mt-1">Manage external agency clients and group multiple campaign directories.</p>
                </div>
                <button onClick={() => setShowClientModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all shadow-md">
                  <Icon name="plus" className="w-4 h-4" /> Add New Client Account
                </button>
              </div>

              {/* Grid listing */}
              <div className="space-y-4">
                {clients.map(c => {
                  const clientProjects = projects.filter(p => p.clientId === c.id);
                  return (
                    <div key={c.id} className="bg-[#121212] border border-neutral-800 rounded-xl p-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-200">{c.companyName}</h3>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                              c.status === "Active" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-neutral-800 border-neutral-700 text-neutral-500"
                            }`}>{c.status}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">Contact: **{c.contactPerson}** | {c.email} | {c.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#E31E24]">{c.monthlyPackage}</p>
                          <p className="text-[10px] text-neutral-500 mt-1">Start Date: {c.startDate}</p>
                        </div>
                      </div>

                      {/* Multi projects association details */}
                      <div className="pl-6 border-l-2 border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Group Projects ({clientProjects.length})</span>
                          <button onClick={() => { setProjectForm({ name: "", clientId: c.id, description: "", status: "Active" }); setShowProjectModal(true); }} className="text-[10px] text-[#E31E24] font-bold hover:underline">+ New Project Link</button>
                        </div>
                        {clientProjects.length === 0 ? (
                          <p className="text-xs text-neutral-500 italic">No project folders created for this client.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {clientProjects.map(cp => (
                              <div key={cp.id} className="bg-[#1C1C1E] border border-neutral-850 p-3 rounded-lg flex items-center justify-between">
                                <div>
                                  <h5 className="text-xs font-bold text-slate-200">{cp.name}</h5>
                                  <p className="text-[10px] text-neutral-500 mt-0.5">{cp.description}</p>
                                </div>
                                <span className="text-[9px] uppercase font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{cp.status}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: CAMPAIGNS VIEW */}
          {activeTab === "campaigns" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">Live Campaign Tracker</h1>
                  <p className="text-xs text-neutral-400 mt-1">Real-time metrics log for Meta, Google, TikTok, and Snapchat budgets.</p>
                </div>
                {isRole(["CEO", "Team_Lead", "Digital_Marketer"]) && (
                  <button onClick={() => { setShowCampaignModal(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all shadow-md">
                    <Icon name="plus" className="w-4 h-4" /> Log Ad Spend Metrics
                  </button>
                )}
              </div>

              {/* Dynamic SVGs for CPL distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {campaigns.map(ca => {
                  const clientName = getClientName(ca.clientId);
                  return (
                    <div key={ca.id} className="bg-[#121212] border border-neutral-800 rounded-xl p-5 card-hover">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[9px] font-bold text-[#E31E24] uppercase tracking-wider">{ca.platform}</span>
                          <h4 className="text-sm font-bold text-slate-200 truncate mt-0.5">{clientName}</h4>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${ca.status === "Active" ? "bg-green-500" : "bg-neutral-600"}`}></span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 my-4 py-2 border-t border-b border-neutral-850">
                        <div>
                          <p className="text-[10px] text-neutral-500">Spend / Budget</p>
                          <p className="text-xs font-bold text-white">₹{ca.spend} <span className="text-[10px] text-neutral-400 font-normal">/ ₹{ca.budget}</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-500">Leads generated</p>
                          <p className="text-xs font-bold text-white">{ca.leads}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-500">CPL (Cost / Lead)</p>
                          <p className="text-xs font-bold text-white">₹{ca.cpl}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-500">Target ROAS</p>
                          <p className={`text-xs font-bold ${ca.roas >= 3.5 ? 'text-green-400' : ca.roas <= 2.0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{ca.roas}x</p>
                        </div>
                      </div>

                      <p className="text-[10px] text-neutral-500 italic mt-2 line-clamp-2">"{ca.dailyNotes}"</p>
                    </div>
                  );
                })}
              </div>

              {/* Content SEO Tracker inside Campaigns tab */}
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4">Content Marketing Blog Tracker</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1C1C1E] text-neutral-400 uppercase tracking-widest text-[10px] border-b border-neutral-850">
                      <tr>
                        <th className="p-4">Blog Title</th>
                        <th className="p-4">Platform (Site)</th>
                        <th className="p-4">Writer</th>
                        <th className="p-4">SEO Score</th>
                        <th className="p-4">Google Index Status</th>
                        <th className="p-4">Publish Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850">
                      {blogs.map(b => (
                        <tr key={b.id} className="hover:bg-neutral-900/50 transition-all">
                          <td className="p-4 font-bold text-slate-200">
                            <a href={b.url} target="_blank" className="hover:underline flex items-center gap-1">
                              {b.title} <Icon name="link" className="w-3 h-3 text-neutral-500" />
                            </a>
                          </td>
                          <td className="p-4">{b.blogName}</td>
                          <td className="p-4">{b.writer}</td>
                          <td className="p-4 font-bold">
                            <span className={`px-2 py-0.5 rounded ${b.seoScore >= 90 ? 'text-green-400 bg-green-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                              {b.seoScore}/100
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-300">{b.indexedStatus}</td>
                          <td className="p-4 text-neutral-500">{b.publishDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DAILY REPORTS REVIEW FLOW */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">Daily Operations Reports</h1>
                  <p className="text-xs text-neutral-400 mt-1">Review morning target goals and evening output reviews. Team Lead approves submissions.</p>
                </div>
                {isRole(["Digital_Marketer", "Designer"]) && (
                  <button onClick={() => { setReportForm({ type: "Morning", data: { plannedTasks: "", priority: "", clientWork: "", supportRequired: "", completedTasks: "", pendingTasks: "", campaignUpdates: "", blogUpdates: "", socialMediaUpdates: "", clientCommunication: "", issues: "", tomorrowPlan: "" } }); setShowReportModal(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all shadow-md">
                    <Icon name="plus" className="w-4 h-4" /> Submit Live Report
                  </button>
                )}
              </div>

              {/* Listing reports */}
              <div className="space-y-4">
                {reports.map(r => {
                  const author = users.find(u => u.id === r.userId);
                  return (
                    <div key={r.id} className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-850">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E31E24] text-white flex items-center justify-center font-bold text-xs uppercase">
                            {author?.avatar || "OP"}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-200">{author?.name}</h4>
                            <p className="text-[10px] text-neutral-500">{r.date} | Submitted at: {r.submittedAt}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded ${
                            r.type === "Morning" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          }`}>
                            ☀️ {r.type} Report
                          </span>

                          {/* Approval toggles */}
                          {isRole(["Team_Lead"]) ? (
                            <button 
                              onClick={() => toggleReportApproval(r.id)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                r.isApproved ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-[#E31E24] text-white hover:bg-[#C21319]"
                              }`}
                            >
                              {r.isApproved ? "Approved ✓" : "Review & Approve"}
                            </button>
                          ) : (
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                              r.isApproved ? "text-green-400 bg-green-500/10 border border-green-500/20" : "text-amber-400 bg-amber-500/10 border border-amber-500/20 animate-pulse"
                            }`}>
                              {r.isApproved ? "Approved ✓" : "Under Team Lead Review"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dynamic content rendering depending on Morning vs Evening */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                        {r.type === "Morning" ? (
                          <>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Planned Tasks Today</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{r.data?.plannedTasks || r.plannedTasks || ""}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Priority Target</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{r.data?.priority || r.priority || ""}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Client Portfolios</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{r.data?.clientWork || r.clientWork || ""}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Support Required</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{r.data?.supportRequired || r.supportRequired || ""}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Completed Work</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{r.data?.completedTasks || r.completedTasks || ""}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Pending Handover</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{r.data?.pendingTasks || r.pendingTasks || ""}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Campaign Status Logs</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{r.data?.campaignUpdates || r.campaignUpdates || ""}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 uppercase tracking-wider text-[9px] font-bold">Issues & Support</p>
                              <p className="text-slate-200 mt-1 leading-relaxed">{(r.data?.issues || r.issues) || "None"}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: CREATIVE MANAGEMENT */}
          {activeTab === "creatives" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">Creative Production Pipeline</h1>
                  <p className="text-xs text-neutral-400 mt-1">Review graphic posters, reels, and video files. Approval workflow from Designer to Delivered.</p>
                </div>
                {isRole(["Designer"]) && (
                  <button onClick={() => setShowCreativeModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all shadow-md">
                    <Icon name="plus" className="w-4 h-4" /> Upload Creative File
                  </button>
                )}
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatives.map(cr => {
                  const artist = users.find(u => u.id === cr.designerId);
                  return (
                    <div key={cr.id} className="bg-[#121212] border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-850">
                          <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono">{cr.fileType}</span>
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                            cr.approvalStatus === "Delivered" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            cr.approvalStatus === "CEO" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {cr.approvalStatus} Review
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-200 mt-2">{cr.title}</h4>
                        <p className="text-[10px] text-neutral-500 mt-1">Artist: {artist?.name} | Submitted: {cr.submittedAt}</p>
                        
                        {cr.canvaLink && (
                          <a href={cr.canvaLink} target="_blank" className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#E31E24] hover:underline font-bold">
                            <Icon name="link" className="w-3.5 h-3.5" /> View Canva Design File
                          </a>
                        )}
                      </div>

                      {/* Approval flow action triggers based on current logged user */}
                      <div className="mt-6 pt-4 border-t border-neutral-850 flex gap-2">
                        {currentUser.role === "Team_Lead" && cr.approvalStatus === "Team_Lead" && (
                          <button 
                            onClick={() => handleCreativeStatusChange(cr.id, "CEO")}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all text-center"
                          >
                            Forward to CEO (Approve)
                          </button>
                        )}
                        {currentUser.role === "CEO" && cr.approvalStatus === "CEO" && (
                          <button 
                            onClick={() => handleCreativeStatusChange(cr.id, "Delivered")}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all text-center"
                          >
                            Mark as Delivered (Final)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: ATTENDANCE TRACKER */}
          {activeTab === "attendance" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Attendance Log</h1>
                <p className="text-xs text-neutral-400 mt-1">Office timings are strictly logged. Clock in before 09:30 AM to avoid Late notifications.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Panel 1: Live clock in status */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 mb-3">Live Log Terminal</h3>
                    <div className="py-4 text-center">
                      <div className="text-3xl font-extrabold text-white tracking-widest font-mono">07:23 PM</div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Status: Operational</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-neutral-850">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Logged Clock In:</span>
                      <span className="font-bold text-slate-200">{attendance.find(a => a.userId === currentUser.id && a.date === getLocalDate())?.clockIn || "Not logged"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Logged Clock Out:</span>
                      <span className="font-bold text-slate-200">{attendance.find(a => a.userId === currentUser.id && a.date === getLocalDate())?.clockOut || "Not logged"}</span>
                    </div>
                  </div>
                </div>

                {/* Panel 2: Complete log list */}
                <div className="lg:col-span-2 bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 mb-4">Daily Attendance List</h3>
                  <div className="divide-y divide-neutral-850">
                    {attendance.map(a => {
                      const employee = users.find(u => u.id === a.userId);
                      return (
                        <div key={a.id} className="py-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-1">
                              {a.photoIn && (
                                <img 
                                  src={a.photoIn} 
                                  alt="In" 
                                  onClick={() => setViewPhoto({ title: `${employee?.name} Clock In Snapshot`, src: a.photoIn })}
                                  className="w-5 h-5 rounded-full border border-neutral-800 object-cover cursor-pointer hover:scale-125 hover:z-10 transition-all shadow" 
                                />
                              )}
                              {a.photoOut && (
                                <img 
                                  src={a.photoOut} 
                                  alt="Out" 
                                  onClick={() => setViewPhoto({ title: `${employee?.name} Clock Out Snapshot`, src: a.photoOut })}
                                  className="w-5 h-5 rounded-full border border-neutral-800 object-cover cursor-pointer hover:scale-125 hover:z-10 transition-all shadow" 
                                />
                              )}
                            </div>
                            <span className="font-bold text-slate-200">{employee?.name}</span>
                            <span className="text-neutral-500 font-mono text-[10px]">{a.date}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono text-neutral-400">
                              In: {a.clockIn || "--"} | Out: {a.clockOut || "--"}
                              {a.clockIn && a.clockOut && (
                                <span className="text-[#E31E24] font-bold ml-1.5">({calculateHoursWorked(a.clockIn, a.clockOut)}h)</span>
                              )}
                            </span>
                            {a.isLate ? (
                              <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Late Entry</span>
                            ) : (
                              <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">On Time</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Panel 3: Monthly Staff Calculation Report */}
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-850 mb-4 gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Monthly Team Work Report Calculation</h3>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Calculated aggregates of attendance, total hours worked, leaves, and average rates.</p>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-slate-300 px-3 py-1.5 rounded-lg border border-neutral-800 font-bold transition-all shadow-md w-fit"
                  >
                    Print Calculation Sheet
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[600px]">
                    <thead>
                      <tr className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider border-b border-neutral-850 pb-2">
                        <th className="py-2.5 font-bold">Staff Employee</th>
                        <th className="py-2.5 font-bold">Role</th>
                        <th className="py-2.5 text-center font-bold">Days Present</th>
                        <th className="py-2.5 text-center font-bold">Late Days</th>
                        <th className="py-2.5 text-center font-bold">Leaves Taken</th>
                        <th className="py-2.5 text-right font-bold">Total Hours Worked</th>
                        <th className="py-2.5 text-right font-bold">Avg Hrs/Day</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850">
                      {users.map(u => {
                        const userLogs = attendance.filter(a => a.userId === u.id);
                        const daysPresent = userLogs.filter(a => a.clockIn && !a.onLeave).length;
                        const lateDays = userLogs.filter(a => a.isLate).length;
                        const leavesTaken = userLogs.filter(a => a.onLeave).length;
                        
                        const totalHours = userLogs.reduce((acc, curr) => {
                          return acc + calculateHoursWorked(curr.clockIn, curr.clockOut);
                        }, 0);

                        const avgHours = daysPresent > 0 ? (totalHours / daysPresent).toFixed(1) : "0.0";

                        return (
                          <tr key={u.id} className="hover:bg-neutral-900/10 transition-colors">
                            <td className="py-3 font-bold text-slate-200">{u.name}</td>
                            <td className="py-3 text-neutral-400 text-[10px]">{u.role.replace("_", " ")}</td>
                            <td className="py-3 text-center text-slate-300 font-semibold">{daysPresent}</td>
                            <td className="py-3 text-center font-semibold text-amber-500">{lateDays}</td>
                            <td className="py-3 text-center font-semibold text-red-400">{leavesTaken}</td>
                            <td className="py-3 text-right font-bold text-[#E31E24]">{totalHours.toFixed(1)} hrs</td>
                            <td className="py-3 text-right font-semibold text-slate-300">{avgHours} hrs</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: CALENDAR PLANNER */}
          {activeTab === "calendar" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Calendar Agenda View</h1>
                <p className="text-xs text-neutral-400 mt-1">Deadlines, client reporting goals, and campaign reviews plotted dynamically.</p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4">
                  <span className="text-neutral-500 font-bold">Mon</span>
                  <span className="text-neutral-500 font-bold">Tue</span>
                  <span className="text-neutral-500 font-bold">Wed</span>
                  <span className="text-neutral-500 font-bold">Thu</span>
                  <span className="text-neutral-500 font-bold">Fri</span>
                  <span className="text-neutral-500 font-bold">Sat</span>
                  <span className="text-neutral-500 font-bold">Sun</span>
                </div>

                <div className="grid grid-cols-7 gap-2 h-96">
                  {/* Empty cells to pad index */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-[#1A1A1A]/40 border border-neutral-900 rounded-lg p-2 opacity-30"></div>
                  ))}

                  {/* Days */}
                  {Array.from({ length: 28 }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                    const dayTasks = tasks.filter(t => t.deadline === dateStr);
                    
                    return (
                      <div key={dayNum} className={`bg-[#1C1C1E] border border-neutral-800/80 rounded-lg p-2 flex flex-col justify-between hover:border-neutral-700 transition-all ${
                        dateStr === "2026-07-24" ? 'border-[#E31E24]/60 bg-red-950/5' : ''
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold ${
                            dateStr === "2026-07-24" ? 'text-[#E31E24] font-extrabold' : 'text-neutral-500'
                          }`}>{dayNum}</span>
                        </div>

                        <div className="flex-1 space-y-1 overflow-hidden">
                          {dayTasks.map(dt => (
                            <div key={dt.id} className="text-[9px] font-bold bg-[#E31E24]/10 text-slate-200 border border-[#E31E24]/20 p-1 rounded truncate leading-tight">
                              {dt.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: STAFF DIRECTORY */}
          {activeTab === "staff-dir" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">Staff Directory</h1>
                  <p className="text-xs text-neutral-400 mt-1">Manage employee profiles, login credentials, and base monthly salaries.</p>
                </div>
                {isRole(["CEO"]) && (
                  <button 
                    onClick={() => {
                      setEditingStaff(null);
                      setStaffForm({ name: "", email: "", role: "Digital_Marketer", department: "Digital Marketing", avatar: "", status: "Active", baseSalary: 3000 });
                      setShowStaffModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl hover:bg-[#C21319] transition-all shadow-md"
                  >
                    <Icon name="plus" className="w-3.5 h-3.5" /> Add Staff Account
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(u => (
                  <div key={u.id} className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 relative flex flex-col justify-between card-hover">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 text-[#E31E24] font-bold text-lg uppercase flex items-center justify-center">
                          {u.avatar || u.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                            {u.name}
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              u.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-500"
                            }`}>{u.status}</span>
                          </h3>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">{u.role.replace("_", " ")}</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-neutral-850 pt-4 text-xs text-neutral-400">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Department:</span>
                          <span className="font-semibold text-slate-300">{u.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">System Email:</span>
                          <span className="font-semibold text-slate-300 truncate max-w-[150px]">{u.email}</span>
                        </div>
                        {(isPrivileged() || u.id === currentUser.id) && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Base Salary:</span>
                            <span className="font-semibold text-[#E31E24] font-mono">₹{(u.baseSalary || 3000).toLocaleString()}/mo</span>
                          </div>
                        )}
                        {(isPrivileged() || u.id === currentUser.id) && (
                          <div className="flex justify-between border-t border-neutral-850/50 pt-2 mt-2">
                            <span className="text-neutral-500">Login Password:</span>
                            <span className="font-semibold text-slate-400 font-mono select-all bg-[#1C1C1E] px-2 py-0.5 rounded border border-neutral-800">{u.password}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isRole(["CEO"]) && (
                      <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-850/50">
                        <button 
                          onClick={() => {
                            setEditingStaff(u);
                            setStaffForm({ ...u });
                            setShowStaffModal(true);
                          }}
                          className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-850 text-slate-300 rounded-xl text-[10px] font-bold border border-neutral-800 transition-all flex items-center justify-center gap-1"
                        >
                          <Icon name="edit" className="w-3.5 h-3.5 text-[#E31E24]" /> Edit Details
                        </button>
                        {u.id !== currentUser.id && (
                          <button 
                            onClick={() => handleStaffDelete(u.id, u.name)}
                            className="px-3 py-2 bg-neutral-900 hover:bg-red-950/20 text-red-400 hover:text-red-500 border border-neutral-800 hover:border-red-900/50 rounded-xl transition-all"
                            title="Delete Account"
                          >
                            <Icon name="trash" className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MUSTER ROLL */}
          {activeTab === "muster-roll" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Muster Roll Attendance Grid</h1>
                <p className="text-xs text-neutral-400 mt-1">Monthly grid overview for July 2026. Code matrix key: P = Present, L = Late, LV = Approved Leave, A = Absent, H = Holiday, WE = Weekend.</p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase tracking-widest text-[9px] font-bold">
                      <th className="py-3 px-4 min-w-[160px] sticky left-0 bg-[#121212] z-10">Staff Employee</th>
                      {Array.from({ length: 28 }).map((_, i) => (
                        <th key={i} className="py-3 px-1.5 text-center min-w-[32px]">{i + 1}</th>
                      ))}
                      <th className="py-3 px-4 text-center min-w-[70px]">P</th>
                      <th className="py-3 px-4 text-center min-w-[70px]">L</th>
                      <th className="py-3 px-4 text-center min-w-[70px]">LV</th>
                      <th className="py-3 px-4 text-center min-w-[70px]">A</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {users.map(u => {
                      let pCount = 0;
                      let lCount = 0;
                      let lvCount = 0;
                      let aCount = 0;

                      const dailyCells = Array.from({ length: 28 }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                        
                        // Check status
                        const isHoliday = holidaysList.some(h => h.date === dateStr);
                        const isLeave = leaves.some(l => l.userId === u.id && l.status === "Approved" && dateStr >= l.startDate && dateStr <= l.endDate);
                        const att = attendance.find(a => a.userId === u.id && a.date === dateStr);
                        const d = new Date(dateStr);
                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                        if (isHoliday) {
                          return <td key={i} className="py-3 px-1 text-center font-bold text-purple-400 bg-purple-500/5">H</td>;
                        } else if (isLeave) {
                          lvCount++;
                          return <td key={i} className="py-3 px-1 text-center font-bold text-blue-400 bg-blue-500/5">LV</td>;
                        } else if (att) {
                          if (att.isLate) {
                            lCount++;
                            return <td key={i} className="py-3 px-1 text-center font-bold text-amber-400 bg-amber-500/5">L</td>;
                          }
                          pCount++;
                          return <td key={i} className="py-3 px-1 text-center font-bold text-emerald-400 bg-emerald-500/5">P</td>;
                        } else if (isWeekend) {
                          return <td key={i} className="py-3 px-1 text-center text-slate-600 bg-slate-500/5">WE</td>;
                        } else {
                          const todayStr = getLocalDate();
                          if (dateStr < todayStr) {
                            aCount++;
                            return <td key={i} className="py-3 px-1 text-center font-bold text-rose-500 bg-rose-500/5">A</td>;
                          }
                          return <td key={i} className="py-3 px-1 text-center text-slate-700">-</td>;
                        }
                      });

                      return (
                        <tr key={u.id} className="hover:bg-neutral-900/40">
                          <td className="py-3 px-4 font-bold text-slate-200 flex items-center gap-2 sticky left-0 bg-[#121212] border-r border-neutral-850 z-10 min-w-[160px]">
                            <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-855 flex items-center justify-center text-[10px] text-[#E31E24] font-extrabold uppercase">
                              {u.avatar || u.name[0]}
                            </div>
                            <span className="truncate">{u.name}</span>
                          </td>
                          {dailyCells}
                          <td className="py-3 px-4 text-center font-bold text-emerald-400">{pCount}</td>
                          <td className="py-3 px-4 text-center font-bold text-amber-400">{lCount}</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-400">{lvCount}</td>
                          <td className="py-3 px-4 text-center font-bold text-rose-400">{aCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: LEAVE REQUESTS */}
          {activeTab === "leaves" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submission Form Column */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 h-fit">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850 flex items-center gap-2">
                    <Icon name="leave" className="text-[#E31E24]" /> Apply for Leave
                  </h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.target);
                    const newLeave = {
                      id: `l-${Date.now()}`,
                      userId: currentUser.id,
                      startDate: data.get("startDate"),
                      endDate: data.get("endDate"),
                      type: data.get("type"),
                      reason: data.get("reason"),
                      status: "Pending",
                      approvedBy: null
                    };
                    setLeaves([newLeave, ...leaves]);
                    showToast("Leave request submitted successfully for approval.");
                    e.target.reset();
                  }} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Leave Type</label>
                      <select name="type" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white">
                        {leaveTemplates.map(t => (
                          <option key={t.id} value={t.type}>{t.type} (Quota: {t.allowance} days)</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Start Date</label>
                        <input type="date" name="startDate" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" required />
                      </div>
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">End Date</label>
                        <input type="date" name="endDate" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Reason Description</label>
                      <textarea name="reason" rows="3" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-805 rounded-xl text-white" placeholder="Provide background details..." required></textarea>
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#C21319] text-white font-bold transition-all shadow-md">
                      Submit Leave Form
                    </button>
                  </form>
                </div>

                {/* Registry Column */}
                <div className="lg:col-span-2 bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850">Leave Registry & Approvals</h2>
                  <div className="space-y-4">
                    {leaves.filter(l => isPrivileged() || l.userId === currentUser.id).length === 0 ? (
                      <p className="text-xs text-neutral-500 text-center py-8">No leave requests logged yet.</p>
                    ) : (
                      leaves.filter(l => isPrivileged() || l.userId === currentUser.id).map(l => {
                        const emp = users.find(u => u.id === l.userId) || { name: "Unknown" };
                        return (
                          <div key={l.id} className="p-4 bg-[#1C1C1E] border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="font-bold text-slate-200">{emp.name}</span>
                                <span className="text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded font-medium">{l.type}</span>
                              </div>
                              <p className="text-[10px] text-[#E31E24] font-semibold mb-1">📅 {l.startDate} to {l.endDate}</p>
                              <p className="text-[11px] text-neutral-400 italic">"{l.reason}"</p>
                              {l.status === "Approved" && (
                                <p className="text-[9px] text-green-500 mt-1 font-bold">Approved by: {getUserName(l.approvedBy)}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {l.status === "Pending" ? (
                                isRole(["CEO", "Team_Lead"]) ? (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => {
                                        setLeaves(leaves.map(item => item.id === l.id ? { ...item, status: "Approved", approvedBy: currentUser.id } : item));
                                        showToast("Leave approved!");
                                      }}
                                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setLeaves(leaves.map(item => item.id === l.id ? { ...item, status: "Rejected" } : item));
                                        showToast("Leave request rejected.");
                                      }}
                                      className="px-3 py-1.5 bg-neutral-800 hover:bg-red-950/20 hover:text-red-400 text-slate-400 font-bold rounded-lg border border-neutral-700 transition-all"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-bold text-[10px] uppercase">Pending</span>
                                )
                              ) : (
                                <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase border ${
                                  l.status === "Approved" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-neutral-850 text-neutral-500 border-neutral-850"
                                }`}>{l.status}</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LEAVE TEMPLATES */}
          {activeTab === "leave-templates" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add/Edit Template Form */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 h-fit">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850 flex items-center gap-2">
                    <Icon name="calendar" className="text-[#E31E24]" /> Add Leave Template
                  </h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.target);
                    const type = data.get("type");
                    const allowance = parseInt(data.get("allowance"));
                    const newT = {
                      id: `lt-${Date.now()}`,
                      type,
                      allowance,
                      color: "text-[#E31E24] bg-[#E31E24]/10 border-[#E31E24]/20"
                    };
                    setLeaveTemplates([...leaveTemplates, newT]);
                    showToast(`Template for ${type} created successfully.`);
                    e.target.reset();
                  }} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Leave Designation</label>
                      <input type="text" name="type" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. Parental Leave (PL)" required />
                    </div>
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Annual Quota (Days Allowed)</label>
                      <input type="number" name="allowance" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. 15" required />
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#C21319] text-white font-bold transition-all shadow-md">
                      Save Quota Rule
                    </button>
                  </form>
                </div>

                {/* Active Templates Grid */}
                <div className="lg:col-span-2 bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850">Standard Quotas & Rules</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leaveTemplates.map(t => (
                      <div key={t.id} className="p-5 bg-[#1C1C1E] border border-neutral-855 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-200">{t.type}</h4>
                          <p className="text-xs text-[#E31E24] font-bold mt-1 font-mono">{t.allowance} Days / yr allowance</p>
                        </div>
                        {isRole(["CEO"]) && (
                          <button 
                            onClick={() => {
                              setLeaveTemplates(leaveTemplates.filter(item => item.id !== t.id));
                              showToast("Template removed.");
                            }}
                            className="p-2 text-neutral-500 hover:text-red-500 rounded-lg hover:bg-red-950/20 border border-neutral-800 transition-all"
                          >
                            <Icon name="trash" className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OVERTIME TEMPLATES */}
          {activeTab === "overtime-templates" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Overtime Config */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 h-fit">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850">Configure Overtime Multiplier</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.target);
                    const name = data.get("name");
                    const multiplier = parseFloat(data.get("multiplier"));
                    const minHours = parseInt(data.get("minHours"));
                    const newO = {
                      id: `ot-${Date.now()}`,
                      name,
                      rateMultiplier: multiplier,
                      minHours
                    };
                    setOvertimeTemplates([...overtimeTemplates, newO]);
                    showToast(`Overtime config for ${name} added.`);
                    e.target.reset();
                  }} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Rule Title</label>
                      <input type="text" name="name" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. Sunday Double Rate" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Rate Multiplier</label>
                        <input type="number" step="0.1" name="multiplier" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. 1.8" required />
                      </div>
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Min Daily Hours</label>
                        <input type="number" name="minHours" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. 1" required />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#C21319] text-white font-bold transition-all shadow-md">
                      Activate Overtime Rule
                    </button>
                  </form>
                </div>

                {/* Active Rules Registry */}
                <div className="lg:col-span-2 bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850">Standard Payroll Overtime Rates</h2>
                  <div className="space-y-3">
                    {overtimeTemplates.map(t => (
                      <div key={t.id} className="p-4 bg-[#1C1C1E] border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-slate-200">{t.name}</h4>
                          <p className="text-[10px] text-neutral-500 mt-0.5">Threshold: triggers after {t.minHours} hour(s) of extra work.</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-extrabold text-emerald-400 font-mono text-sm bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">{t.rateMultiplier}x Rate</span>
                          {isRole(["CEO"]) && (
                            <button 
                              onClick={() => {
                                setOvertimeTemplates(overtimeTemplates.filter(item => item.id !== t.id));
                                showToast("Overtime rule deactivated.");
                              }}
                              className="p-1.5 text-neutral-500 hover:text-red-500 rounded border border-neutral-800 transition-all"
                            >
                              <Icon name="trash" className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOLIDAYS REGISTRY */}
          {activeTab === "holidays-list" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Holiday Form */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 h-fit">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850 flex items-center gap-2">
                    <Icon name="calendar" className="text-[#E31E24]" /> Register Holiday
                  </h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.target);
                    const name = data.get("name");
                    const date = data.get("date");
                    const type = data.get("type");
                    const newH = {
                      id: `h-${Date.now()}`,
                      name,
                      date,
                      type
                    };
                    setHolidaysList([...holidaysList, newH]);
                    showToast(`Holiday "${name}" registered successfully.`);
                    e.target.reset();
                  }} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Holiday Name</label>
                      <input type="text" name="name" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. Labor Day" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Holiday Date</label>
                        <input type="date" name="date" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" required />
                      </div>
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Holiday Type</label>
                        <select name="type" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white">
                          <option value="Public">Public (Mandatory)</option>
                          <option value="Optional">Optional (Regional)</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#C21319] text-white font-bold transition-all shadow-md">
                      Register Holiday Date
                    </button>
                  </form>
                </div>

                {/* Active Registry Column */}
                <div className="lg:col-span-2 bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850">Company Calendar Holidays</h2>
                  <div className="space-y-3">
                    {holidaysList.map(h => (
                      <div key={h.id} className="p-4 bg-[#1C1C1E] border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-slate-200">{h.name}</h4>
                          <p className="text-[10px] text-[#E31E24] font-semibold mt-0.5">📅 {h.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                            h.type === "Public" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-neutral-800 text-neutral-400 border-neutral-700"
                          }`}>{h.type} Holiday</span>
                          {isRole(["CEO"]) && (
                            <button 
                              onClick={() => {
                                setHolidaysList(holidaysList.filter(item => item.id !== h.id));
                                showToast("Holiday removed from registry.");
                              }}
                              className="p-1.5 text-neutral-500 hover:text-red-500 rounded border border-neutral-850 transition-all"
                            >
                              <Icon name="trash" className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SALARY & PAYROLL */}
          {activeTab === "payroll" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Monthly Payroll Management</h1>
                <p className="text-xs text-neutral-400 mt-1">Calculates base monthly payout, overtime credits, late check-in deductions (₹15/late), and print detailed salary slip records.</p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase tracking-widest text-[9px] font-bold">
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Base Salary</th>
                      <th className="py-3 px-4 text-center">Days Present</th>
                      <th className="py-3 px-4 text-center">Late Count</th>
                      <th className="py-3 px-4 text-center">Approved Leaves</th>
                      <th className="py-3 px-4 text-center">Overtime Hours</th>
                      <th className="py-3 px-4 text-right">Deductions</th>
                      <th className="py-3 px-4 text-right">Additions</th>
                      <th className="py-3 px-4 text-right">Net Payout</th>
                      <th className="py-3 px-4 text-center">Payslip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 text-slate-300">
                    {users.map(u => {
                      // Calculate statistics for July 2026
                      let daysPresent = 0;
                      let latesCount = 0;
                      let leavesApproved = 0;
                      let overtimeHours = 0;

                      Array.from({ length: 28 }).forEach((_, i) => {
                        const dayNum = i + 1;
                        const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                        
                        const att = attendance.find(a => a.userId === u.id && a.date === dateStr);
                        const leave = leaves.find(l => l.userId === u.id && l.status === "Approved" && dateStr >= l.startDate && dateStr <= l.endDate);
                        
                        if (leave) {
                          leavesApproved++;
                        } else if (att) {
                          daysPresent++;
                          if (att.isLate) latesCount++;
                          // Calculate overtime (hours worked over 8 hours)
                          const totalHrs = calculateHoursWorked(att.clockIn, att.clockOut);
                          if (totalHrs > 8) {
                            overtimeHours += (totalHrs - 8);
                          }
                        }
                      });

                      // Payroll calculations
                      const baseSalary = u.baseSalary || 3000;
                      const hourlyRate = baseSalary / 160; // 160 standard hours / month
                      const lateDeduction = latesCount * 15;
                      const overtimePay = parseFloat((overtimeHours * hourlyRate * 1.5).toFixed(2));
                      const netPayout = parseFloat((baseSalary - lateDeduction + overtimePay).toFixed(2));

                      return (
                        <tr key={u.id} className="hover:bg-neutral-900/20">
                          <td className="py-4 px-4 font-bold text-slate-200 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-[#E31E24] font-bold text-xs uppercase flex items-center justify-center">
                              {u.avatar || u.name[0]}
                            </div>
                            <div>
                              <h4 className="font-bold">{u.name}</h4>
                              <p className="text-[9px] text-neutral-500 uppercase">{u.role.replace("_", " ")}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold">₹{baseSalary.toLocaleString()}</td>
                          <td className="py-4 px-4 text-center font-bold">{daysPresent}</td>
                          <td className="py-4 px-4 text-center text-amber-500 font-bold">{latesCount}</td>
                          <td className="py-4 px-4 text-center text-blue-400 font-bold">{leavesApproved}</td>
                          <td className="py-4 px-4 text-center text-emerald-400 font-bold">{overtimeHours.toFixed(1)} hrs</td>
                          <td className="py-4 px-4 text-right text-red-500 font-mono font-semibold">-₹{lateDeduction}</td>
                          <td className="py-4 px-4 text-right text-green-400 font-mono font-semibold">+₹{overtimePay}</td>
                          <td className="py-4 px-4 text-right text-slate-100 font-mono font-bold">₹{netPayout.toLocaleString()}</td>
                          <td className="py-4 px-4 text-center">
                            <button 
                              onClick={() => {
                                setViewPayslipData({
                                  employee: u,
                                  baseSalary,
                                  daysPresent,
                                  latesCount,
                                  leavesApproved,
                                  overtimeHours,
                                  lateDeduction,
                                  overtimePay,
                                  netPayout
                                });
                              }}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-[#E31E24] text-slate-300 hover:text-white rounded-lg border border-neutral-800 hover:border-[#E31E24]/30 transition-all font-semibold"
                            >
                              View Slip
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: EXPENSES */}
          {activeTab === "expenses" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Reimbursement Form */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 h-fit">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850 flex items-center gap-2">
                    <Icon name="expense" className="text-[#E31E24]" /> Request Reimbursement
                  </h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.target);
                    const title = data.get("title");
                    const amount = parseFloat(data.get("amount"));
                    const category = data.get("category");
                    const notes = data.get("notes");
                    const newClaim = {
                      id: `ec-${Date.now()}`,
                      userId: currentUser.id,
                      title,
                      amount,
                      category,
                      notes,
                      status: "Pending"
                    };
                    setExpenseClaims([newClaim, ...expenseClaims]);
                    showToast(`Expense claim for "${title}" submitted.`);
                    e.target.reset();
                  }} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Claim Title</label>
                      <input type="text" name="title" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. Travel tickets to office" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Amount (₹)</label>
                        <input type="number" step="0.01" name="amount" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="e.g. 150" required />
                      </div>
                      <div>
                        <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Category</label>
                        <select name="category" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white">
                          <option value="Marketing Spend">Marketing Spend</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Travel Allowance">Travel Allowance</option>
                          <option value="Software License">Software License</option>
                          <option value="Design Assets">Design Assets</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Justification / Notes</label>
                      <textarea name="notes" rows="3" className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white" placeholder="Provide link to invoice or description..." required></textarea>
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#C21319] text-white font-bold transition-all shadow-md">
                      Submit Expense Claim
                    </button>
                  </form>
                </div>

                {/* Claims Registry Column */}
                <div className="lg:col-span-2 bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850">Claims & Logs</h2>
                  <div className="space-y-4">
                    {expenseClaims.filter(c => isPrivileged() || c.userId === currentUser.id).length === 0 ? (
                      <p className="text-xs text-neutral-500 text-center py-8">No expense claims logged yet.</p>
                    ) : (
                      expenseClaims.filter(c => isPrivileged() || c.userId === currentUser.id).map(c => {
                        const emp = users.find(u => u.id === c.userId) || { name: "Unknown" };
                        return (
                          <div key={c.id} className="p-4 bg-[#1C1C1E] border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-200">{emp.name}</span>
                                <span className="text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-855 px-2 py-0.5 rounded font-medium">{c.category}</span>
                              </div>
                              <h4 className="font-semibold text-slate-300 text-xs mb-1">{c.title}</h4>
                              <p className="text-[10px] text-[#E31E24] font-mono font-bold">₹{c.amount.toLocaleString()}</p>
                              <p className="text-[11px] text-neutral-500 italic mt-1">"{c.notes}"</p>
                            </div>

                            <div className="flex items-center gap-3">
                              {c.status === "Pending" ? (
                                isRole(["CEO"]) ? (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => {
                                        setExpenseClaims(expenseClaims.map(item => item.id === c.id ? { ...item, status: "Approved" } : item));
                                        showToast("Expense claim approved!");
                                      }}
                                      className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setExpenseClaims(expenseClaims.map(item => item.id === c.id ? { ...item, status: "Rejected" } : item));
                                        showToast("Expense claim rejected.");
                                      }}
                                      className="px-2.5 py-1.5 bg-[#1C1C1E] border border-[#E31E24]/20 text-slate-400 hover:text-[#E31E24] font-bold rounded-lg transition-all"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-bold text-[10px] uppercase">Pending</span>
                                )
                              ) : (
                                <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase border ${
                                  c.status === "Approved" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-neutral-850 text-neutral-500 border-neutral-805"
                                }`}>{c.status}</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CASH FLOW */}
          {(activeTab === "cash-flow" || activeTab === "cashflow") && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Financial Cash Flow Ledger</h1>
                <p className="text-xs text-neutral-400 mt-1">Real-time tracking of incoming client revenue vs payroll costs and business expenses (Indian Rupees).</p>
              </div>

              {/* Profit Summary Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Total Inflow (Client Revenue)</p>
                  <h3 className="text-3xl font-bold text-green-400 mt-2">
                    ₹{(clients.reduce((acc, c) => acc + (c.status === "Active" ? (parseFloat(c.monthlyPackage) || 0) : 0), 0)).toLocaleString("en-IN")}/mo
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-1">From {clients.filter(c => c.status === "Active").length} active clients</p>
                </div>

                {/* Expenses & Payroll Card */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Total Outflow (Payroll & Claims)</p>
                  <h3 className="text-3xl font-bold text-red-400 mt-2">
                    ₹{((users.reduce((acc, u) => acc + (parseFloat(u.baseSalary) || 0), 0)) +
                       (expenseClaims.filter(c => c.status === "Approved").reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0))).toLocaleString("en-IN")}/mo
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    ₹{users.reduce((acc, u) => acc + (parseFloat(u.baseSalary) || 0), 0).toLocaleString("en-IN")} payroll + ₹{expenseClaims.filter(c => c.status === "Approved").reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0).toLocaleString("en-IN")} approved claims
                  </p>
                </div>

                {/* Net Cash Flow Card */}
                {(() => {
                  const inflow = clients.reduce((acc, c) => acc + (c.status === "Active" ? (parseFloat(c.monthlyPackage) || 0) : 0), 0);
                  const outflow = (users.reduce((acc, u) => acc + (parseFloat(u.baseSalary) || 0), 0)) +
                                  (expenseClaims.filter(c => c.status === "Approved").reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0));
                  const net = inflow - outflow;
                  return (
                    <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-24 h-24 ${net >= 0 ? "bg-emerald-500/5" : "bg-rose-500/5"} rounded-full blur-2xl`}></div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Net Cash Flow (Profit/Loss)</p>
                      <h3 className={`text-3xl font-bold ${net >= 0 ? "text-emerald-400" : "text-red-400"} mt-2`}>
                        {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString("en-IN")}/mo
                      </h3>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Net operational margin: {inflow > 0 ? ((net / inflow) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Inflow vs Outflow Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Ledger */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Client Revenue Ledger (Inflow)
                  </h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {clients.filter(c => c.status === "Active").map(c => (
                      <div key={c.id} className="flex justify-between items-center p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-200">{c.companyName}</p>
                          <p className="text-[9px] text-neutral-500">Package started: {c.startDate}</p>
                        </div>
                        <span className="text-xs font-bold text-green-400">
                          +₹{(parseFloat(c.monthlyPackage) || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Costs Ledger */}
                <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-neutral-850 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Payroll & Expenses Ledger (Outflow)
                  </h2>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {/* Payroll costs */}
                    {users.map(u => (
                      <div key={u.id} className="flex justify-between items-center p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-slate-200">{u.name}</p>
                          <p className="text-[9px] text-neutral-500">Base Salary ({u.role})</p>
                        </div>
                        <span className="text-xs font-bold text-red-400">
                          -₹{(parseFloat(u.baseSalary) || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}

                    {/* Approved claims */}
                    {expenseClaims.filter(c => c.status === "Approved").map(c => {
                      const employee = users.find(x => x.id === c.userId)?.name || "Staff Member";
                      return (
                        <div key={c.id} className="flex justify-between items-center p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{c.title}</p>
                            <p className="text-[9px] text-neutral-500">Claim Reimbursement by {employee}</p>
                          </div>
                          <span className="text-xs font-bold text-red-400 font-medium">
                            -₹{(parseFloat(c.amount) || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTIVITY SCORE */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Agency Leaderboard & Productivity Score</h1>
                <p className="text-xs text-neutral-400 mt-1">Calculated velocity indices and team member performance metrics.</p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6">
                <div className="divide-y divide-neutral-850">
                  <div className="py-4 flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest text-[9px] border-b border-neutral-850">
                    <span>Team Employee</span>
                    <div className="flex items-center gap-16">
                      <span>Tasks Handled</span>
                      <span>Productivity Rank</span>
                    </div>
                  </div>

                  {users.filter(u => u.role !== "CEO").map((u, index) => {
                    const employeeTasks = tasks.filter(t => t.assignedEmployee === u.id);
                    const completed = employeeTasks.filter(t => t.status === "Completed").length;
                    const completionPct = employeeTasks.length ? Math.round((completed / employeeTasks.length) * 100) : 100;
                    
                    return (
                      <div key={u.id} className="py-4 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-[#E31E24] font-bold text-xs uppercase flex items-center justify-center">
                            {u.avatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-200">{u.name}</h4>
                            <p className="text-[10px] text-neutral-500">{u.department}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-16 font-semibold">
                          <span>{completed} / {employeeTasks.length} Done ({completionPct}%)</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            index === 0 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                          }`}>
                            Rank #{index + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADMIN SETTINGS */}
          {activeTab === "settings" && isRole(["CEO"]) && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Agency Settings</h1>
                <p className="text-xs text-neutral-400 mt-1">Configure global marketing operations settings and parameters.</p>
              </div>

              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-6 max-w-2xl">
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast("Agency configurations updated successfully!"); }}>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-bold">Standard Office Hours</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-xs text-white" 
                        value={settings.officeIn} 
                        onChange={(e) => setSettings({ ...settings, officeIn: e.target.value })}
                      />
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-xs text-white" 
                        value={settings.officeOut} 
                        onChange={(e) => setSettings({ ...settings, officeOut: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-bold">Standard Agency Working Days</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-xs text-white" 
                      value={settings.workingDays} 
                      onChange={(e) => setSettings({ ...settings, workingDays: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-bold">Listed Holidays</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-xs text-white" 
                      value={settings.holidays} 
                      onChange={(e) => setSettings({ ...settings, holidays: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="px-4 py-2 bg-[#E31E24] hover:bg-[#C21319] text-white font-bold rounded-xl text-xs transition-all shadow-md">
                    Save Configuration Settings
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL DIALOGS COMPONENT LIBRARY --- */}

      {/* MODAL: TASK DELEGATOR */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-100 mb-4">{editingTask ? "Edit Operations Task" : "Assign Team Task"}</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Task Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white focus:outline-none"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Description Details</label>
                <textarea 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white h-24 focus:outline-none"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Client Account</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={taskForm.clientId}
                    onChange={(e) => setTaskForm({ ...taskForm, clientId: e.target.value })}
                    required
                  >
                    <option value="">Select client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Linked Project Folder</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                    required
                  >
                    <option value="">Select project...</option>
                    {projects.filter(p => p.clientId === taskForm.clientId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Assign Employee</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={taskForm.assignedEmployee}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedEmployee: e.target.value })}
                    required
                  >
                    <option value="">Select staff...</option>
                    {users.filter(u => u.role !== "CEO").map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Priority Status</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Deadline Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] hover:bg-[#C21319] text-white font-bold rounded-xl shadow-md">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLIENT */}
      {showClientModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Add Client Account</h3>
            <form onSubmit={handleClientSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={clientForm.companyName}
                    onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Contact Person</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={clientForm.contactPerson}
                    onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Monthly Package Rate</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    placeholder="e.g. ₹3,000/mo"
                    value={clientForm.monthlyPackage}
                    onChange={(e) => setClientForm({ ...clientForm, monthlyPackage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Assigned Staff Lead</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={clientForm.assignedStaff}
                    onChange={(e) => setClientForm({ ...clientForm, assignedStaff: e.target.value })}
                  >
                    <option value="">Select staff...</option>
                    {users.filter(u => u.role !== "CEO").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Notes & Directives</label>
                <textarea 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white h-20"
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button type="button" onClick={() => setShowClientModal(false)} className="px-4 py-2 bg-neutral-900 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] text-white font-bold rounded-xl shadow-md">Add Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PROJECT */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Link Project Folder</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Project Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Client Link</label>
                <select 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  value={projectForm.clientId}
                  onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                  required
                >
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Description Details</label>
                <textarea 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white h-20"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button type="button" onClick={() => setShowProjectModal(false)} className="px-4 py-2 bg-neutral-900 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] text-white font-bold rounded-xl shadow-md">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPORT INTAKE FORM */}
      {showReportModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Submit Daily Operations Report</h3>
            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Report Type</label>
                <select 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  value={reportForm.type}
                  onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                >
                  <option value="Morning">Morning Report (Target/Commitments)</option>
                  <option value="Evening">Evening Report (Deliverables/Updates)</option>
                </select>
              </div>

              {reportForm.type === "Morning" ? (
                <>
                  <div>
                    <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Today's Planned Tasks</label>
                    <textarea 
                      className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white h-20"
                      value={reportForm.data.plannedTasks}
                      onChange={(e) => setReportForm({ ...reportForm, data: { ...reportForm.data, plannedTasks: e.target.value } })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Priority Target Goal</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                      value={reportForm.data.priority}
                      onChange={(e) => setReportForm({ ...reportForm, data: { ...reportForm.data, priority: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Associated Client Accounts</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                      value={reportForm.data.clientWork}
                      onChange={(e) => setReportForm({ ...reportForm, data: { ...reportForm.data, clientWork: e.target.value } })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Completed Tasks Today</label>
                    <textarea 
                      className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white h-20"
                      value={reportForm.data.completedTasks}
                      onChange={(e) => setReportForm({ ...reportForm, data: { ...reportForm.data, completedTasks: e.target.value } })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Pending Tasks & Obstacles</label>
                    <textarea 
                      className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white h-20"
                      value={reportForm.data.pendingTasks}
                      onChange={(e) => setReportForm({ ...reportForm, data: { ...reportForm.data, pendingTasks: e.target.value } })}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button type="button" onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-neutral-900 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] text-white font-bold rounded-xl shadow-md">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CAMPAIGN LOG */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Log Ad Spend Metrics</h3>
            <form onSubmit={handleCampaignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Client Account</label>
                <select 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  value={campaignForm.clientId}
                  onChange={(e) => setCampaignForm({ ...campaignForm, clientId: e.target.value })}
                  required
                >
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Platform Channel</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={campaignForm.platform}
                    onChange={(e) => setCampaignForm({ ...campaignForm, platform: e.target.value })}
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="TikTok Ads">TikTok Ads</option>
                    <option value="Snapchat Ads">Snapchat Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Total Budget</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={campaignForm.budget}
                    onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Daily Spend</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={campaignForm.spend}
                    onChange={(e) => setCampaignForm({ ...campaignForm, spend: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Total Leads</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={campaignForm.leads}
                    onChange={(e) => setCampaignForm({ ...campaignForm, leads: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">ROAS Ratio</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    placeholder="e.g. 4.2"
                    value={campaignForm.roas}
                    onChange={(e) => setCampaignForm({ ...campaignForm, roas: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Platform Status Details</label>
                <textarea 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white h-20"
                  value={campaignForm.dailyNotes}
                  onChange={(e) => setCampaignForm({ ...campaignForm, dailyNotes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button type="button" onClick={() => setShowCampaignModal(false)} className="px-4 py-2 bg-neutral-900 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] text-white font-bold rounded-xl shadow-md">Log campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATIVE UPLOAD */}
      {showCreativeModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Upload Design Creative File</h3>
            <form onSubmit={handleCreativeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Creative Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  value={creativeForm.title}
                  onChange={(e) => setCreativeForm({ ...creativeForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">File Asset Type</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={creativeForm.fileType}
                    onChange={(e) => setCreativeForm({ ...creativeForm, fileType: e.target.value })}
                  >
                    <option value="Poster">Poster</option>
                    <option value="Video">Video</option>
                    <option value="Thumbnail">Thumbnail</option>
                    <option value="Reel">Reel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Linked Operations Task</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={creativeForm.taskId}
                    onChange={(e) => setCreativeForm({ ...creativeForm, taskId: e.target.value })}
                  >
                    <option value="">Select task...</option>
                    {tasks.filter(t => t.assignedEmployee === currentUser.id).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Canva Web Link (Optional)</label>
                <input 
                  type="url" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  placeholder="https://canva.com/design/..."
                  value={creativeForm.canvaLink}
                  onChange={(e) => setCreativeForm({ ...creativeForm, canvaLink: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button type="button" onClick={() => setShowCreativeModal(false)} className="px-4 py-2 bg-neutral-900 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] text-white font-bold rounded-xl shadow-md">Upload and Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STAFF MANAGEMENT */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-slate-100 mb-4">{editingStaff ? "Edit Staff Credentials" : "Add Staff Account"}</h3>
            <form onSubmit={handleStaffSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  disabled={!!editingStaff}
                  required
                />
              </div>

              {!editingStaff && (
                <p className="text-[11px] text-amber-300">Create the Auth account first in Supabase Dashboard. Its Staff profile is added automatically.</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">System Role</label>
                  <select 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-850 rounded-xl text-white"
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  >
                    <option value="CEO">CEO (Admin)</option>
                    <option value="Team_Lead">Team Lead</option>
                    <option value="Digital_Marketer">Digital Marketer</option>
                    <option value="Designer">Graphic Designer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Department</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white"
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Base Monthly Salary ($)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white font-mono"
                  value={staffForm.baseSalary || ""}
                  onChange={(e) => setStaffForm({ ...staffForm, baseSalary: e.target.value })}
                  placeholder="e.g. 3000"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button type="button" onClick={() => { setShowStaffModal(false); setEditingStaff(null); setStaffForm({ name: "", email: "", role: "Digital_Marketer", department: "Digital Marketing", avatar: "", status: "Active", baseSalary: 3000 }); }} className="px-4 py-2 bg-neutral-900 text-slate-300 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] text-white font-bold rounded-xl shadow-md">{editingStaff ? "Save Account" : "Create Account"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AI SERVICE POPUP PANEL */}
      {aiModalType && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E31E24] animate-ping"></span>
                <h3 className="text-lg font-bold text-slate-100 capitalize">AI Operations Output</h3>
              </div>
              <button onClick={() => setAiModalType(null)} className="text-neutral-500 hover:text-white text-lg font-bold">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-[#1C1C1E] border border-neutral-850 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
              {aiOutput}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850 mt-4">
              <button onClick={() => setAiModalType(null)} className="px-4 py-2 bg-[#E31E24] hover:bg-[#C21319] text-white font-bold rounded-xl text-xs shadow-md">Close Assistant</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAMERA PHOTO PUNCH LOG */}
      {punchType && (
        <PunchCameraModal 
          type={punchType}
          onClose={() => setPunchType(null)}
          onSubmit={handlePunchSubmit}
        />
      )}

      {/* MODAL: IMAGE PREVIEW LOG ZOOM */}
      {viewPhoto && (
        <div className="fixed inset-0 bg-[#000000]/90 z-[60] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121212] border border-neutral-850 rounded-2xl p-4 shadow-2xl animate-fade-in flex flex-col items-center">
            <div className="flex items-center justify-between w-full border-b border-neutral-850 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-200">{viewPhoto.title}</span>
              <button onClick={() => setViewPhoto(null)} className="text-neutral-500 hover:text-white text-xs font-bold">✕ Close</button>
            </div>
            <img src={viewPhoto.src} className="w-full rounded-xl border border-neutral-800 object-contain max-h-[50vh]" />
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE PAYSLIP */}
      {viewPayslipData && (
        <div className="fixed inset-0 bg-[#000000]/90 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-8 shadow-2xl animate-fade-in print:p-0 print:border-none print:shadow-none relative">
            {/* Close & Print buttons */}
            <div className="absolute top-4 right-4 flex gap-3 print:hidden">
              <button 
                onClick={() => window.print()} 
                className="px-4 py-2 bg-[#E31E24] text-white text-xs font-bold rounded-xl shadow hover:bg-[#C21319] transition-all"
              >
                🖨️ Print Payslip
              </button>
              <button 
                onClick={() => setViewPayslipData(null)} 
                className="px-4 py-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-300 transition-all"
              >
                ✕ Close
              </button>
            </div>

            {/* Payslip Header */}
            <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Shah Digital Marketing Agency</h2>
              <p className="text-[10px] tracking-widest text-slate-500 uppercase font-bold mt-1">Delhi - Dubai - Riyadh</p>
              <h3 className="text-sm font-extrabold text-[#E31E24] uppercase tracking-wider mt-3">Monthly Compensation Slip</h3>
            </div>

            {/* Employee Info Block */}
            <div className="grid grid-cols-2 gap-6 text-xs mb-8">
              <div>
                <p className="text-neutral-500 uppercase font-bold tracking-wider mb-1">Employee Details</p>
                <h4 className="text-sm font-bold text-slate-900">{viewPayslipData.employee.name}</h4>
                <p className="text-neutral-600 mt-0.5">{viewPayslipData.employee.role.replace("_", " ")}</p>
                <p className="text-neutral-600">{viewPayslipData.employee.department}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-500 uppercase font-bold tracking-wider mb-1">Statement Summary</p>
                <p className="text-slate-900 font-bold">Month: <span className="font-semibold text-slate-700">July 2026</span></p>
                <p className="text-slate-900 font-bold">Payout Date: <span className="font-semibold text-slate-700">July 28, 2026</span></p>
                <p className="text-slate-900 font-bold">Payment Mode: <span className="font-semibold text-slate-700">Direct Deposit</span></p>
              </div>
            </div>

            {/* Grid matrix of earnings and deductions */}
            <div className="grid grid-cols-2 gap-8 border-t border-b border-slate-300 py-6 mb-8 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 text-green-700">Earnings & Credits</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Basic Monthly Salary</span>
                    <span className="font-mono font-semibold">₹{viewPayslipData.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Overtime Addition ({viewPayslipData.overtimeHours.toFixed(1)} hrs)</span>
                    <span className="font-mono">+₹{viewPayslipData.overtimePay}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 text-red-700">Deductions & Offsets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Late Check-in Penalty ({viewPayslipData.latesCount} lates)</span>
                    <span className="font-mono">-₹{viewPayslipData.lateDeduction}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Approved Leaves Taken ({viewPayslipData.leavesApproved} days)</span>
                    <span className="font-mono">₹0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Payout Banner */}
            <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-between mb-8">
              <div>
                <h4 className="text-xs font-bold text-slate-600 uppercase">Total Net Payout</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Calculated Net (Basic Salary + Overtime Pay - Late Penalty)</p>
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-mono">₹{viewPayslipData.netPayout.toLocaleString()}</h3>
            </div>

            {/* Corporate Footer Signs */}
            <div className="flex justify-between text-[10px] pt-12 text-slate-500">
              <div className="text-center w-1/3 border-t border-slate-300 pt-2">
                <p className="font-bold text-slate-700">Employee Signature</p>
                <p className="mt-1 font-mono">{viewPayslipData.employee.name}</p>
              </div>
              <div className="text-center w-1/3 border-t border-slate-300 pt-2">
                <p className="font-bold text-slate-700">Authorized Signature</p>
                <p className="mt-1 font-mono text-[#E31E24] font-bold">SHAH RUKH (CEO)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121212] border border-neutral-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850 mb-4">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                🔑 Security Credentials
              </h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordsForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                }} 
                className="text-neutral-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Current Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white focus:outline-none"
                  value={passwordsForm.oldPassword}
                  onChange={(e) => setPasswordsForm({ ...passwordsForm, oldPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">New Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white focus:outline-none"
                  value={passwordsForm.newPassword}
                  onChange={(e) => setPasswordsForm({ ...passwordsForm, newPassword: e.target.value })}
                  placeholder="At least 8 chars"
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-500 uppercase tracking-wider mb-1 font-bold">Confirm New Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 bg-[#1C1C1E] border border-neutral-800 rounded-xl text-white focus:outline-none"
                  value={passwordsForm.confirmPassword}
                  onChange={(e) => setPasswordsForm({ ...passwordsForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordsForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  }} 
                  className="px-4 py-2 bg-neutral-900 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#E31E24] text-white font-bold rounded-xl shadow-md">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  // Kanban Card Sub-Component with status toggle transitions
  function KanbanCard({ task }) {
    const isOwner = currentUser.id === task.assignedEmployee || isRole(["CEO", "Team_Lead"]);
    
    // Status color badge
    const badgeColor = task.priority === "Urgent" ? "bg-red-500/10 border-red-500/20 text-red-400 font-extrabold animate-pulse" :
                       task.priority === "High" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                       "bg-slate-800 text-slate-400 border-neutral-700";

    const moveTaskStatus = (nextStatus) => {
      const updated = tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t);
      setTasks(updated);
      showToast(`Task moved to ${nextStatus.replace("_", " ")}`);
    };

    return (
      <div className="bg-[#1C1C1E] border border-neutral-850 p-4 rounded-xl shadow-md card-hover space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono">{task.category}</span>
          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>{task.priority}</span>
        </div>

        <h5 className="text-xs font-bold text-slate-200 line-clamp-2">{task.title}</h5>
        <p className="text-[10px] text-neutral-500 line-clamp-2">{task.description}</p>

        <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-[9px] text-neutral-500">
          <span>Assigned: **{getUserName(task.assignedEmployee)}**</span>
          <span className="font-mono">Due: {task.deadline}</span>
        </div>

        {/* Action controls for one-click status transitions */}
        {isOwner && (
          <div className="pt-2 border-t border-neutral-850 flex items-center justify-between gap-1 text-[9px]">
            {task.status !== "Not Started" && (
              <button onClick={() => moveTaskStatus(task.status === "In Progress" ? "Not Started" : task.status === "Waiting Review" ? "In Progress" : "Waiting Review")} className="text-neutral-500 hover:text-slate-300 font-bold">← Back</button>
            )}
            
            {task.status === "Not Started" && (
              <button onClick={() => moveTaskStatus("In Progress")} className="w-full py-1 bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 text-slate-300 font-bold rounded">Start Work</button>
            )}

            {task.status === "In Progress" && (
              <button onClick={() => moveTaskStatus("Waiting Review")} className="w-full py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded">Submit Review</button>
            )}

            {task.status === "Waiting Review" && isRole(["Team_Lead", "CEO"]) && (
              <div className="w-full flex gap-1">
                <button onClick={() => moveTaskStatus("Completed")} className="w-1/2 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded">Approve</button>
                <button onClick={() => moveTaskStatus("In Progress")} className="w-1/2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded">Reject</button>
              </div>
            )}

            {task.status === "Completed" && (
              <span className="w-full text-center text-green-400 font-bold">Approved ✓</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Live webcam photo capture modal sub-component
  function PunchCameraModal({ type, onClose, onSubmit }) {
    const videoRef = React.useRef(null);
    const [stream, setStream] = React.useState(null);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      let activeStream = null;
      const startCam = async () => {
        try {
          setLoading(true);
          setError("");
          const constraints = { video: { width: 320, height: 240, facingMode: "user" } };
          const s = await navigator.mediaDevices.getUserMedia(constraints);
          activeStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
          setLoading(false);
        } catch (err) {
          console.error("Camera error:", err);
          setError("Webcam access denied or unavailable. You can still punch without a photo.");
          setLoading(false);
        }
      };
      startCam();
      return () => {
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
      };
    }, []);

    const handleCapture = () => {
      let photoData = "";
      if (videoRef.current && stream) {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 320;
          canvas.height = 240;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          photoData = canvas.toDataURL("image/jpeg", 0.7);
        } catch (e) {
          console.error("Canvas capture error:", e);
        }
      }
      onSubmit(photoData);
    };

    return (
      <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#121212] border border-neutral-850 rounded-2xl p-6 shadow-2xl animate-fade-in flex flex-col items-center">
          <h3 className="text-sm font-bold text-slate-100 mb-1">Live Punch Photo Capture</h3>
          <p className="text-[10px] text-neutral-400 mb-4 text-center">Center your face in the frame to record a punch {type === 'In' ? 'In' : 'Out'}.</p>
          
          <div className="relative w-full aspect-video rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/60 z-10">
                <span className="w-6 h-6 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin"></span>
              </div>
            )}
            {error ? (
              <div className="p-4 text-center">
                <span className="text-lg">⚠️</span>
                <p className="text-[10px] text-neutral-400 mt-2 leading-relaxed">{error}</p>
              </div>
            ) : (
              <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" playsInline muted />
            )}
            {!error && !loading && (
              <div className="absolute inset-0 border-2 border-dashed border-[#E31E24]/20 pointer-events-none grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-neutral-800/10"></div>
                <div className="border-r border-b border-neutral-800/10"></div>
                <div className="border-b border-neutral-800/10"></div>
                <div className="border-r border-b border-neutral-800/10"></div>
                <div className="border-r border-b border-neutral-800/20 rounded-full m-4"></div>
                <div className="border-b border-neutral-800/10"></div>
                <div className="border-r border-neutral-800/10"></div>
                <div className="border-r border-neutral-800/10"></div>
                <div></div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5 w-full text-xs">
            <button 
              type="button" 
              onClick={() => {
                if (stream) stream.getTracks().forEach(t => t.stop());
                onClose();
              }}
              className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-slate-300 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleCapture}
              className="flex-1 py-2 bg-[#E31E24] hover:bg-[#C21319] text-white font-bold rounded-xl shadow-md"
            >
              {error ? "Proceed Blank" : `Punch ${type}`}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Inject App shell node to DOM tree
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
