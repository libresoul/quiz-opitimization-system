import DashboardShell from '@/components/dashboard-shell'
import DashboardSummary from '@/components/dashboard-summary'

export default function Dashboard() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Track quizzes, attempt question sets"
    >
      <DashboardSummary />
    </DashboardShell>
  )
}
