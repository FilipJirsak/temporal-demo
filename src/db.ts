import Dexie, { type EntityTable } from 'dexie'

export interface Objednavka {
  id: number
  jmeno: string
  prijmeni: string
  datumNarozeni: Temporal.PlainDate
  datumCasObjednani: Temporal.PlainDateTime
  vytvoreno: Temporal.PlainDateTime
}

const db = new Dexie('ObjednavkyDB') as Dexie & {
  objednavky: EntityTable<Objednavka, 'id'>
}

db.version(1).stores({
  objednavky: '++id, jmeno, prijmeni, datumNarozeni, datumCasObjednani, createdAt'
})

export { db }

export async function ulozitObjednavku(data: Omit<Objednavka, 'id' | 'createdAt'>) {
  const id = await db.objednavky.add({
    ...data,
    datumNarozeni: data.datumNarozeni.toString(),
    datumCasObjednani: data.datumCasObjednani.toString(),
    vytvoreno: Temporal.Now.plainDateTimeISO().toString(),
  } as Objednavka)
  
  return id
}

export async function ziskatVsechnyObjednavky(): Promise<Objednavka[]> {
  const rows = await db.objednavky.toArray()
  return rows.map(row => ({
    ...row,
    datumNarozeni: Temporal.PlainDate.from(row.datumNarozeni as unknown as string),
    datumCasObjednani: Temporal.PlainDateTime.from(row.datumCasObjednani as unknown as string),
    vytvoreno: Temporal.PlainDateTime.from(row.vytvoreno as unknown as string),
  }))
}
