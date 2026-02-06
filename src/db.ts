import { Temporal } from '@js-temporal/polyfill';
import Dexie, { type EntityTable } from 'dexie'

export interface Objednavka {
  id: number
  jmeno: string
  prijmeni: string
  datumNarozeni: Temporal.PlainDate
  datumCasObjednani: Temporal.PlainDateTime
  nahradniCas?: Temporal.PlainTime
  vytvoreno: Temporal.PlainDateTime
}

interface ObjednavkaDB {
  id: number
  jmeno: string
  prijmeni: string
  datumNarozeni: string
  datumCasObjednani: string
  nahradniCas?: string
  vytvoreno: string
}

const db = new Dexie('ObjednavkyDB') as Dexie & {
  objednavky: EntityTable<ObjednavkaDB, 'id'>
}

db.version(1).stores({
  objednavky: '++id, jmeno, prijmeni, datumNarozeni, datumCasObjednani, vytvoreno'
})

export { db }

export async function ulozitObjednavku(data: Omit<Objednavka, 'id' | 'vytvoreno'>) {
  const id = await db.objednavky.add({
    ...data,
    datumNarozeni: data.datumNarozeni.toString(),
    datumCasObjednani: data.datumCasObjednani.toString(),
    nahradniCas: data.nahradniCas?.toString(),
    vytvoreno: Temporal.Now.plainDateTimeISO().toString(),
  })
  
  return id
}

export async function ziskatVsechnyObjednavky(): Promise<Objednavka[]> {
  const rows = await db.objednavky.toArray()
  return rows.map(row => ({
    ...row,
    datumNarozeni: Temporal.PlainDate.from(row.datumNarozeni as unknown as string),
    datumCasObjednani: Temporal.PlainDateTime.from(row.datumCasObjednani as unknown as string),
    nahradniCas: row.nahradniCas ? Temporal.PlainTime.from(row.nahradniCas as unknown as string) : undefined,
    vytvoreno: Temporal.PlainDateTime.from(row.vytvoreno as unknown as string),
  }))
}
