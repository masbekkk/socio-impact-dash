import React from 'react'
import AppShell from '@/layouts/AppShell'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import StatusBadge from '@/components/StatusBadge'
import TimelineList from '@/components/TimelineList'
import BudgetEditor from '@/components/BudgetEditor'
import FileUploadDropzone from '@/components/FileUploadDropzone'
import { Button } from '@/components/ui/button'

export default function ProjectsShow({ params }: any) {
  const mock = {
    code: 'PRJ-001', name: 'Proyek A', client: 'Klien 1', status: 'active', budget: 10000000,
    timeline: [ { id: 'm1', title: 'Kickoff', date: '2026-01-10', status: 'done' }, { id: 'm2', title: 'Delivery', date: '2026-06-30', status: 'planned' } ],
    budgetRows: [{ id: '1', label: 'Jasa', planned: 7000000, actual: 3000000 }]
  }

  return (
    <AppShell>
      <PageHeader title={`${mock.code} — ${mock.name}`} description={`Client: ${mock.client}`} actions={<div><StatusBadge status={mock.status} /> <Button className="ml-2">Mark as Finished</Button></div>} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="documents">Dokumen</TabsTrigger>
          <TabsTrigger value="issues">Isu</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <h4 className="font-semibold">Ringkasan</h4>
              <p className="text-sm text-muted-foreground">Ringkasan proyek dan status saat ini</p>
            </div>
            <div className="p-4 border rounded">Anggaran terpakai: Rp {mock.budget.toLocaleString()}</div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineList items={mock.timeline} />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetEditor initial={mock.budgetRows} />
        </TabsContent>

        <TabsContent value="documents">
          <FileUploadDropzone />
        </TabsContent>

        <TabsContent value="issues">
          <div>List issue / blocker (CRUD placeholder)</div>
        </TabsContent>

        <TabsContent value="activity">
          <div>Activity timeline</div>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}
