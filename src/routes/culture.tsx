import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/culture')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/culture"!</div>
}
