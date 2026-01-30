'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertTriangle,
  Shield,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  Syringe,
  BookOpen,
  Loader2,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function InspectionPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [packet, setPacket] = useState<any>(null)
  const { toast } = useToast()

  const { data: practices } = trpc.practices.list.useQuery()
  const { data: checklist, isLoading: loadingChecklist } =
    trpc.inspection.getChecklist.useQuery(
      { practiceId: practices?.[0]?.id || '' },
      { enabled: !!practices?.[0]?.id }
    )

  const generatePacket = trpc.inspection.generatePacket.useMutation({
    onSuccess: (data) => {
      setPacket(data)
      setIsGenerating(false)
      toast({
        title: 'Inspection Packet Generated',
        description: 'Your compliance packet is ready for download.',
      })
    },
    onError: (error) => {
      setIsGenerating(false)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    },
  })

  function handleGeneratePacket() {
    if (!practices?.[0]?.id) return
    setIsGenerating(true)
    generatePacket.mutate({ practiceId: practices[0].id })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Inspection Mode</h1>
        <p className="text-muted-foreground">
          Prepare for OSHA inspections with comprehensive compliance documentation
        </p>
      </div>

      {/* Alert Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Inspector Here?
          </CardTitle>
          <CardDescription className="text-red-600">
            Generate a complete compliance packet with all required documentation
            for OSHA inspectors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <Shield className="mr-2 h-5 w-5" />
                Generate Inspection Packet
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Generate Inspection Packet?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will compile all compliance documentation including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Exposure Control Plan</li>
                    <li>Employee training records (last 3 years)</li>
                    <li>Vaccination records</li>
                    <li>Incident reports</li>
                    <li>Safety inspection logs</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleGeneratePacket}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Generate Packet
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Pre-Inspection Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Pre-Inspection Checklist
          </CardTitle>
          <CardDescription>
            Review and resolve these items before an inspection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingChecklist ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : checklist ? (
            <div className="space-y-4">
              {/* Status Summary */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    checklist.isReady
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {checklist.isReady ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {checklist.isReady
                      ? 'Ready for Inspection'
                      : `${checklist.criticalCount} Critical Issues`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {checklist.criticalCount} critical, {checklist.warningCount}{' '}
                    warnings
                  </p>
                </div>
              </div>

              {/* Checklist Items */}
              {checklist.items.length > 0 ? (
                <div className="space-y-2">
                  {checklist.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.severity === 'critical'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.severity === 'critical' ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          item.severity === 'critical' ? 'destructive' : 'warning'
                        }
                      >
                        {item.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-green-600">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">All items complete!</p>
                  <p className="text-sm text-muted-foreground">
                    Your practice is ready for inspection
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Unable to load checklist
            </p>
          )}
        </CardContent>
      </Card>

      {/* Generated Packet */}
      {isGenerating && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="font-medium">Generating Inspection Packet...</p>
              <p className="text-sm text-muted-foreground">
                Compiling all compliance documentation
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {packet && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Inspection Packet Ready
            </CardTitle>
            <CardDescription>
              Generated {formatDate(packet.generatedAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compliance Status */}
            {packet.complianceGaps.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-medium text-yellow-800 mb-2">
                  Compliance Gaps Detected
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {packet.complianceGaps.map((gap: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">
                  {packet.summary.totalEmployees}
                </p>
                <p className="text-xs text-muted-foreground">Employees</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">
                  {packet.summary.trainingCompleted}
                </p>
                <p className="text-xs text-muted-foreground">Trainings Complete</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Syringe className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">
                  {packet.summary.vaccinationsComplete}
                </p>
                <p className="text-xs text-muted-foreground">Hep B Documented</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{packet.summary.incidentCount}</p>
                <p className="text-xs text-muted-foreground">Incidents (3 yrs)</p>
              </div>
            </div>

            {/* Packet Contents */}
            <div>
              <p className="font-medium mb-3">Packet Contents</p>
              <div className="space-y-2">
                {[
                  {
                    icon: Shield,
                    title: 'Exposure Control Plan',
                    count: packet.data.documents.filter(
                      (d: any) => d.type === 'exposure_control_plan'
                    ).length,
                  },
                  {
                    icon: BookOpen,
                    title: 'Training Records',
                    count: packet.data.trainingRecords.length,
                  },
                  {
                    icon: Syringe,
                    title: 'Vaccination Records',
                    count: packet.data.vaccinationRecords.length,
                  },
                  {
                    icon: AlertTriangle,
                    title: 'Incident Reports',
                    count: packet.data.incidentReports.length,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.title}</span>
                    </div>
                    <Badge variant="secondary">{item.count} records</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <Button size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Download Complete Packet (PDF)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s Included in the Packet</CardTitle>
          <CardDescription>
            Everything an OSHA inspector typically requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Cover Sheet',
                description: 'Practice information and compliance status summary',
              },
              {
                title: 'Exposure Control Plan',
                description:
                  'Current ECP with all required sections and annual review date',
              },
              {
                title: 'Training Records',
                description:
                  'All employee training completions for the past 3 years',
              },
              {
                title: 'Vaccination Records',
                description:
                  'Hepatitis B vaccination status and declination forms',
              },
              {
                title: 'Incident Reports',
                description:
                  'Exposure incidents and sharps injuries from past 3 years',
              },
              {
                title: 'Safety Inspection Logs',
                description: 'Workplace safety inspection documentation',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
