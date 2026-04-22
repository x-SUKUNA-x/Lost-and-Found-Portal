interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search items...",
}: SearchBarProps) => {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent w-64 transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
