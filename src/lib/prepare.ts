/*
 * prepare.js
 *
 * Created by Dr. Maximillian Dornseif 2023-02-28 in json-schema-prepare-data-for-form 0.1.0
 * Copyright (c) 2023 Maximillian Dornseif
 */

import { JSONSchema7 } from 'json-schema'
import cleanDeep from 'clean-deep'
import { jsonSchemaDataMerge } from './merge'
import { jsonDefault } from 'json-schema-default'
import { jsonEmptyArrays } from 'json-schema-empty-arrays'
import { jsonEmptyStrings } from 'json-schema-empty-strings'

export function prepareDataForForm<T>(schema: JSONSchema7, inData: T): T {
  // null etc aus den übergebenen Daten entfernen
  // das schwierige ist, dass bei der Schema-Validierung leere Strings auf
  // die Feld Pattern geprüft werden. Ein "" ist zB keien gültige E-Mail Adresse
  // Leere strings müssen bei der Validierung `undefined` sein.
  // Also nehmen wir die raus.
  // Das Problem ist, dass dann die Defaults angewendet werden.
  // Wir können bei diesem Vorgehen kein leeres Feld haben,
  // wenn für dieses Feld ein Default existiert.
  // Siehe https://github.com/rjsf-team/react-jsonschema-form/issues/402
  // https://community.retool.com/t/json-schema-form-ui-emptyvalue-issues/4837
  // https://github.com/rjsf-team/react-jsonschema-form/issues/605
  return jsonSchemaDataMerge({}, [
    jsonEmptyStrings(schema) as any,
    jsonEmptyArrays(schema) as any,
    jsonDefault(schema) as any,
    cleanDeep(inData, {
      emptyStrings: true,
      nullValues: true,
      emptyArrays: false,
      emptyObjects: true,
    }) as any
  ]) as T
}

/** Prepare Data for editing in react-json-schema-form.
 *
 * The difficulty is, that during validation empty strings are validated against `pattern`.
 * For example `""` is no valid E-Mail address.
 * Empty strings musst be `undefined` during rjsf validation.
 * So we delete empty strings.
 *
 * See https://github.com/rjsf-team/react-jsonschema-form/issues/402
 * https://github.com/rjsf-team/react-jsonschema-form/issues/605
 * https://community.retool.com/t/json-schema-form-ui-emptyvalue-issues/4837
 **/
export function prepareDataForRjsf<T>(schema: JSONSchema7, inData: T): T {
  return cleanDeep(prepareDataForForm<T>(schema, inData), {
    emptyStrings: true,
    nullValues: false,
    emptyArrays: false,
    emptyObjects: false,
  }) as T
}
