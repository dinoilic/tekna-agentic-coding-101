import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Tekna Agentic Coding 101
      </h1>
      <p className="text-lg text-muted-foreground">
        Edit <code className="rounded bg-muted px-2 py-1 font-mono text-sm">src/App.tsx</code> to get started
      </p>
      <Button>Get Started</Button>
    </div>
  )
}

export default App
