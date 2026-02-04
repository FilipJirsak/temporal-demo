import { Temporal } from '@js-temporal/polyfill';
import { useFormik } from 'formik'
import { ulozitObjednavku } from './db'

interface FormValues {
    jmeno: string
    prijmeni: string
    datumNarozeni: string
    datumCasObjednani: string
}

export function Form() {
    const minDateTimeValue = Temporal.Now.plainDateTimeISO().round({ smallestUnit: "minute", roundingIncrement: 15, roundingMode: "ceil" }).toString({ smallestUnit: "minute" })
    
    const formik = useFormik<FormValues>({
        initialValues: {
            jmeno: '',
            prijmeni: '',
            datumNarozeni: '',
            datumCasObjednani: minDateTimeValue,
        },
        validate: (values) => {
            const errors: Partial<Record<keyof FormValues, string>> = {}

            if (!values.jmeno.trim()) {
                errors.jmeno = 'Jméno je povinné'
            }

            if (!values.prijmeni.trim()) {
                errors.prijmeni = 'Příjmení je povinné'
            }

            if (!values.datumNarozeni) {
                errors.datumNarozeni = 'Datum narození je povinné'
            }

            if (!values.datumCasObjednani) {
                errors.datumCasObjednani = 'Datum a čas objednání je povinný'
            }

            return errors
        },
        onSubmit: async (values, { resetForm }) => {
            try {
                const data = {
                    jmeno: values.jmeno,
                    prijmeni: values.prijmeni,
                    datumNarozeni: Temporal.PlainDate.from(values.datumNarozeni),
                    datumCasObjednani: Temporal.PlainDateTime.from(values.datumCasObjednani),
                }
                const id = await ulozitObjednavku(data)
                console.log('Objednávka uložena s ID:', id)
                resetForm()
            } catch (error) {
                console.error('Chyba při ukládání objednávky:', error)
            }
        },
    })

    return (
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 sm:rounded-2xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center sm:text-3xl sm:mb-2">
                Objednávkový formulář
            </h1>
            <p className="text-sm text-gray-600 mb-6 text-center sm:text-base sm:mb-8">
                Vyplňte prosím všechny údaje
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="flex flex-col">
                    <label
                        htmlFor="jmeno"
                        className="text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Jméno <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="jmeno"
                        name="jmeno"
                        type="text"
                        autoComplete="given-name"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.jmeno}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition sm:px-4 sm:py-3"
                        placeholder="Zadejte své jméno"
                    />
                    {formik.touched.jmeno && formik.errors.jmeno && (
                        <span className="text-red-500 text-sm mt-1">{formik.errors.jmeno}</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="prijmeni"
                        className="text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Příjmení <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="prijmeni"
                        name="prijmeni"
                        type="text"
                        autoComplete="family-name"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.prijmeni}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition sm:px-4 sm:py-3"
                        placeholder="Zadejte své příjmení"
                    />
                    {formik.touched.prijmeni && formik.errors.prijmeni && (
                        <span className="text-red-500 text-sm mt-1">{formik.errors.prijmeni}</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="datumNarozeni"
                        className="text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Datum narození <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="datumNarozeni"
                        name="datumNarozeni"
                        type="date"
                        autoComplete="bday"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.datumNarozeni}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition sm:px-4 sm:py-3"
                    />
                    {formik.touched.datumNarozeni && formik.errors.datumNarozeni && (
                        <span className="text-red-500 text-sm mt-1">{formik.errors.datumNarozeni}</span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="datumCasObjednani"
                        className="text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Datum a čas objednání <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="datumCasObjednani"
                        name="datumCasObjednani"
                        type="datetime-local"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.datumCasObjednani}
                        min={minDateTimeValue}
                        step={60 * 15}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white outline-none transition sm:px-4 sm:py-3"
                    />
                    {formik.touched.datumCasObjednani && formik.errors.datumCasObjednani && (
                        <span className="text-red-500 text-sm mt-1">{formik.errors.datumCasObjednani}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 sm:py-3 sm:px-6"
                >
                    Odeslat objednávku
                </button>
            </form>
        </div>
    )
}
