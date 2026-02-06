import { useLiveQuery } from 'dexie-react-hooks'
import { ziskatVsechnyObjednavky } from './db'

export function List() {
  const objednavky = useLiveQuery(() => ziskatVsechnyObjednavky())

  if (!objednavky) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 sm:rounded-2xl">
        <p className="text-center text-gray-600">Načítání...</p>
      </div>
    )
  }

  if (objednavky.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 sm:rounded-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4 sm:text-2xl">
          Seznam objednávek
        </h2>
        <p className="text-center text-gray-600">Zatím nejsou žádné objednávky.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 sm:rounded-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4 sm:text-2xl">
        Seznam objednávek
      </h2>
      <div className="space-y-4">
        {objednavky.map((objednavka) => (
          <div 
            key={objednavka.id} 
            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <span className="text-sm font-medium text-gray-600 block">Jméno:</span>
                <p className="text-gray-900">{objednavka.jmeno} {objednavka.prijmeni}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block">Datum narození:</span>
                <p className="text-gray-900">
                  {objednavka.datumNarozeni.toLocaleString('cs-CZ', { dateStyle: 'long' })}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block">Datum objednání:</span>
                <p className="text-gray-900">
                  {objednavka.datumCasObjednani.toLocaleString('cs-CZ', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block">Náhradní čas:</span>
                {objednavka.nahradniCas ? (
                  <p className="text-gray-900">
                    {objednavka.nahradniCas.toLocaleString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                ) : (
                  <p className="text-gray-900 italic">nezvolen</p>
                )}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Vytvořeno: {objednavka.vytvoreno.toLocaleString('cs-CZ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
