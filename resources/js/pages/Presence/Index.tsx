import React, { useState } from 'react'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import { Head, Link } from '@inertiajs/react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PresenceIndex() {
  const [location, setLocation] = useState<{ lat?: number, lng?: number }>({})
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [notes, setNotes] = useState('')

  function fetchLocation() {
    setLoading(true)
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      setLoading(false)
    }, () => setLoading(false))
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0])
  }

  function submit() {
    if (!image) { alert('Harap upload bukti foto'); return }
    alert('Submitted (mock) — lokasi: ' + JSON.stringify(location))
  }

  const last7 = [
    { date: '2026-01-28', status: 'Check-in', notes: 'On time' },
    { date: '2026-01-27', status: 'Check-in', notes: 'On time' },
  ]

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Presensi', href: '/presences' },
  ];

  return (
    <AppSidebarLayout breadcrumbs={breadcrumbs}>
      <Head title="Presensi" />
      <div className="p-6 md:p-10">
        <PageHeader title="Presensi" description="Lakukan check-in harian" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded">
            <div className="mb-3">Lokasi: {loading ? 'fetching...' : (location.lat ? `${location.lat.toFixed(4)}, ${location.lng?.toFixed(4)}` : '—')}</div>
            <div className="mb-3"><Button onClick={fetchLocation}>Ambil Lokasi</Button></div>
            <div className="mb-3">
              <input type="file" accept="image/*" onChange={onFile} />
            </div>
            <div className="mb-3"><Input placeholder="Catatan (opsional)" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <div className="flex justify-end"><Button onClick={submit}>Check-in</Button></div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Riwayat 7 hari terakhir</h4>
            <ul className="space-y-2">
              {last7.map((l) => (
                <li key={l.date} className="p-3 border rounded">
                  <div className="text-sm">{l.date}</div>
                  <div className="text-sm text-muted-foreground">{l.status} — {l.notes}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  )
}
