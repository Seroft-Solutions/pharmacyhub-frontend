import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchFilters } from '../model/types'

interface ExamFiltersProps {
  filters: SearchFilters
  onFilterChange: (filters: SearchFilters) => void
  className?: string
}

export const ExamFilters = ({ filters, onFilterChange, className }: ExamFiltersProps) => {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search papers..." 
          className="pl-10 w-[250px]"
          value={filters.query}
          onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
        />
      </div>
      <Select 
        value={filters.difficulty} 
        onValueChange={(value) => onFilterChange({ ...filters, difficulty: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Difficulties</SelectItem>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
