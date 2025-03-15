import OpenAI from 'openai';
import { supabase } from './supabase';
import { qaDataset } from '../data/chatData';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function findAnswerInDataset(question: string) {
  const normalizedQuestion = question.toLowerCase().trim();
  
  const exactMatch = qaDataset.find(
    qa => qa.question.toLowerCase() === normalizedQuestion
  );
  
  if (exactMatch) return exactMatch.answer;
  
  const partialMatches = qaDataset.filter(
    qa => qa.question.toLowerCase().includes(normalizedQuestion) ||
          normalizedQuestion.includes(qa.question.toLowerCase())
  );
  
  if (partialMatches.length > 0) {
    return partialMatches[0].answer;
  }
  
  return null;
}

export async function getChatResponse(message: string) {
  try {
    const datasetAnswer = findAnswerInDataset(message);
    
    if (datasetAnswer) {
      return datasetAnswer;
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 500
    });

    return completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "I apologize, but I'm having trouble processing your request. Please try again with a different question.";
  }
}

export async function getWebReferences(query: string) {
  try {
    const topics = {
      git: [
        {
          title: "Git Documentation",
          url: "https://git-scm.com/doc",
          description: "Official Git documentation with comprehensive guides and reference materials.",
          source: "git-scm.com"
        },
        {
          title: "GitHub Guides",
          url: "https://guides.github.com/",
          description: "Essential guides for using Git and GitHub effectively.",
          source: "GitHub"
        },
        {
          title: "Learn Git Branching",
          url: "https://learngitbranching.js.org/",
          description: "Interactive Git visualization tool for learning Git commands and workflows.",
          source: "learngitbranching.js.org"
        }
      ],
      javascript: [
        {
          title: "MDN JavaScript Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
          description: "Comprehensive guide to JavaScript for both beginners and advanced developers.",
          source: "Mozilla Developer Network"
        },
        {
          title: "JavaScript.info",
          url: "https://javascript.info/",
          description: "Modern JavaScript tutorial with detailed explanations and practical examples.",
          source: "JavaScript.info"
        },
        {
          title: "V8 JavaScript Engine Blog",
          url: "https://v8.dev/blog",
          description: "Technical articles about JavaScript and V8 engine internals.",
          source: "V8 Dev"
        }
      ],
      react: [
        {
          title: "React Documentation",
          url: "https://react.dev/",
          description: "Official React documentation with guides, API references, and best practices.",
          source: "React.dev"
        },
        {
          title: "React GitHub Repository",
          url: "https://github.com/facebook/react",
          description: "Official React source code and documentation on GitHub.",
          source: "GitHub"
        },
        {
          title: "React Blog",
          url: "https://react.dev/blog",
          description: "Official React blog with updates, releases, and technical articles.",
          source: "React Team"
        }
      ]
    };
    
    const normalizedQuery = query.toLowerCase();
    
    for (const [topic, refs] of Object.entries(topics)) {
      if (normalizedQuery.includes(topic)) {
        return refs;
      }
    }
    
    return [
      {
        title: `${query} - Documentation and Resources`,
        url: `https://devdocs.io/${query.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Comprehensive documentation and resources about ${query}.`,
        source: "DevDocs.io"
      },
      {
        title: `${query} - Stack Overflow`,
        url: `https://stackoverflow.com/questions/tagged/${query.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Community questions and answers about ${query}.`,
        source: "Stack Overflow"
      },
      {
        title: `${query} - GitHub Topics`,
        url: `https://github.com/topics/${query.replace(/\s+/g, '-').toLowerCase()}`,
        description: `Open source projects and resources related to ${query}.`,
        source: "GitHub"
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

    const userMessages = messages.filter(m => !m.isBot);
    const title = userMessages.length > 0 
      ? userMessages[0].text.substring(0, 30) + (userMessages[0].text.length > 30 ? '...' : '')
      : 'New conversation';

    const { data, error } = await supabase
      .from('user_chats')
      .insert([
        {
          user_id: userId,
          messages: messages,
          title: title,
          updated_at: new Date().toISOString(),
          archived: false
        }
      ])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat history:', error);
    return null;
  }
}

export async function getChatHistory(userId: string) {
  try {
    if (!userId) {
      console.warn('No user ID provided for fetching chat history');
      return [];
    }

    const { data, error } = await supabase
      .from('user_chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    
    return data.map(chat => ({
      id: chat.id,
      title: chat.title || 'Untitled Chat',
      timestamp: chat.created_at,
      messages: chat.messages || [],
      archived: chat.archived || false
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

export async function updateChatHistory(chatId: string, messages: any[], title?: string, archived?: boolean) {
  try {
    if (!chatId || !messages) {
      console.warn('Invalid data for updating chat history');
      return null;
    }

    const updateData: any = {
      messages: messages,
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) {
      updateData.title = title;
    }

    if (archived !== undefined) {
      updateData.archived = archived;
    }

    const { data, error } = await supabase
      .from('user_chats')
      .update(updateData)
      .eq('id', chatId)
      .select();

    if (error) throw error;
    return data;
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

    // First attempt to verify the chat exists
    const { data: existingChat, error: existingError } = await supabase
      .from('user_chats')
      .select('id')
      .eq('id', chatId)
      .single();

    if (existingError) {
      console.error('Error verifying chat existence:', existingError);
      return false;
    }

    if (!existingChat) {
      console.warn('Chat does not exist:', chatId);
      return true; // Already deleted
    }

    // Perform the deletion
    const { error: deleteError } = await supabase
      .from('user_chats')
      .delete()
      .eq('id', chatId);

    if (deleteError) {
      console.error('Error deleting chat:', deleteError);
      return false;
    }

    // Final verification
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_chats')
      .select('id')
      .eq('id', chatId)
      .maybeSingle();

    // If we get a "not found" error or no data, deletion was successful
    if ((verifyError && verifyError.code === 'PGRST116') || !verifyData) {
      return true;
    }

    console.error('Chat still exists after deletion attempt');
    return false;
  } catch (error) {
    console.error('Error in delete operation:', error);
    return false;
  }
}