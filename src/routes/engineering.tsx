import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/engineering')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/engineering"!</div>
}
