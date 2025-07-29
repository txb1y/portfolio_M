// ================================
// GEMINI AI CHATBOT SERVICE
// ================================
import { websiteConfig, personalInfo, educationData, skillsData, projectsData, certificatesData } from '../data/website-data';

// Gemini API Configuration
const GEMINI_API_KEY = websiteConfig.geminiApiKey;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

// Create context about Bharathi from website data
const createPortfolioContext = (): string => {
  const context = `
You are a smart, helpful, and friendly student portfolio assistant. Your job is to help users learn more about Bharathi, guide them through the website, and answer any career or tech-related questions they may have.

IMPORTANT: Bharathi B. is a MALE student. Always use masculine pronouns (he/him/his) when referring to Bharathi.

CONTEXT:
- You are embedded in a personal developer portfolio of Bharathi, a passionate B.Tech IT student from Tamil Nadu
- The site has these sections: Hero, About, Education, Skills, Projects, GitHub, Contact, and Extras
- Education includes 10th, 12th, and current college timeline with detailed achievements
- Projects include AI tools, automation bots, and hardware/software experiments

COMPREHENSIVE INFORMATION ABOUT BHARATHI:

PERSONAL INFORMATION:
- Name: ${personalInfo.name} (Male)
- Role: ${personalInfo.role}
- Location: ${personalInfo.location}
- Email: ${personalInfo.email}
- About: ${personalInfo.aboutText}
- Interests: ${personalInfo.interests}

EDUCATION TIMELINE:
${educationData.map((edu: any) => `
- ${edu.degree} at ${edu.institution} (${edu.period}) - ${edu.status}
  Description: ${edu.description}
  Key Areas: ${edu.highlights.join(', ')}
`).join('')}

TECHNICAL SKILLS:
${skillsData.map((skill: any) => `- ${skill.name} (${skill.category})`).join('\n')}

PROJECTS PORTFOLIO:
${projectsData.map((project: any) => `
- ${project.title}
  Description: ${project.description}
  Technologies: ${project.techStack.join(', ')}
  Live URL: ${project.liveUrl}
  GitHub: ${project.githubUrl}
`).join('')}

CERTIFICATES & ACHIEVEMENTS:
${certificatesData.map((cert: any) => `
- ${cert.title} by ${cert.issuer} (${cert.year})
  Certificate ID: ${cert.certificateId}
`).join('')}

SOCIAL LINKS:
- GitHub: ${personalInfo.socialLinks.github}
- LinkedIn: ${personalInfo.socialLinks.linkedin}
- Resume: ${personalInfo.socialLinks.resumeUrl}

BEHAVIOR GUIDELINES:
1. Respond in a warm, smart, helpful tone—like a friend who's also a career mentor
2. Use information from the website and timeline when replying
3. Guide users to explore the site by suggesting specific sections (e.g., "Check the *Projects* tab for cool AI tools Bharathi built!")
4. Give career advice, coding tips, or academic motivation when asked
5. Always adapt to student visitors and answer questions like:
   • "How did Bharathi learn Java?"
   • "What are Bharathi's best projects?"
   • "Can I see Bharathi's GitHub?"
   • "How to get started with AI like Bharathi?"
   • "Where did Bharathi study 10th and 12th?"
   • "Give me motivation to learn coding"
6. Speak in a natural, human way—keep it conversational and inspiring
7. When unsure, say: "That's a great question! I'll check the info on this page or you can use the *Contact* section to ask Bharathi directly."
8. ALWAYS use masculine pronouns (he/him/his) when referring to Bharathi - HE IS MALE
9. Keep replies under 4 sentences and highlight important words with asterisks
10. Keep tone enthusiastic and future-focused
11. Use emojis occasionally to make responses more engaging
12. Contact info: ${personalInfo.email}
`;

  return context;
};

// Function to check if question is relevant to portfolio
const isRelevantQuestion = (question: string): boolean => {
  const lowerQuestion = question.toLowerCase();
  const relevantKeywords = [
    'bharathi', 'education', 'skill', 'project', 'experience', 'work', 'technology', 'tech',
    'certificate', 'qualification', 'study', 'college', 'university', 'degree', 'programming',
    'development', 'web', 'react', 'javascript', 'typescript', 'python', 'portfolio',
    'background', 'about', 'contact', 'email', 'github', 'linkedin', 'resume', 'cv',
    'internship', 'learning', 'interest', 'passion', 'goal', 'future', 'career',
    'hello', 'hi', 'hey', 'who', 'what', 'where', 'when', 'how', 'tell me',
    'learn', 'teach', 'help', 'advice', 'tips', 'motivation', 'inspire', 'guidance',
    'java', 'ai', 'artificial intelligence', 'machine learning', 'web development',
    'frontend', 'backend', 'database', 'algorithm', 'coding', 'code', 'software',
    'app', 'website', 'platform', 'system', 'tools', 'framework', 'library',
    'student', 'college', 'academy', 'school', '10th', '12th', 'grade', 'class',
    'achievement', 'award', 'recognition', 'success', 'best', 'favorite'
  ];

  return relevantKeywords.some(keyword => lowerQuestion.includes(keyword));
};

// Function to generate response using Gemini AI
export const generateGeminiResponse = async (userMessage: string): Promise<string> => {
  try {
    // Check if question is relevant
    if (!isRelevantQuestion(userMessage)) {
      return "I'm here to help you learn about Bharathi's portfolio, education, skills, and projects! Feel free to ask me anything related to his professional background. 😊";
    }

    // Set a timeout for faster responses
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const context = createPortfolioContext();
    const prompt = `${context}

User Question: "${userMessage}"

IMPORTANT REMINDER: Bharathi B. is MALE. Always use HE/HIM/HIS pronouns when referring to Bharathi in your response.

FORMATTING GUIDELINES:
- Use **bold** for important keywords and highlights
- Use *italics* for emphasis 
- Use bullet points (- or •) for lists when appropriate
- Keep responses conversational and engaging
- Use emojis sparingly but effectively
- Highlight important sections like *Projects*, *Skills*, *Contact* with asterisks

Please provide a helpful, engaging, and attractive response based on the portfolio information above. Keep it conversational, friendly, and under 150 words. Remember to use masculine pronouns (he/him/his) consistently and format your response with markdown for better readability.`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 150,
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`Gemini API responded with status: ${response.status}`);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback to local responses for faster, reliable responses
    return getFallbackResponse(userMessage);
  }
};

// Fallback responses when API is unavailable
const getFallbackResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  if (message.includes("education") || message.includes("study") || message.includes("degree")) {
    return "🎓 He's currently pursuing a *B.Tech in Information Technology* at Kongunadu College of Engineering and Technology (2023-2027). He completed his Higher Secondary Education from The Modern Academy with focus on Mathematics and Computer Science. Check the *Education* section for his complete academic timeline!";
  }
  
  if (message.includes("skills") || message.includes("technology") || message.includes("tech")) {
    const skills = skillsData.map((skill: any) => skill.name).slice(0, 5).join(", ");
    return `💻 His technical skills include *${skills}* and many more! He's passionate about full-stack development and AI/ML. Explore the *Skills* section to see his complete tech stack and proficiency levels!`;
  }
  
  if (message.includes("projects") || message.includes("work") || message.includes("portfolio")) {
    return "🚀 He's built amazing projects like:\n\n• **AI-Powered Smart Farming Platform**\n• **StudentConnect** collaboration platform\n• This beautiful portfolio website!\n\nEach project showcases different aspects of his development skills. Check the **Projects** section for live demos and source code!";
  }
  
  if (message.includes("github") || message.includes("code") || message.includes("repository")) {
    return `💻 You can find all his code and projects on **GitHub**! He regularly commits new projects and contributions. Visit his GitHub profile or click the GitHub icon in the header to explore his repositories!`;
  }
  
  if (message.includes("experience") || message.includes("background")) {
    return "👨‍💻 He's a passionate IT student specializing in **full-stack development** with experience in modern web technologies, *AI/ML concepts*, and database management. He enjoys contributing to innovative projects and continuously learning new technologies!";
  }
  
  if (message.includes("contact") || message.includes("reach") || message.includes("email")) {
    return `📧 You can reach him at **${personalInfo.email}** or through the **Contact** section on this website. He's always open to discussing new opportunities, collaborations, and innovative projects!`;
  }
  
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "👋 **Hello! Nice to meet you!** I'm here to help you learn more about *Bharathi's* background, skills, and projects. Feel free to ask about his education, achievements, or any tech-related questions!";
  }

  if (message.includes("certificates") || message.includes("certification") || message.includes("achievement")) {
    return "🏆 He has several certifications including:\n\n• **Front End Web Developer Certification** from Infosys Springboard\n• Internship completion certificates\n• Various course completions in web development\n\nCheck the **Certificates** section for his complete achievement timeline!";
  }

  if (message.includes("motivation") || message.includes("inspire") || message.includes("advice")) {
    return "💪 Bharathi believes in *continuous learning* and hands-on practice! His journey shows that with dedication and curiosity, you can master any technology. Start with small projects, build consistently, and never stop exploring new tools!";
  }

  if (message.includes("learn") || message.includes("start") || message.includes("begin")) {
    return "🌟 Start with the basics, build projects, and stay curious! Bharathi learned by doing - from simple websites to complex AI applications. Check his *Projects* section for inspiration, and remember: every expert was once a beginner!";
  }

  if (message.includes("10th") || message.includes("12th") || message.includes("school")) {
    return "🏫 He completed his *10th grade* with excellent marks and his *12th grade* from The Modern Academy Matric Hr. Sec. School with focus on Mathematics and Computer Science. His strong foundation in academics helped shape his tech journey!";
  }

  return "I can help you learn about Bharathi's *education*, *skills*, *projects*, and experience. Feel free to ask about his journey, achievements, or get some coding motivation! 😊 What would you like to know?";
};

export default generateGeminiResponse;
