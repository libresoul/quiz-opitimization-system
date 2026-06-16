import DashboardShell from '@/components/dashboard-shell'
import DashboardSummary from '@/components/dashboard-summary'

export default function Dashboard() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Track quizzes, inspect question sets, and preview the optimal selection layout."
    >
      <DashboardSummary />
    </DashboardShell>
  )
}
