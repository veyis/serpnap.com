export default function ToolsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-foreground" />
        <p className="text-sm text-muted-foreground">Loading tool...</p>
      </div>
    </div>
  );
}
