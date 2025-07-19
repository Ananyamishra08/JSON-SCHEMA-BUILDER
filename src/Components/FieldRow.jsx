import React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';

const FieldRow = ({ nestIndex, control, register, parentName, remove }) => {
  const fieldName = `${parentName}[${nestIndex}]`;
  const fieldType = useWatch({ control, name: `${fieldName}.type` });
  const childFieldName = `${fieldName}.children`;

  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: childFieldName,
  });

  return (
    <div
      style={{
        marginLeft: '20px',
        borderLeft: '2px solid #ddd',
        paddingLeft: '10px',
        marginBottom: '10px',
      }}
    >
      <input
        placeholder="Key"
        {...register(`${fieldName}.name`)}
        style={{ marginRight: '10px' }}
      />

      <select {...register(`${fieldName}.type`)} style={{ marginRight: '10px' }}>
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="object">Nested</option>
      </select>

      {fieldType !== 'object' && (
        <input
          placeholder="Value"
          {...register(`${fieldName}.value`)}
          style={{ marginRight: '10px' }}
        />
      )}

      <button type="button" onClick={() => remove(nestIndex)}>
        Remove
      </button>

      {fieldType === 'object' && (
        <div style={{ marginTop: '10px' }}>
          {childFields.map((child, index) => (
            <FieldRow
              key={child.id}
              nestIndex={index}
              control={control}
              register={register}
              parentName={`${fieldName}.children`}
              remove={removeChild}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              appendChild({ name: '', type: 'string', value: '', children: [] })
            }
            style={{ marginTop: '5px' }}
          >
            Add Nested Field
          </button>
        </div>
      )}
    </div>
  );
};

export default FieldRow;