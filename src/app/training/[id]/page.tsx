'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Download,
} from 'lucide-react'

type Section = {
  id: string
  type: 'text' | 'video' | 'scenario'
  title: string
  content?: string
  url?: string
  prompt?: string
  options?: string[]
  correct?: number
  explanation?: string
}

type Quiz = {
  questions: Array<{
    id: string
    question: string
    options: string[]
    correct: number
  }>
}

export default function TrainingModulePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()

  const [currentSection, setCurrentSection] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [signatureConfirmed, setSignatureConfirmed] = useState(false)
  const [score, setScore] = useState(0)

  const { data: assignment, isLoading } = trpc.training.getAssignment.useQuery({ id })

  const startTraining = trpc.training.startTraining.useMutation()
  const updateProgress = trpc.training.updateProgress.useMutation()
  const submitQuiz = trpc.training.submitQuiz.useMutation({
    onSuccess: (data) => {
      setScore(data.score)
      setQuizPassed(data.passed)
      setShowResults(true)
      if (data.passed) {
        toast({
          title: 'Congratulations!',
          description: 'You passed the quiz and completed the training.',
        })
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading training module...</p>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Training not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const trainingModule = assignment.training_modules
  const content = trainingModule?.content_json as { sections?: Section[]; quiz?: Quiz }
  const sections = content?.sections || []
  const quiz = content?.quiz

  const totalSteps = sections.length + (quiz ? 1 : 0) + 1 // sections + quiz + signature
  const currentStep = showResults
    ? totalSteps
    : showQuiz
    ? sections.length + 1
    : currentSection + 1

  const progressPercent = (currentStep / totalSteps) * 100

  function handleStartTraining() {
    startTraining.mutate({ assignmentId: id })
  }

  function handleNextSection() {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      updateProgress.mutate({
        assignmentId: id,
        progress: { currentSection: currentSection + 1 },
      })
    } else if (quiz) {
      setShowQuiz(true)
    }
  }

  function handlePrevSection() {
    if (showQuiz) {
      setShowQuiz(false)
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  function handleQuizAnswer(questionId: string, answerIndex: number) {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex })
  }

  function handleSubmitQuiz() {
    if (!signatureName || !signatureConfirmed) {
      toast({
        variant: 'destructive',
        title: 'Signature required',
        description: 'Please type your name and confirm to complete the training.',
      })
      return
    }

    submitQuiz.mutate({
      assignmentId: id,
      answers: quizAnswers,
      signatureName,
    })
  }

  function handleRetakeQuiz() {
    setQuizAnswers({})
    setShowResults(false)
    setShowQuiz(true)
  }

  // Results view
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              {quizPassed ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-700">
                    Congratulations!
                  </CardTitle>
                  <CardDescription>
                    You passed with a score of {score}%
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl text-red-700">
                    Not quite there
                  </CardTitle>
                  <CardDescription>
                    You scored {score}%. You need {trainingModule?.passing_score}% to pass.
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              {quizPassed ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium">Certificate Earned</p>
                    <p className="text-sm text-muted-foreground">
                      Your certificate has been generated and is available in your
                      training history.
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a
                      href={`/api/certificates/${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Please review the training material and try again.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-center gap-4">
              {quizPassed ? (
                <Button onClick={() => router.push('/dashboard/training')}>
                  Back to Training
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => {
                    setShowResults(false)
                    setShowQuiz(false)
                    setCurrentSection(0)
                  }}>
                    Review Material
                  </Button>
                  <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Quiz view with signature
  if (showQuiz && quiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{trainingModule?.title}</span>
              <span>Quiz</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          {/* Quiz Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Check</CardTitle>
              <CardDescription>
                Answer all questions to complete the training. You need{' '}
                {trainingModule?.passing_score}% to pass.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {quiz.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-3">
                  <p className="font-medium">
                    {qIndex + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          quizAnswers[question.id] === oIndex
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          checked={quizAnswers[question.id] === oIndex}
                          onChange={() => handleQuizAnswer(question.id, oIndex)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            quizAnswers[question.id] === oIndex
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {quizAnswers[question.id] === oIndex && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Signature */}
          <Card>
            <CardHeader>
              <CardTitle>Electronic Signature</CardTitle>
              <CardDescription>
                By signing below, you confirm that you have completed this
                training and understand the material.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signature">Type your full name</Label>
                <Input
                  id="signature"
                  placeholder="Jane Smith"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="confirm"
                  checked={signatureConfirmed}
                  onCheckedChange={(checked) =>
                    setSignatureConfirmed(checked === true)
                  }
                />
                <label
                  htmlFor="confirm"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  I certify that I have completed this training module, understand
                  the material presented, and will apply this knowledge in my work.
                </label>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={handlePrevSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmitQuiz}
                disabled={
                  Object.keys(quizAnswers).length < quiz.questions.length ||
                  !signatureName ||
                  !signatureConfirmed ||
                  submitQuiz.isPending
                }
              >
                {submitQuiz.isPending ? 'Submitting...' : 'Submit & Complete'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Content sections view
  const currentSectionData = sections[currentSection]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{trainingModule?.title}</span>
            <span>
              Section {currentSection + 1} of {sections.length}
            </span>
          </div>
          <Progress value={progressPercent} />
        </div>

        {/* Start card for first visit */}
        {assignment.status === 'pending' && currentSection === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{trainingModule?.title}</CardTitle>
              <CardDescription>{trainingModule?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {trainingModule?.duration_minutes} minutes
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {trainingModule?.passing_score}% to pass
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartTraining} className="w-full">
                Start Training
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Content Section */}
        {(assignment.status !== 'pending' || currentSection > 0) &&
          currentSectionData && (
            <Card>
              <CardHeader>
                <CardTitle>{currentSectionData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentSectionData.type === 'text' && (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentSectionData.content || ''}
                    </ReactMarkdown>
                  </div>
                )}

                {currentSectionData.type === 'video' && (
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    {currentSectionData.url ? (
                      <iframe
                        src={currentSectionData.url}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    ) : (
                      <p className="text-white">Video not available</p>
                    )}
                  </div>
                )}

                {currentSectionData.type === 'scenario' && (
                  <div className="space-y-4">
                    <p className="font-medium">{currentSectionData.prompt}</p>
                    <div className="space-y-2">
                      {currentSectionData.options?.map((option, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {currentSectionData.explanation && (
                      <div className="p-4 bg-blue-50 rounded-lg prose prose-sm max-w-none prose-blue">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentSectionData.explanation}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevSection}
                  disabled={currentSection === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={handleNextSection}>
                  {currentSection === sections.length - 1 ? 'Take Quiz' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
      </div>
    </div>
  )
}
