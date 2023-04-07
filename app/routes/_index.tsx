import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Work Journal' }]
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const json = Object.fromEntries(formData)
  console.log(json)

  return redirect('/')
}

export default function Index() {
  return (
    <div className="mx-auto max-w-3xl p-10">
      <h1 className="text-5xl">Work journal</h1>
      <p className="mt-2 text-lg text-gray-400">Doings and learnings. Updated weekly.</p>

      <div className="my-8 border p-3">
        <Form method="post">
          <p className="italic">Create an entry</p>
          <div>
            <div className="mt-4">
              <input type="date" name="date" className="text-gray-700" />
            </div>

            <div className="mt-2 space-x-6">
              <label>
                <input type="radio" name="category" value="work" className="mr-1" />
                Work
              </label>
              <label>
                <input type="radio" name="category" value="learning" className="mr-1" />
                Learning
              </label>
              <label>
                <input type="radio" name="category" value="interesting-thing" className="mr-1" />
                Interesting thing
              </label>
            </div>

            <div className="mt-2">
              <textarea
                name="text"
                placeholder="Write your entry..."
                className="w-full text-gray-700"
              />
            </div>
            <div className="mt-1 text-right">
              <button type="submit" className="bg-blue-500 text-white font-medium px-4 py-1">
                Save
              </button>
            </div>
          </div>
        </Form>
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
