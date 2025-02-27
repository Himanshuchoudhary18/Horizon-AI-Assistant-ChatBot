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
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "I apologize, but I'm having trouble connecting to the AI service. Please try again later.";
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