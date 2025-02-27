export interface Message {
  id: string;
  text: string;
  timestamp: Date | string;
  isBot: boolean;
}