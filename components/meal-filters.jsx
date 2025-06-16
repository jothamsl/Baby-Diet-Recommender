"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const commonAllergies = [
  { value: "dairy", label: "Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "nuts", label: "Nuts" },
  { value: "gluten", label: "Gluten" },
  { value: "soy", label: "Soy" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
]

export function MealFilters({ onFilterChange }) {
  const [open, setOpen] = useState(false)
  const [selectedAllergies, setSelectedAllergies] = useState([])

  const handleSelect = (currentValue) => {
    let newSelectedAllergies

    if (selectedAllergies.includes(currentValue)) {
      newSelectedAllergies = selectedAllergies.filter((value) => value !== currentValue)
    } else {
      newSelectedAllergies = [...selectedAllergies, currentValue]
    }

    setSelectedAllergies(newSelectedAllergies)
    onFilterChange(newSelectedAllergies)
  }

  const removeAllergy = (allergy) => {
    const newSelectedAllergies = selectedAllergies.filter((a) => a !== allergy)
    setSelectedAllergies(newSelectedAllergies)
    onFilterChange(newSelectedAllergies)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dietary Restrictions</label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
              Select allergies to exclude
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search allergies..." />
              <CommandList>
                <CommandEmpty>No allergy found.</CommandEmpty>
                <CommandGroup>
                  {commonAllergies.map((allergy) => (
                    <CommandItem key={allergy.value} value={allergy.value} onSelect={() => handleSelect(allergy.value)}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedAllergies.includes(allergy.value) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {allergy.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedAllergies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAllergies.map((allergy) => {
            const allergyItem = commonAllergies.find((a) => a.value === allergy)
            return (
              <Badge
                key={allergy}
                variant="secondary"
                className="px-2 py-1 cursor-pointer"
                onClick={() => removeAllergy(allergy)}
              >
                {allergyItem?.label}
                <span className="ml-1">×</span>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
