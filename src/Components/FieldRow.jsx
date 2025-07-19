import React from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';

const FieldRow = ({ nestIndex, control, register, parentName, remove }) => {
  const fieldName = `${parentName}[${nestIndex}]`;
  const fieldType = useWatch({ control, name: `${fieldName}.type` });
  const childFieldName = `${fieldName}.children`;

  const { fields: childFields, append: appendChild, remove: removeChild } = useFieldArray({
    control,
    name: childFieldName,
  });

  return (
   <div className="ml-5 border-l-2 border-gray-300 pl-4 mb-4">
  <div className="flex flex-wrap items-center gap-2 mb-2">
    <input
      placeholder="Key"
      {...register(`${fieldName}.name`)}
      className="border px-2 py-1 rounded w-32"
    />

{fieldType !== 'object' && (
      <input
        placeholder="Value"
        {...register(`${fieldName}.value`)}
        className="border px-2 py-1 rounded w-32"
      />
    )}

    <select {...register(`${fieldName}.type`)} className="border px-2 py-1 rounded w-32">
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
      <option value="object">Nested</option>
    </select>

    <button
      type="button"
      onClick={() => remove(nestIndex)}
      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Remove
    </button>
  </div>

  {fieldType === 'object' && (
    <div className="mt-2 ml-4">
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
        onClick={() => appendChild({ name: '', type: 'string', value: '', children: [] })}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Nested Field
      </button>
    </div>
  )}
</div>

  );
};

export default FieldRow;
