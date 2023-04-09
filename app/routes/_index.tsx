import { PrismaClient } from '@prisma/client'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { format, parseISO, startOfWeek } from 'date-fns'
import { useEffect, useRef } from 'react'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Work Journal' }]
}

export const action = async ({ request }: ActionArgs) => {
  const prisma = new PrismaClient()
  const formData = await request.formData()
  const { date, type, text } = Object.fromEntries(formData)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (typeof date !== 'string' || typeof type !== 'string' || typeof text !== 'string')
    throw new Error('Bad request')

  return await prisma.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  })
}

export const loader = async () => {
  const prisma = new PrismaClient()
  const entries = await prisma.entry.findMany()
  console.log(entries)
  return entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  }))
}

export default function Index() {
  const fetcher = useFetcher()
  const entries = useLoaderData<typeof loader>()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const entriesByWeek = entries.reduce<Record<string, typeof entries>>((memo, entry) => {
    const mondayString = format(
      startOfWeek(parseISO(entry.date), { weekStartsOn: 1 }),
      'yyyy-MM-dd',
    )
    memo[mondayString] = [...(memo[mondayString] ?? []), entry]
    return memo
  }, {})

  const weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter((e) => e.type === 'work'),
      learning: entriesByWeek[dateString].filter((e) => e.type === 'learning'),
      interestingThing: entriesByWeek[dateString].filter((e) => e.type === 'interesting-thing'),
    }))

  useEffect(() => {
    if (fetcher.state === 'idle' && textareaRef.current) textareaRef.current.value = ''
  }, [fetcher.state])

  return (
    <div className="mx-auto max-w-3xl p-10">
      <h1 className="text-5xl">Work journal</h1>
      <p className="mt-2 text-lg text-gray-400">Doings and learnings. Updated weekly.</p>

      <div className="my-8 border p-3">
        <p className="italic">Create an entry</p>
        <fetcher.Form method="post">
          <fieldset disabled={fetcher.state !== 'idle'} className="disabled:opacity-70">
            <div className="mt-4">
              <input
                type="date"
                name="date"
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                required
                className="text-gray-900"
              />
            </div>

            <div className="mt-2 space-x-6">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="work"
                  defaultChecked
                  required
                  className="mr-1"
                />
                Work
              </label>
              <label>
                <input type="radio" name="type" value="learning" className="mr-1" />
                Learning
              </label>
              <label>
                <input type="radio" name="type" value="interesting-thing" className="mr-1" />
                Interesting thing
              </label>
            </div>

            <div className="mt-2">
              <textarea
                ref={textareaRef}
                name="text"
                placeholder="Write your entry..."
                required
                className="w-full text-gray-700"
              />
            </div>
            <div className="mt-1 text-right">
              <button type="submit" className="bg-blue-500 text-white font-medium px-4 py-1">
                {fetcher.state === 'submitting' ? 'Saving...' : 'Save'}
              </button>
            </div>
          </fieldset>
        </fetcher.Form>
      </div>

      <div className="mt-16 space-y-16">
        {weeks.map((week) => (
          <div key={week.dateString} className="mt-6">
            <p className="font-bold">Week of {format(parseISO(week.dateString), 'do MMMM')}</p>

            <div className="mt-3 space-y-4">
              {week.work.length > 0 && (
                <div>
                  <p>Work:</p>
                  <ul className="ml-8 list-disc">
                    {week.work.map((w) => (
                      <li key={w.id}>{w.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {week.learning.length > 0 && (
                <div>
                  <p>Learning:</p>
                  <ul className="ml-8 list-disc">
                    {week.learning.map((w) => (
                      <li key={w.id}>{w.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {week.interestingThing.length > 0 && (
                <div>
                  <p>Interesting thing:</p>
                  <ul className="ml-8 list-disc">
                    {week.interestingThing.map((w) => (
                      <li key={w.id}>{w.text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
