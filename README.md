![NPM License](https://img.shields.io/npm/l/json-schema-prepare-data-for-form)
[![NPM Version](https://img.shields.io/npm/v/json-schema-prepare-data-for-form)](https://www.npmjs.com/package/json-schema-prepare-data-for-form)
[![Last Commit](https://img.shields.io/github/last-commit/mdornseif/json-schema-prepare-data-for-form)](https://github.com/mdornseif/json-schema-prepare-data-for-form)

# json-schema-prepare-data-for-form

Enrich form data with sensible and provided defaults for editing in a HTML `<form>` and especially for [react-json-schema-form](https://github.com/rjsf-team/react-jsonschema-form).

Uses information from a [JSON-Schema](https://json-schema.org) to prepare data for editing in a HTML form.

It takes a JSON Schema and generates a Template with the following properties:

- All string fields contain `''` (via [json-schema-empty-strings](https://www.npmjs.com/package/json-schema-empty-strings))
- All array fields contain `[]` (via [json-schema-empty-arrays](https://www.npmjs.com/package/json-schema-empty-arrays))
- It fills in the default values from the schema (via [json-schema-default](https://www.npmjs.com/package/json-schema-default))

This then is merged with the data provided by the caller. Merging is done in a way expected by users for form data.
Other deep merge implementations (e.g. `[_.merge()](https://lodash.com/docs/4.17.15#merge)`) handle Arrays as if they are tuples which leads to unexpected behavior:

```py
    >>> _.merge({ l: [1, 2, 3, 4] }, { l: [4, 5, 6] })
    {
      "l": [
        4,
        5,
        6,
        4,
      ],
    }
```

The resulting array has duplicate elements and is longer than the provided data. 
With `jsonSchemaDataMerge()` the last array overwrites the provided data:

```py
    >>> jsonSchemaDataMerge({ l: [1, 2, 3, 4] }, [{ l: [4, 5, 6] }]))
    {
      "l": [
        4,
        5,
        6,
      ],
    }
```

Prepare Data for editing in [react-json-schema-form](https://github.com/rjsf-team/react-jsonschema-form)
has some special requirements: 
During validation empty strings are validated against `pattern`. 
But for example `""` is no valid E-Mail address.
So empty strings musst be `undefined` during rjsf validation,
to allow fields with empty strings to pass validation (unless the field is required).

See [Issue 402](https://github.com/rjsf-team/react-jsonschema-form/issues/402),
[Issue 605](https://github.com/rjsf-team/react-jsonschema-form/issues/605) and
[retool Issue 4837](https://community.retool.com/t/json-schema-form-ui-emptyvalue-issues/4837).


```js
import { prepareDataForForm, prepareDataForRjsf } from '../src/index'

const finalData = prepareDataForForm(schema, inputData)
// or
const finalDataForRjsf = prepareDataForRjsf(schema, inputData)
```

See [the tests](https://github.com/mdornseif/json-schema-prepare-data-for-form/blob/main/test/index.test.ts) 
for additional demonstration on the merging issues.


# See also:

- [json-schema-empty-array](https://www.npmjs.com/package/json-schema-empty-array)
- [json-schema-empty-strings](https://www.npmjs.com/package/json-schema-empty-strings)
- [json-schema-default](https://www.npmjs.com/package/json-schema-default)
- [react-json-schema-form](https://github.com/rjsf-team/react-jsonschema-form)
