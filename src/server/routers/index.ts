import { router } from '../trpc'
import { organizationsRouter } from './organizations'
import { practicesRouter } from './practices'
import { employeesRouter } from './employees'
import { trainingRouter } from './training'
import { documentsRouter } from './documents'
import { vaccinationsRouter } from './vaccinations'
import { inspectionRouter } from './inspection'
import { engageRouter } from './engage'
import { openDentalRouter } from './openDental'

export const appRouter = router({
  organizations: organizationsRouter,
  practices: practicesRouter,
  employees: employeesRouter,
  training: trainingRouter,
  documents: documentsRouter,
  vaccinations: vaccinationsRouter,
  inspection: inspectionRouter,
  engage: engageRouter,
  openDental: openDentalRouter,
})

export type AppRouter = typeof appRouter
