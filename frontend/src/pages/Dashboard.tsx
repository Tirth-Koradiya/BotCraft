import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Heart, Brain, Sparkles, SendHorizonal, Plus, Menu, History, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile, useIsSmallDesktop } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import MessageBubble from "@/components/ui/MessageBubble";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type BotType = "coding" | "healthcare" | "learning" | "creative";

type Conversation = {
  id: string;
  title: string;
  botType: BotType;
  updatedAt: Date;
  messages: Message[];
};

const botInfo = {
  coding: {
    name: "CodeBot",
    icon: <Code />,
    color: "bg-blue-500",
    description: "Your coding assistant for debugging and development",
  },
  healthcare: {
    name: "HealthBot",
    icon: <Heart />,
    color: "bg-red-500",
    description: "General health information and wellness tips",
  },
  learning: {
    name: "EduBot",
    icon: <Brain />,
    color: "bg-violet-500",
    description: "Your learning companion for various subjects",
  },
  creative: {
    name: "CreativeBot",
    icon: <Sparkles />,
    color: "bg-amber-500",
    description: "Inspiration for your creative projects",
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeBot, setActiveBot] = useState<BotType>("coding");
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [botSelectorOpen, setBotSelectorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const isSmallDesktop = useIsSmallDesktop();
 
  
  
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get("http://127.0.0.1:8000/chatbot/history", {
          params: { user_id: user.id },
        });
        const restoredConversations = response.data.map((conv) => ({
          ...conv,
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })).filter((conv) => {
          return conv.messages.length > 1 || (
            conv.messages.length === 1 && conv.messages[0].sender === "user"
          );
        });
        const deduped = new Map();
        restoredConversations.forEach(conv => {
          const key = `${conv.title}-${conv.updatedAt.getTime()}`;
          if (!deduped.has(key)) {
            deduped.set(key, conv);
          }
        });
        const uniqueConversations = Array.from(deduped.values());
        setConversations(uniqueConversations);
        if (uniqueConversations.length > 0) {
          setActiveConversation(uniqueConversations[0]);
          setActiveBot(uniqueConversations[0].botType);
        } else {
          const newConversation = createNewConversation(activeBot);
          setConversations([newConversation]);
          setActiveConversation(newConversation);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchChatHistory();
  }, [user?.id]);
  
  
  const createNewConversation = (botType: BotType): Conversation => {
    return {
      id: Date.now().toString(),
      title: `New ${botInfo[botType].name} Chat`,
      botType,
      updatedAt: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          content: "Hi! How can I assist you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ],
    };
  };

  
  const handleNewChat = (botType: BotType = activeBot) => {
    const newConversation = createNewConversation(botType);
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setActiveBot(botType);
    setSidebarOpen(false);
    setBotSelectorOpen(false);
  };
  


  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setActiveBot(conversation.botType);
    setSidebarOpen(false);
  };


  const handleSendMessage = async () => {
    if (input.trim() === "" || !activeConversation) return;
  
    // Create a user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
  
    // Update the conversation immediately to display the user's message
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
      updatedAt: new Date(),
    };
  
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );
    setActiveConversation(updatedConversation);
    setInput("");
  
    // Send the user input to the backend
    try {
      const response = await axios.post("http://127.0.0.1:8000/chatbot/ask", {
        user_input: userMessage.content,
        bot_type: activeBot,
        user_id: user?.id, 
        conversation_id: activeConversation?.id, 
      });
      
      // Get the generated answer from the backend response
      const generatedText = response.data.bot_response;
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generatedText,
        sender: "bot",
        timestamp: new Date(),
      };
  
      // Update the conversation with the bot message
      const updatedWithBotMessage = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botMessage],
        updatedAt: new Date(),
      };
  
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id ? updatedWithBotMessage : conv
        )
      );
      setActiveConversation(updatedWithBotMessage);
    } catch (error) {
      console.error("Error sending chat message:", error);
      // Optionally display an error toast or message to the user
    }
  };

  const handleDeleteConversation = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  
  

  const handleChangeBotType = (value: string) => {
    setActiveBot(value as BotType);
    handleNewChat(value as BotType);
  };

  const confirmDeleteConversation = async () => {
    if (!conversationToDelete || !user?.id) return;
  
    try {
      await axios.delete("http://127.0.0.1:8000/chatbot/delete", {
        params: {
          user_id: user.id,
          conversation_id: conversationToDelete,
        },
      });
  
      const updatedConversations = conversations.filter(
        (conv) => conv.id !== conversationToDelete
      );
      setConversations(updatedConversations);
  
      if (activeConversation?.id === conversationToDelete) {
        if (updatedConversations.length > 0) {
          setActiveConversation(updatedConversations[0]);
          setActiveBot(updatedConversations[0].botType);
        } else {
          const newConversation = createNewConversation(activeBot);
          setConversations([newConversation]);
          setActiveConversation(newConversation);
        }
      }
  
      toast({
        title: "Conversation deleted",
        description: "The conversation has been deleted from your account.",
      });
    } catch (err) {
      console.error("Error deleting chat:", err);
      toast({
        title: "Error",
        description: "Failed to delete the conversation.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };
  
  

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground mb-8">Choose a chatbot to start your conversation</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {(isMobile || isSmallDesktop) && (
          <div className="mb-4 flex justify-between items-center">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>Conversation History</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="pt-6">
                  <h3 className="font-semibold mb-4">Conversation History</h3>
                  <Button className="w-full flex items-center gap-2 mb-4" onClick={() => handleNewChat()}>
                    <Plus className="h-4 w-4" />
                    <span>New Chat</span>
                  </Button>
                  <div className="space-y-2">
                    {conversations.map(conv => (
                      <Button 
                        key={conv.id}
                        variant={activeConversation?.id === conv.id ? "default" : "ghost"} 
                        className="w-full justify-start text-left"
                        onClick={() => handleSelectConversation(conv)}
                      >
                        <div className={`p-1 rounded-full mr-2 ${botInfo[conv.botType].color}`}>
                          {botInfo[conv.botType].icon}
                        </div>
                        <div className="flex-grow truncate">
                          <p className="font-medium truncate">{conv.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {conv.updatedAt.toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${botInfo[activeBot].color}`}>
                    {botInfo[activeBot].icon}
                  </div>
                  <span>Change Bot</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {(Object.keys(botInfo) as BotType[]).map((botType) => (
                  <DropdownMenuItem
                    key={botType}
                    className="cursor-pointer p-2"
                    onClick={() => {
                      setActiveBot(botType);
                      handleNewChat(botType);
                    }}
                  >
                    <div className={`p-1 rounded-full mr-2 ${botInfo[botType].color}`}>
                      {botInfo[botType].icon}
                    </div>
                    <div>
                      <p className="font-medium">{botInfo[botType].name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {botInfo[botType].description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="col-span-1 lg:col-span-3 space-y-6 hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle>Start a New Chat</CardTitle>
              <CardDescription>Choose your specialized assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full mb-2 flex items-center gap-2" onClick={() => handleNewChat(activeBot)}>
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </Button>
              {(Object.keys(botInfo) as BotType[]).map((botType) => (
                <Button
                key={botType}
                variant={activeBot === botType ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => {
                  setActiveBot(botType);
                  handleNewChat(botType);
                }}
              >
                <div className={`p-2 rounded-full mr-3 ${botInfo[botType].color}`}>
                  {botInfo[botType].icon}
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="font-medium">{botInfo[botType].name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[calc(100%-3rem)]">
                    {botInfo[botType].description}
                  </p>
                </div>
              </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>Your recent chat sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-2 pr-4">
                  {conversations.map(conv => (
                    <Button 
                      key={conv.id}
                      variant={activeConversation?.id === conv.id ? "default" : "ghost"}
                      className="w-full justify-start text-left relative group"
                      onClick={() => handleSelectConversation(conv)}
                    >
                      <div className={`p-1 rounded-full mr-2 ${botInfo[conv.botType].color}`}>
                        {botInfo[conv.botType].icon}
                      </div>
                      <div className="flex-grow truncate">
                        <p className="font-medium truncate">{conv.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {conv.updatedAt.toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 absolute right-2 text-muted-foreground hover:text-destructive transition-opacity"
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-9">
          <Card className="h-[80vh] flex flex-col">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${botInfo[activeBot].color}`}>
                    {botInfo[activeBot].icon}
                  </div>
                  <div>
                    <CardTitle>{botInfo[activeBot].name}</CardTitle>
                    <CardDescription className="hidden sm:block">{botInfo[activeBot].description}</CardDescription>
                  </div>
                </div>
                
                {(isMobile || isSmallDesktop) && (
                  <Select value={activeBot} onValueChange={handleChangeBotType}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select bot" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(botInfo) as BotType[]).map((botType) => (
                        <SelectItem key={botType} value={botType}>
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${botInfo[botType].color}`}>
                              {botInfo[botType].icon}
                            </div>
                            <span>{botInfo[botType].name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                {activeConversation && activeConversation.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className={`p-4 rounded-full ${botInfo[activeBot].color} mb-4`}>
                      {botInfo[activeBot].icon}
                    </div>
                    <h3 className="text-xl font-semibold">
                      Welcome to {botInfo[activeBot].name}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      {botInfo[activeBot].description}. Ask any question to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeConversation && activeConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.sender === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className="bg-primary text-white text-xs">
                                {user?.name ? 
                                  user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase() 
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className={`text-white text-xs ${botInfo[activeBot].color}`}>
                                {botInfo[activeBot].name[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                           <MessageBubble content={message.content} sender={message.sender} />

                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder={`Message ${botInfo[activeBot].name}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <SendHorizonal className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConversation} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
