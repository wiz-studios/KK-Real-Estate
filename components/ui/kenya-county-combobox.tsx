'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { kenyaCounties } from '@/lib/kenya-counties'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface KenyaCountyComboboxProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  tone?: 'dark' | 'light'
}

export function KenyaCountyCombobox({
  value,
  onValueChange,
  placeholder = 'Search county',
  tone = 'dark',
}: KenyaCountyComboboxProps) {
  const [open, setOpen] = useState(false)

  const palette =
    tone === 'light'
      ? {
          trigger: 'border-gray-300 bg-white text-gray-900',
          placeholder: 'text-gray-500',
          icon: 'text-gray-500',
          content: 'border-gray-200 bg-white text-gray-900',
          input: 'border-gray-200 text-gray-900 placeholder:text-gray-400',
          item: 'text-gray-900 data-[selected=true]:bg-yellow-50 data-[selected=true]:text-yellow-900',
          check: 'text-yellow-700',
          empty: 'text-gray-500',
        }
      : {
          trigger: 'border-white/10 bg-white/[0.04] text-white',
          placeholder: 'text-white/35',
          icon: 'text-white/45',
          content: 'border-[#d9b15f]/18 bg-[#111111] text-white shadow-[0_24px_50px_rgba(0,0,0,0.55)]',
          input: 'border-white/10 text-white placeholder:text-white/35',
          item: 'text-white data-[selected=true]:bg-[#d9b15f]/12 data-[selected=true]:text-[#f2dca3]',
          check: 'text-[#d9b15f]',
          empty: 'text-white/50',
        }

  const selectedCounty = useMemo(
    () => kenyaCounties.find((county) => county.toLowerCase() === value.toLowerCase()),
    [value],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-[50px] w-full items-center justify-between rounded-2xl border px-4 text-sm transition-colors focus:outline-none',
            palette.trigger,
          )}
        >
          <span className={selectedCounty ? '' : palette.placeholder}>{selectedCounty || placeholder}</span>
          <ChevronsUpDown className={cn('h-4 w-4 shrink-0', palette.icon)} />
        </button>
      </PopoverTrigger>

      <PopoverContent className={cn('w-[var(--radix-popover-trigger-width)] p-0', palette.content)} align="start">
        <Command className="bg-transparent text-inherit">
          <CommandInput placeholder="Search county..." className={palette.input} />
          <CommandList>
            <CommandEmpty className={palette.empty}>No county found.</CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  value="Clear county"
                  onSelect={() => {
                    onValueChange('')
                    setOpen(false)
                  }}
                  className={palette.item}
                >
                  Clear selection
                </CommandItem>
              )}
              {kenyaCounties.map((county) => (
                <CommandItem
                  key={county}
                  value={county}
                  onSelect={() => {
                    onValueChange(county)
                    setOpen(false)
                  }}
                  className={palette.item}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.toLowerCase() === county.toLowerCase() ? 'opacity-100' : 'opacity-0',
                      palette.check,
                    )}
                  />
                  {county}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
