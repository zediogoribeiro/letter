import { createFileRoute } from '@tanstack/react-router'

import { useTheme } from '../hooks/use-theme'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="p-8">
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-md border px-3 py-1 text-sm mb-10"
      >
        Toggle theme (current: {theme})
      </button>
      <h1 className="text-4xl font-bold ">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg ">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
