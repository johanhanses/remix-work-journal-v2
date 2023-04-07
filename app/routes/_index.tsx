import { PrismaClient } from '@prisma/client'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { format } from 'date-fns'
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

export default function Index() {
  const fetcher = useFetcher()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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
          <fieldset disabled={fetcher.state === 'submitting'} className="disabled:opacity-70">
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

      {/* <div className="mt-6">
        <p className="font-bold">
          Week of February 20<sup>th</sup>, 2023
        </p>

        <div className="mt-3 space-y-4">
          <div>
            <p>Work:</p>
            <ul className="ml-8 list-disc">
              <li>First thing</li>
              <li>Second thing</li>
            </ul>
          </div>

          <div>
            <p>Learnings:</p>
            <ul className="ml-8 list-disc">
              <li>First learning</li>
              <li>Second learning</li>
            </ul>
          </div>

          <div>
            <p>Interesting things:</p>
            <ul className="ml-8 list-disc">
              <li>Something cool!</li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  )
}
