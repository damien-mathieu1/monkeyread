export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 animate-in flex-col duration-125 fade-in">{children}</div>;
}
