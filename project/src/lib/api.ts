import OpenAI from 'openai';
import { supabase } from './supabase';
import { qaDataset } from '../data/chatData';

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable client-side usage
});

// Function to find a matching answer from the dataset
function findAnswerInDataset(question: string) {
  // Convert question to lowercase for case-insensitive matching
  const normalizedQuestion = question.toLowerCase().trim();
  
  // Try to find an exact match first
  const exactMatch = qaDataset.find(
    qa => qa.question.toLowerCase() === normalizedQuestion
  );
  
  if (exactMatch) return exactMatch.answer;
  
  // If no exact match, look for questions that contain the user's query
  const partialMatches = qaDataset.filter(
    qa => qa.question.toLowerCase().includes(normalizedQuestion) ||
          normalizedQuestion.includes(qa.question.toLowerCase())
  );
  
  if (partialMatches.length > 0) {
    // Return the answer from the first partial match
    return partialMatches[0].answer;
  }
  
  // No match found in the dataset
  return null;
}

export async function getChatResponse(message: string) {
  try {
    // First check if we have an answer in our dataset
    const datasetAnswer = findAnswerInDataset(message);
    
    if (datasetAnswer) {
      return datasetAnswer;
    }
    
    // If not in dataset, use OpenAI
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 500
      });

      return completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback to dataset-like response for common questions
      const fallbackResponses = {
        "hello": "Hello! How can I help you today?",
        "hi": "Hi there! What can I assist you with?",
        "how are you": "I'm just a computer program, but I'm functioning well! How can I help you?",
        "what is your name": "I'm an AI Assistant powered by OpenAI. You can call me Assistant.",
        "who are you": "I'm an AI Assistant designed to help answer your questions and assist with various tasks.",
        "thank you": "You're welcome! Feel free to ask if you need anything else.",
        "thanks": "You're welcome! Is there anything else I can help with?",
        "bye": "Goodbye! Feel free to come back if you have more questions.",
        "help": "I can help answer questions, provide information, or assist with various topics. Just let me know what you need!"
      };
      
      // Check for simple greetings or common phrases
      const lowerMessage = message.toLowerCase().trim();
      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (lowerMessage.includes(key)) {
          return response;
        }
      }
      
      // If no fallback matches, generate a generic response based on the query
      if (lowerMessage.includes("what is") || lowerMessage.includes("explain") || lowerMessage.includes("how to")) {
        return `I'd be happy to explain about ${message.replace(/what is|explain|how to/gi, "").trim()}. However, I'm currently having trouble connecting to my knowledge base. Please try again later or rephrase your question.`;
      }
      
      // Default fallback response
      return "I understand you're asking about " + message.trim() + ". While I'm having trouble connecting to my full knowledge base right now, I'd be happy to try answering a different question or you can try again later.";
    }
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "I apologize, but I'm having trouble processing your request. Please try again with a different question.";
  }
}

export async function getWebReferences(query: string) {
  try {
    // This is a mock implementation - in a real app, you would call a search API
    // For demo purposes, we'll generate some fake references based on the query
    
    // Common topics with prepared responses
    const topics = {
      git: [
        {
          title: "Git - Wikipedia",
          url: "https://en.wikipedia.org/wiki/Git",
          description: "Git is a distributed version control system that tracks changes in any set of computer files, usually used for coordinating work among programmers collaboratively developing source code during software development.",
          source: "Wikipedia"
        },
        {
          title: "Git Documentation",
          url: "https://git-scm.com/doc",
          description: "The official Git documentation, including reference manuals, books, and videos to help you learn Git.",
          source: "git-scm.com"
        },
        {
          title: "Learn Git Branching",
          url: "https://learngitbranching.js.org/",
          description: "An interactive Git visualization tool to educate and challenge both beginners and advanced developers.",
          source: "learngitbranching.js.org"
        }
      ],
      javascript: [
        {
          title: "JavaScript - MDN Web Docs",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          description: "JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.",
          source: "Mozilla Developer Network"
        },
        {
          title: "JavaScript.info",
          url: "https://javascript.info/",
          description: "The Modern JavaScript Tutorial: simple, but detailed explanations with examples and tasks.",
          source: "JavaScript.info"
        }
      ],
      react: [
        {
          title: "React – A JavaScript library for building user interfaces",
          url: "https://reactjs.org/",
          description: "React makes it painless to create interactive UIs. Design simple views for each state in your application.",
          source: "reactjs.org"
        },
        {
          title: "Getting Started with React",
          url: "https://reactjs.org/docs/getting-started.html",
          description: "This page is an overview of the React documentation and related resources.",
          source: "React Docs"
        }
      ]
    };
    
    // Normalize the query
    const normalizedQuery = query.toLowerCase();
    
    // Check if the query contains any of our prepared topics
    for (const [topic, refs] of Object.entries(topics)) {
      if (normalizedQuery.includes(topic)) {
        return refs;
      }
    }
    
    // For queries we don't have prepared responses for, generate some generic ones
    return [
      {
        title: `${query} - Overview and Introduction`,
        url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
        description: `Learn about ${query} - history, concepts, and practical applications.`,
        source: "Wikipedia"
      },
      {
        title: `Understanding ${query} - A Comprehensive Guide`,
        url: `https://www.example.com/guides/${query.replace(/\s+/g, '-').toLowerCase()}`,
        description: `This comprehensive guide explains ${query} in detail with examples and best practices.`,
        source: "Example Learning Platform"
      },
      {
        title: `${query} Tutorial for Beginners`,
        url: `https://www.tutorialspoint.com/${query.replace(/\s+/g, '_').toLowerCase()}/index.htm`,
        description: `A step-by-step tutorial on ${query} for beginners with practical examples and exercises.`,
        source: "TutorialsPoint"
      }
    ];
  } catch (error) {
    console.error('Error fetching web references:', error);
    return [];
  }
}

export async function saveChatHistory(userId: string, messages: any[]) {
  try {
    if (!userId || !messages || messages.length === 0) {
      console.warn('Invalid data for saving chat history');
      return null;
    }

    // Extract the first user message as the title (or use a default)
    const userMessages = messages.filter(m => !m.isBot);
    const title = userMessages.length > 0 
      ? userMessages[0].text.substring(0, 30) + (userMessages[0].text.length > 30 ? '...' : '')
      : 'New conversation';
    
    // Check if the title column exists
    const { error: schemaError } = await supabase
      .from('user_chats')
      .select('id')
      .limit(1);
    
    // If there's an error about the title column, insert without it
    if (schemaError && schemaError.message.includes('title')) {
      const { data, error } = await supabase
        .from('user_chats')
        .insert([
          {
            user_id: userId,
            messages: messages,
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      return data;
    } else {
      // If no error, proceed with title
      const { data, error } = await supabase
        .from('user_chats')
        .insert([
          {
            user_id: userId,
            messages: messages,
            title: title,
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving chat history:', error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
}

export async function getChatHistory(userId: string) {
  try {
    if (!userId) {
      console.warn('No user ID provided for fetching chat history');
      return [];
    }

    // First try with title column
    try {
      const { data, error } = await supabase
        .from('user_chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      
      // Transform the data to match the expected format
      return data.map(chat => ({
        id: chat.id,
        title: chat.title || 'Untitled Chat',
        timestamp: chat.created_at,
        messages: chat.messages || []
      }));
    } catch (titleError) {
      // If error is about title column, try without it
      if (titleError.message && titleError.message.includes('title')) {
        const { data, error } = await supabase
          .from('user_chats')
          .select('id, user_id, messages, created_at, updated_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) throw error;
        
        // Transform the data and add default title
        return data.map(chat => {
          // Try to extract title from first user message
          let title = 'Untitled Chat';
          if (chat.messages && Array.isArray(chat.messages) && chat.messages.length > 0) {
            const userMessages = chat.messages.filter((m: any) => !m.isBot);
            if (userMessages.length > 0) {
              title = userMessages[0].text.substring(0, 30) + 
                (userMessages[0].text.length > 30 ? '...' : '');
            }
          }
          
          return {
            id: chat.id,
            title: title,
            timestamp: chat.created_at,
            messages: chat.messages || []
          };
        });
      } else {
        throw titleError;
      }
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
}

export async function updateChatHistory(chatId: string, messages: any[], title?: string) {
  try {
    if (!chatId || !messages) {
      console.warn('Invalid data for updating chat history');
      return null;
    }

    const updateData: any = {
      messages: messages,
      updated_at: new Date().toISOString()
    };

    // Check if the title column exists
    const { error: schemaError } = await supabase
      .from('user_chats')
      .select('id, title')
      .eq('id', chatId)
      .limit(1);
    
    // If there's an error about the title column, update without it
    if (schemaError && schemaError.message.includes('title')) {
      const { data, error } = await supabase
        .from('user_chats')
        .update({
          messages: messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);
      
      if (error) throw error;
      return data;
    } else {
      // If title is provided and no error, include it
      if (title) {
        updateData.title = title;
      }
      
      const { data, error } = await supabase
        .from('user_chats')
        .update(updateData)
        .eq('id', chatId);

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating chat history:', error);
    return null;
  }
}

export async function deleteChat(chatId: string) {
  try {
    if (!chatId) {
      console.warn('No chat ID provided for deletion');
      return false;
    }

    const { error } = await supabase
      .from('user_chats')
      .delete()
      .eq('id', chatId);
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
}