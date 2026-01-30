import { router } from '../trpc'
import { organizationsRouter } from './organizations'
import { practicesRouter } from './practices'
import { employeesRouter } from './employees'
import { trainingRouter } from './training'
import { documentsRouter } from './documents'
import { vaccinationsRouter } from './vaccinations'
import { inspectionRouter } from './inspection'

export const appRouter = router({
  organizations: organizationsRouter,
  practices: practicesRouter,
  employees: employeesRouter,
  training: trainingRouter,
  documents: documentsRouter,
  vaccinations: vaccinationsRouter,
  inspection: inspectionRouter,
})

export type AppRouter = typeof appRouter
