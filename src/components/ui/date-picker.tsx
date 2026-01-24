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
                        date ? "border-solidroad-accent/50 bg-solidroad-accent/5 text-solidroad-text" : "border-border/10 bg-[#F9F9F9] dark:bg-black/20 text-solidroad-text dark:text-white"
                    )}
                >
                    {date ? (
                        format(date, "PPP", { locale: ptBR })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <CalendarIcon className={cn("ml-auto h-5 w-5 opacity-50", date && "text-solidroad-accent opacity-100")} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-3xl border-0 shadow-xl overflow-hidden" align="start">
                <div className="bg-white dark:bg-[#1C1A0E] border border-border/10 p-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                        className="rounded-xl"
                        classNames={{
                            day_selected: "bg-solidroad-accent text-solidroad-text hover:bg-solidroad-accent hover:text-solidroad-text focus:bg-solidroad-accent focus:text-solidroad-text font-bold rounded-xl",
                            day_today: "bg-solidroad-accent/10 text-solidroad-text font-bold rounded-xl",
                            day: "h-10 w-10 p-0 font-medium aria-selected:opacity-100 hover:bg-solidroad-accent/20 rounded-xl transition-colors",
                            head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] capitalize pb-2",
                            caption: "flex justify-center pt-2 pb-4 relative items-center",
                            caption_label: "text-base font-bold text-solidroad-text dark:text-white capitalize",
                            nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-solidroad-accent/10 rounded-xl transition-all",
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
