import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TargetLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (targetLanguage: string) => void;
  languages: { code: string; name: string; flag: string }[];
  exclude: string;
}

const TargetLanguageModal = ({ isOpen, onClose, onSelect, languages, exclude }: TargetLanguageModalProps) => {
  const [selected, setSelected] = useState("");

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Which language do you want to learn?
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language to learn" />
            </SelectTrigger>
            <SelectContent>
              {languages.filter(l => l.code !== exclude).map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="mr-2">{lang.flag}</span>{lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleContinue} disabled={!selected} className="px-6 py-2">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TargetLanguageModal;
