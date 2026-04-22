const Loader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" />
      <span className="text-body-sm text-on-surface-variant">{text}</span>
    </div>
  );
};

export default Loader;
