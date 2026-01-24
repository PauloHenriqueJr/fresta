import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    placeholder?: string
}

export function DatePicker({ date, setDate, placeholder = "Selecione uma data" }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full pl-6 pr-4 py-7 rounded-2xl text-left font-bold text-lg border-2 transition-all hover:bg-solidroad-accent/5 hover:border-solidroad-accent/30",
                        !date && "text-muted-foreground font-normal",
                        date
                            ? "border-solidroad-accent/50 bg-solidroad-accent/10 text-foreground"
                            : "border-border/10 bg-background dark:bg-white/5 text-foreground"
                    )}
                >
                    {date ? (
                        format(date, "PPP", { locale: ptBR })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <CalendarIcon className={cn("ml-auto h-5 w-5 opacity-50", date && "text-solidroad-accent opacity-100 shadow-glow")} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-[2.5rem] border-0 shadow-2xl overflow-hidden" align="start">
                <div className="bg-card border border-border/10 p-4 transition-colors">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                        className="rounded-xl"
                        classNames={{
                            day_selected: "bg-solidroad-accent text-solidroad-text hover:bg-solidroad-accent hover:text-solidroad-text focus:bg-solidroad-accent focus:text-solidroad-text font-black rounded-xl shadow-glow",
                            day_today: "bg-solidroad-accent/10 text-solidroad-accent font-black rounded-xl",
                            day: "h-10 w-10 p-0 font-bold aria-selected:opacity-100 hover:bg-solidroad-accent/20 rounded-xl transition-all text-foreground",
                            head_cell: "text-muted-foreground/60 rounded-md w-10 font-black text-xs uppercase tracking-widest pb-4",
                            caption: "flex justify-center pt-2 pb-6 relative items-center",
                            caption_label: "text-lg font-black text-foreground capitalize",
                            nav_button: "h-10 w-10 bg-muted/50 dark:bg-white/5 p-0 opacity-80 hover:opacity-100 hover:bg-solidroad-accent/10 rounded-2xl transition-all text-foreground",
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
