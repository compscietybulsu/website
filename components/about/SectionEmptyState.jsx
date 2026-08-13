export default function SectionEmptyState({ children }) {
  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-green-200/10 bg-[#0d2818] px-4 py-10 mt-8">
      <p className="text-center text-green-300/70 text-sm">{children}</p>
    </div>
  );
}
