'use server'

import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { getEncuestasBySucursal } from '@/lib/queries/surveys'
import { getParticipacion, isWithinEditWindow } from '@/lib/queries/participation'
import { rateLimit } from '@/lib/rate-limit'
import { setSurveySession } from '@/lib/survey-session'

export type LookupEncuesta = {
  id: number
  titulo: string
  descripcion?: string | null
  participacion: { id: number } | null
  canEdit: boolean
}

export type LookupParticipacionSemanal = {
  participacionId: number
  encuestaTitulo: string
  fecha: Date
}

export type LookupSuccess = {
  empleado: { id: number; nombre: string }
  sucursal: { id: number; nombre: string }
  empleadoSucursalId: number
  encuestas: LookupEncuesta[]
  participacionesSemana: LookupParticipacionSemanal[]
}

export type LookupError = {
  error: 'EMPLOYEE_NOT_FOUND' | 'NO_ACTIVE_BRANCH' | 'RATE_LIMITED'
  empleado?: { nombre: string }
}

export type LookupResult = LookupSuccess | LookupError

function getWeekStart(): Date {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

export async function lookupByCi(ci: string): Promise<LookupResult> {
  const trimmed = ci.trim()

  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0].trim() ??
    headerStore.get('x-real-ip') ??
    '127.0.0.1'

  const { allowed } = await rateLimit(ip)
  if (!allowed) return { error: 'RATE_LIMITED' }

  const employee = await db.empleado.findFirst({
    where: { CI: trimmed, Estado: true },
  })

  if (!employee) return { error: 'EMPLOYEE_NOT_FOUND' }

  const empleadoSucursal = await db.empleadoSucursal.findFirst({
    where: { Empleado_Id: employee.Id, Estado: true },
    include: { Sucursal: true },
  })

  if (!empleadoSucursal) {
    return {
      error: 'NO_ACTIVE_BRANCH',
      empleado: { nombre: `${employee.Nombre} ${employee.Apellido}` },
    }
  }

  const [encuestas, participacionesSemana] = await Promise.all([
    getEncuestasBySucursal(empleadoSucursal.Sucursal_Id),
    db.participacion.findMany({
      where: {
        EmpleadoSucursal_Id: empleadoSucursal.Id,
        DateCreated: { gte: getWeekStart() },
      },
      include: { Encuesta: { select: { Titulo: true } } },
      orderBy: { DateCreated: 'desc' },
    }),
  ])

  const encuestasWithParticipation: LookupEncuesta[] = await Promise.all(
    encuestas.map(async (encuesta) => {
      const participacion = await getParticipacion(empleadoSucursal.Id, encuesta.Id)
      return {
        id: encuesta.Id,
        titulo: encuesta.Titulo,
        descripcion: encuesta.Descripcion,
        participacion: participacion ? { id: participacion.Id } : null,
        canEdit: participacion !== null && isWithinEditWindow(participacion.DateCreated),
      }
    }),
  )

  await setSurveySession({ empleadoSucursalId: empleadoSucursal.Id, ci: trimmed })

  return {
    empleado: {
      id: employee.Id,
      nombre: `${employee.Nombre} ${employee.Apellido}`,
    },
    sucursal: {
      id: empleadoSucursal.Sucursal.Id,
      nombre: empleadoSucursal.Sucursal.Nombre,
    },
    empleadoSucursalId: empleadoSucursal.Id,
    encuestas: encuestasWithParticipation,
    participacionesSemana: participacionesSemana.map((p) => ({
      participacionId: p.Id,
      encuestaTitulo: p.Encuesta.Titulo,
      fecha: p.DateCreated,
    })),
  }
}
