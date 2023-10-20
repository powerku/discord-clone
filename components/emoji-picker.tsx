"use client";

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Smile} from "lucide-react";
import React from "react";
import {useTheme} from "next-themes";
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"

interface EmojiPickerProps {
    onChange: (value: string) => void;
}


export const EmojiPicker = ({
   onChange
}: EmojiPickerProps) => {
    const { resolvedTheme } = useTheme();

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="text-zinc-500 dark:text-zinc-400
                hover:text-zinc-600 dark:hover:text-zinc-300
                transition"></Smile>
            </PopoverTrigger>
            <PopoverContent
                side="right"
                sideOffset={40}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker
                    theme={resolvedTheme}
                    data={data}
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                ></Picker>

            </PopoverContent>
        </Popover>
    )
}