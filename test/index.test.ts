/*
 * index.test.ts
 *
 * Created by Dr. Maximillian Dornseif 2023-02-28 in json-schema-prepare-data-for-form 0.1.0
 * Copyright (c) 2023 Maximillian Dornseif
 */

import { JSONSchema7 } from 'json-schema'

import merge from 'lodash.merge'
import { jsonDefault } from 'json-schema-default'
import { jsonEmptyArrays } from 'json-schema-empty-arrays'
import { jsonEmptyStrings } from 'json-schema-empty-strings'
import { jsonSchemaDataMerge, prepareDataForForm, prepareDataForRjsf } from '../src/index'
import { expect, test } from 'vitest'

const TESTENTITY = { designator: 'TST10001', ist_aktiv: true, artworksprachen: ['Spanisch'] }
const TESTSCHEMA: JSONSchema7 = {
  $id: 'https://huwawi3.hudora.de/schemata/H3Test',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Testdaten',
  description: 'Diese Daten sind zum Experimentieren und Spielen',
  type: 'object',
  required: ['designator', 'annotationRequired', 'annotationRequiredDefault'],
  properties: {
    designator: {
      title: '№',
      type: 'string',
      default: 'TST00000',
    },
    ist_aktiv: {
      title: 'Aktiv?',
      type: 'boolean',
      default: true,
    },
    artworksprachen: {
      title: 'Artwork-Sprachen',
      type: 'array',
      default: ['Deutsch', 'Englisch', 'Italienisch'],
      items: {
        type: 'string',
        enum: ['Deutsch', 'Englisch', 'Italienisch', 'Spanisch', 'Französisch', 'Niederländisch'],
      },
    },
    annotationRequired: {
      title: '№',
      type: 'string',
    },
    annotation: {
      title: '№',
      type: 'string',
    },
    annotationRequiredDefault: {
      title: '№',
      type: 'string',
      default: 'foo',
    },
    annotationDefault: {
      title: '№',
      type: 'string',
      default: 'bar',
    },
  },
}

test('Lodash merge works somewhat different than expected', () => {
  expect(merge({ l: [1, 2, 3, 4] }, { l: [4, 5, 6] })).toMatchInlineSnapshot(`
  {
    "l": [
      4,
      5,
      6,
      4,
    ],
  }
`)
})
test('jsonSchemaDataMerge does the right thing', () => {
  expect(jsonSchemaDataMerge({ l: [1, 2, 3, 4] }, [{ l: [4, 5, 6] }])).toMatchInlineSnapshot(`
  {
    "l": [
      4,
      5,
      6,
    ],
  }
`)
})

test('empty arrays', () => {
  expect(jsonEmptyArrays(TESTSCHEMA)).toMatchInlineSnapshot(`
  {
    "artworksprachen": [],
  }
`)
})
test('empty strings', () => {
  expect(jsonEmptyStrings(TESTSCHEMA)).toMatchInlineSnapshot(`
    {
      "annotation": "",
      "annotationDefault": "",
      "annotationRequired": "",
      "annotationRequiredDefault": "",
      "artworksprachen": {},
      "designator": "",
    }
  `)
})

test('defaults', () => {
  const m1 = merge({}, jsonDefault(TESTSCHEMA))
  expect(m1).toMatchInlineSnapshot(`
    {
      "annotationDefault": "bar",
      "annotationRequiredDefault": "foo",
      "artworksprachen": [
        "Deutsch",
        "Englisch",
        "Italienisch",
      ],
      "designator": "TST00000",
      "ist_aktiv": true,
    }
  `)
})

test('prepareDataForForm', () => {
  const m6 = prepareDataForForm(TESTSCHEMA, TESTENTITY)
  expect(m6).toMatchInlineSnapshot(`
    {
      "annotation": "",
      "annotationDefault": "bar",
      "annotationRequired": "",
      "annotationRequiredDefault": "foo",
      "artworksprachen": [
        "Spanisch",
      ],
      "designator": "TST10001",
      "ist_aktiv": true,
    }
  `)
})

test('prepareDataForRjsf', () => {
  const m6 = prepareDataForRjsf(TESTSCHEMA, TESTENTITY)
  expect(m6).toMatchInlineSnapshot(`
    {
      "annotationDefault": "bar",
      "annotationRequiredDefault": "foo",
      "artworksprachen": [
        "Spanisch",
      ],
      "designator": "TST10001",
      "ist_aktiv": true,
    }
  `)
})
