interface HoverCaratProps {
  isCollapsed: boolean;
}

export const HoverCarat = ({ isCollapsed }: HoverCaratProps) => {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      {isCollapsed ? "▶" : "▼"}
    </div>
  );
};

interface ISectionTitleProps {
  children: React.ReactNode;
  onClick: () => void;
}
export const SectionTitle = ({ children, onClick }: ISectionTitleProps) => {
  return (
    <div
      className="cursor-pointer text-[#666] text-sm w-fit hover:bg-slate-300 flex group gap-1 items-center"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
