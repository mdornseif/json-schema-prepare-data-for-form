/*
 * merge.js - like _.merge() but replace arrays instead of merging them
 *
 * Created by Dr. Maximillian Dornseif 2023-02-28 in json-schema-prepare-data-for-form 0.1.0
 * Copyright (c) 2023 Maximillian Dornseif
 */

import mergeWith from 'lodash.mergewith'

function _customizer(objValue: any, srcValue: any): any {
  if (Array.isArray(srcValue)) {
    return srcValue
  }
}

export function jsonSchemaDataMerge(
  destination: Record<string, any>,
  sources: Record<string, any>[]
): Record<string, any> {
  for (let source of sources) {
    destination = mergeWith(destination, source, _customizer)
  }
  return destination
}
