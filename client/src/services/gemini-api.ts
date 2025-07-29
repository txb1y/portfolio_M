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
You are an AI assistant representing Bharathi B.'s portfolio. Here is comprehensive information about Bharathi:

PERSONAL INFORMATION:
- Name: ${personalInfo.name}
- Role: ${personalInfo.role}
- Location: ${personalInfo.location}
- Email: ${personalInfo.email}
- About: ${personalInfo.aboutText}
- Interests: ${personalInfo.interests}

EDUCATION:
${educationData.map((edu: any) => `
- ${edu.degree} at ${edu.institution} (${edu.period}) - ${edu.status}
  Description: ${edu.description}
  Key Areas: ${edu.highlights.join(', ')}
`).join('')}

SKILLS:
${skillsData.map((skill: any) => `- ${skill.name} (${skill.category})`).join('\n')}

PROJECTS:
${projectsData.map((project: any) => `
- ${project.title}
  Description: ${project.description}
  Technologies: ${project.techStack.join(', ')}
  Live URL: ${project.liveUrl}
  GitHub: ${project.githubUrl}
`).join('')}

CERTIFICATES:
${certificatesData.map((cert: any) => `
- ${cert.title} by ${cert.issuer} (${cert.year})
  Certificate ID: ${cert.certificateId}
`).join('')}

SOCIAL LINKS:
- GitHub: ${personalInfo.socialLinks.github}
- LinkedIn: ${personalInfo.socialLinks.linkedin}
- Resume: ${personalInfo.socialLinks.resumeUrl}

RESPONSE GUIDELINES:
1. Be attractive, engaging, and enthusiastic when responding
2. Keep responses conversational and friendly
3. Only answer questions related to Bharathi's portfolio, education, skills, projects, or professional background
4. For unrelated questions, politely redirect to portfolio topics
5. Be helpful and provide specific details when asked
6. Use emojis occasionally to make responses more engaging
7. If asked about contact, mention the email: ${personalInfo.email}
8. Always maintain a professional yet friendly tone
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
    'hello', 'hi', 'hey', 'who', 'what', 'where', 'when', 'how', 'tell me'
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

Please provide a helpful, engaging, and attractive response based on the portfolio information above. Keep it conversational, friendly, and under 150 words.`;

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
    return "🎓 I'm currently pursuing a B.Tech in Information Technology at Kongunadu College of Engineering and Technology (2023-2027). I completed my Higher Secondary Education (Class 12) in 2023 from The Modern Academy Matric Hr. Sec. School with focus on Mathematics and Computer Science.";
  }
  
  if (message.includes("skills") || message.includes("technology") || message.includes("tech")) {
    const skills = skillsData.map((skill: any) => skill.name).join(", ");
    return `💻 My technical skills include: ${skills}. I'm always learning new technologies to stay current with industry trends!`;
  }
  
  if (message.includes("projects") || message.includes("work") || message.includes("portfolio")) {
    return "🚀 I've worked on several exciting projects including an AI-Powered Smart Farming Platform, StudentConnect collaboration platform, and this portfolio website! Each project showcases different aspects of my full-stack development skills. Check them out in the projects section!";
  }
  
  if (message.includes("experience") || message.includes("background")) {
    return "👨‍💻 I'm a passionate IT student specializing in full-stack development with experience in modern web technologies, AI/ML concepts, and database management. I enjoy contributing to innovative projects and continuously learning new technologies!";
  }
  
  if (message.includes("contact") || message.includes("reach") || message.includes("email")) {
    return `📧 You can reach me at ${personalInfo.email} or through the contact form on this website. I'm always open to discussing new opportunities and innovative projects!`;
  }
  
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "👋 Hello! Nice to meet you! I'm here to help you learn more about Bharathi's background and experience. What would you like to know?";
  }

  if (message.includes("certificates") || message.includes("certification")) {
    return "🏆 I have several certifications including Front End Web Developer Certification from Infosys Springboard, internship completion certificates, and various course completions in web development and programming!";
  }

  return "I can help you learn about Bharathi's education, skills, projects, and experience. Feel free to ask me anything about his portfolio! 😊";
};

export default generateGeminiResponse;
