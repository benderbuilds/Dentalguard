import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { CertificateDocument, type CertificateData } from '@/lib/pdf/certificate-template'
import React from 'react'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Authenticate via Supabase cookies
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch assignment with related data using admin client (bypasses RLS)
  const adminSupabase = createAdminClient()

  const { data: rawAssignment, error: assignmentError } = await adminSupabase
    .from('training_assignments')
    .select('*, training_modules(*), users(*, practices(*))')
    .eq('id', id)
    .single()

  if (assignmentError || !rawAssignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }

  const assignment = rawAssignment as any

  // Validate assignment is completed
  if (assignment.status !== 'completed') {
    return NextResponse.json(
      { error: 'Certificate is only available for completed training' },
      { status: 400 }
    )
  }

  // Check authorization: must be the assignee or an admin in the same org
  const assignee = assignment.users
  const { data: rawRequestingUser } = await adminSupabase
    .from('users')
    .select('role, organization_id, is_org_admin')
    .eq('id', user.id)
    .single()

  const requestingUser = rawRequestingUser as any

  const isAssignee = assignment.user_id === user.id
  const isOrgAdmin =
    requestingUser &&
    (requestingUser.role === 'admin' || requestingUser.is_org_admin === true) &&
    requestingUser.organization_id === assignee?.organization_id

  if (!isAssignee && !isOrgAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Build certificate data
  const trainingModule = assignment.training_modules
  const practice = assignee?.practices

  const completionDate = new Date(assignment.completed_at)
  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const signatureTimestamp = assignment.signature_timestamp
    ? new Date(assignment.signature_timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : formattedDate

  const certificateData: CertificateData = {
    certificateId: assignment.id,
    employeeName: assignee?.name || 'Employee',
    trainingTitle: trainingModule?.title || 'Training Module',
    trainingType: trainingModule?.type || 'osha',
    practiceName: practice?.name || 'Dental Practice',
    completionDate: formattedDate,
    score: assignment.score ?? 0,
    passingScore: trainingModule?.passing_score ?? 80,
    signatureName: assignment.signature_name || assignee?.name || '',
    signatureTimestamp,
  }

  // Render PDF
  const pdfBuffer = await renderToBuffer(
    React.createElement(CertificateDocument, { data: certificateData }) as any
  )

  // Return PDF response
  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="certificate-${assignment.id}.pdf"`,
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
