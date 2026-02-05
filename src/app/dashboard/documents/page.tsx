'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  MoreVertical,
  Sparkles,
  CheckCircle,
  Clock,
  Shield,
  Upload,
  FileEdit,
} from 'lucide-react'
import { formatDate, formatRelativeDate } from '@/lib/utils'

const documentTypes = [
  { value: 'exposure_control_plan', label: 'Exposure Control Plan', icon: Shield },
  { value: 'manual', label: 'Manual', icon: FileText },
  { value: 'form', label: 'Form', icon: FileText },
  { value: 'policy', label: 'Policy', icon: FileText },
]

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [showGenerateECP, setShowGenerateECP] = useState(false)
  const { toast } = useToast()

  const { data: documents, isLoading, refetch } = trpc.documents.list.useQuery({})
  const { data: practices } = trpc.practices.list.useQuery()

  const generateECP = trpc.documents.generateECP.useMutation({
    onSuccess: () => {
      toast({
        title: 'Exposure Control Plan Generated',
        description: 'Your ECP has been created based on your practice profile.',
      })
      setShowGenerateECP(false)
      refetch()
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    },
  })

  const filteredDocuments = documents?.filter(
    (doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase())
  )

  const ecpDocuments = filteredDocuments?.filter(
    (doc) => doc.type === 'exposure_control_plan'
  )
  const formDocuments = filteredDocuments?.filter((doc) => doc.type === 'form')
  const policyDocuments = filteredDocuments?.filter(
    (doc) => doc.type === 'policy' || doc.type === 'manual'
  )

  const hasECP = ecpDocuments && ecpDocuments.length > 0

  function handleGenerateECP() {
    if (!practices?.[0]) return

    const practice = practices[0]
    generateECP.mutate({
      practiceId: practice.id,
      practiceInfo: {
        name: practice.name,
        address: `${practice.address_line1 || ''}, ${practice.city || ''}, ${practice.state} ${practice.zip_code || ''}`,
        state: practice.state,
        servicesOffered: ['General Dentistry', 'Cleanings', 'Fillings', 'Extractions'],
        employeeCount: 10,
        hasOralSurgery: false,
        hasOrtho: false,
        equipmentUsed: ['Dental handpieces', 'Ultrasonic scalers', 'X-ray equipment'],
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Compliance documents, forms, and policies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: 'Coming Soon',
                description: 'Document upload will be available in the next update.',
              })
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          {!hasECP && (
            <Button onClick={() => setShowGenerateECP(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate ECP
            </Button>
          )}
        </div>
      </div>

      {/* Alert if no ECP */}
      {!hasECP && !isLoading && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Shield className="h-5 w-5" />
              Missing Exposure Control Plan
            </CardTitle>
            <CardDescription className="text-yellow-700">
              An Exposure Control Plan is required by OSHA. Generate one now based
              on your practice profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowGenerateECP(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Exposure Control Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="ecp">Exposure Control Plan</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="policies">Policies & Manuals</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DocumentGrid
            documents={filteredDocuments || []}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="ecp">
          <DocumentGrid
            documents={ecpDocuments || []}
            isLoading={isLoading}
            emptyMessage="No Exposure Control Plan found. Generate one to get started."
          />
        </TabsContent>

        <TabsContent value="forms">
          <DocumentGrid
            documents={formDocuments || []}
            isLoading={isLoading}
            emptyMessage="No forms found."
          />
        </TabsContent>

        <TabsContent value="policies">
          <DocumentGrid
            documents={policyDocuments || []}
            isLoading={isLoading}
            emptyMessage="No policies or manuals found."
          />
        </TabsContent>
      </Tabs>

      {/* Pre-built Forms Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-built Compliance Forms</CardTitle>
          <CardDescription>
            Download and use these standard compliance forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Hepatitis B Vaccination Record',
                description: 'Track employee Hep B vaccination status',
              },
              {
                title: 'Hepatitis B Declination Form',
                description: 'For employees declining vaccination',
              },
              {
                title: 'Exposure Incident Report',
                description: 'Document bloodborne pathogen exposures',
              },
              {
                title: 'Sharps Injury Log',
                description: 'OSHA-required sharps injury tracking',
              },
              {
                title: 'Safety Inspection Checklist',
                description: 'Monthly workplace safety inspection',
              },
              {
                title: 'Training Sign-In Sheet',
                description: 'Document training attendance',
              },
            ].map((form) => (
              <Card key={form.title} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {form.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {form.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        toast({
                          title: 'Coming Soon',
                          description: 'Form filling will be available in the next update.',
                        })
                      }}
                    >
                      <FileEdit className="mr-2 h-3 w-3" />
                      Fill Out
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: 'Coming Soon',
                          description: 'PDF download will be available in the next update.',
                        })
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate ECP Dialog */}
      <Dialog open={showGenerateECP} onOpenChange={setShowGenerateECP}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Exposure Control Plan</DialogTitle>
            <DialogDescription>
              We&apos;ll create a customized Exposure Control Plan based on your
              practice profile. This document is required by OSHA.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Practice-specific content</p>
                <p className="text-sm text-muted-foreground">
                  Customized for your services and employee count
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">State-compliant</p>
                <p className="text-sm text-muted-foreground">
                  Includes requirements for your state
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Annual review reminders</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll remind you when it&apos;s time to review
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateECP(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateECP} disabled={generateECP.isPending}>
              {generateECP.isPending ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate ECP
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DocumentGrid({
  documents,
  isLoading,
  emptyMessage = 'No documents found.',
}: {
  documents: any[]
  isLoading: boolean
  emptyMessage?: string
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading documents...
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {doc.type === 'exposure_control_plan' ? (
                  <Shield className="h-5 w-5 text-primary" />
                ) : (
                  <FileText className="h-5 w-5 text-muted-foreground" />
                )}
                <CardTitle className="text-sm line-clamp-1">{doc.title}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {doc.description && (
              <CardDescription className="line-clamp-2">
                {doc.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {formatRelativeDate(doc.updated_at)}
              </div>
              <Badge variant="secondary" className="text-xs">
                v{doc.version}
              </Badge>
            </div>
            {doc.is_auto_generated && (
              <Badge variant="outline" className="mt-2 text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Generated
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
