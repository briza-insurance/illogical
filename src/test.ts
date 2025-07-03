import weakMemoize from '@emotion/weak-memoize'
import fs from 'fs'
import path from 'path'

import { Evaluable } from './common/evaluable'
import Engine, { defaultOptions, isEvaluable } from './index'
import { ExpressionInput } from './parser'

type Question = {
  condition: ExpressionInput
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const illogical = new Engine()

const getEvaluable = weakMemoize(
  (condition: ExpressionInput): Evaluable => illogical.parse(condition)
)

const simplifyCondition = (question: Question) => {
  if (!question.condition) {
    return undefined
  }
  const date1 = new Date()
  const eva = getEvaluable(question.condition)

  const date2 = new Date()

  const explicitResult = eva.simplify({}, [], [])

  if (isEvaluable(explicitResult)) {
    return explicitResult.serialize(defaultOptions)
  }
  const date3 = new Date()

  const implicitResult = illogical.simplify(question.condition, {}, [], [])
  const date4 = new Date()
  const unsafeResult = illogical.unsafeSimplify(question.condition, {}, [], [])
  const date5 = new Date()

  const diff1 = date2.getTime() - date1.getTime()
  const diff2 = date3.getTime() - date2.getTime()
  const diff3 = date4.getTime() - date3.getTime()
  const diff4 = date5.getTime() - date4.getTime()

  console.log('Evaluable.simplify result', explicitResult)
  console.log('illogical.simplify result', implicitResult)
  console.log('illogical.unsafeSimplify result', unsafeResult)

  // Run each type at a time to avoid internal caching making the results better
  console.log(`illogical.parse in ${diff1} ms`)
  console.log(`Evaluable.simplify in ${diff2} ms`)
  console.log(`illogical.simplify in ${diff3} ms`)
  console.log(`illogical.unsafeSimplify in ${diff4} ms`)
}

const run = () => {
  // const file = 'easyEq.json'
  // const file = 'easyIn.json'
  // const file = 'easyOverlap.json'
  // const file = 'easyAnd.json'
  // const file = 'easyOr.json'

  const file = 'HighAltitudeServices.json'

  // const file = 'refsAnd.json'

  const question: Question = JSON.parse(
    fs.readFileSync(path.join(__dirname, file), 'utf-8')
  )

  simplifyCondition(question)
}

run()
