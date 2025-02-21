import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings2 } from 'lucide-react';

interface ExamSettingsProps {
    showExplanations: boolean;
    autoAdvance: boolean;
    highlightSelected: boolean;
    onSettingChange: (setting: string, value: boolean) => void;
    theme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
}

export const ExamSettings = ({
    showExplanations,
    autoAdvance,
    highlightSelected,
    onSettingChange,
    theme,
    onThemeChange,
}: ExamSettingsProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings2 className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Exam Settings</DialogTitle>
                    <DialogDescription>
                        Customize your exam experience
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Display Settings */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Display</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="theme">Theme</Label>
                            <Select
                                value={theme}
                                onValueChange={value => 
                                    onThemeChange(value as 'light' | 'dark')
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="highlight">
                                Highlight selected options
                            </Label>
                            <Switch
                                id="highlight"
                                checked={highlightSelected}
                                onCheckedChange={checked => 
                                    onSettingChange('highlightSelected', checked)
                                }
                            />
                        </div>
                    </div>

                    {/* Behavior Settings */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Behavior</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="explanations">
                                Show explanations after answering
                            </Label>
                            <Switch
                                id="explanations"
                                checked={showExplanations}
                                onCheckedChange={checked => 
                                    onSettingChange('showExplanations', checked)
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="advance">
                                Auto-advance to next question
                            </Label>
                            <Switch
                                id="advance"
                                checked={autoAdvance}
                                onCheckedChange={checked => 
                                    onSettingChange('autoAdvance', checked)
                                }
                            />
                        </div>
                    </div>

                    {/* Accessibility Note */}
                    <div className="text-sm text-muted-foreground">
                        These settings will be saved for your next exam sessions.
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};