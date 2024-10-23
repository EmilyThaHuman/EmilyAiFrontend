import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Code, Maximize2, Minimize2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export default function ChatHeader({ title, onTitleChange }: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  
  const handleTitleSubmit = () => {
    onTitleChange(newTitle);
    setIsEditing(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1">
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTitleSubmit();
            }}
            className="flex-1 max-w-md"
          >
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
            />
          </form>
        ) : (
          <h2
            className="text-lg font-semibold cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Default Chat</DropdownMenuItem>
            <DropdownMenuItem>Code Assistant</DropdownMenuItem>
            <DropdownMenuItem>Writing Helper</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowCodeDialog(true)}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Conversation Code</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto">
              <code>{`# Conversation History

User: Hello
Assistant: Hi there! How can I help you today?

User: What's the weather like?
Assistant: I don't have access to real-time weather data. You might want to check a weather service or app for accurate information.`}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}