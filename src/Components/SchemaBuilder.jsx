import { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import FieldRow from './FieldRow';

const SchemaBuilder = () => {
  const { control, register } = useForm({ defaultValues: { fields: [] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
  const watchedFields = useWatch({ control, name: 'fields' });
  const [jsonPreview, setJsonPreview] = useState({});

  const generateJson = (fields) => {
    const result = {};
    fields?.forEach((field) => {
      if (!field?.name?.trim()) return;

      if (field.type === 'object' && Array.isArray(field.children)) {
        result[field.name.trim()] = generateJson(field.children);
      } else {
        let val = field.value;
        if (field.type === 'number') val = Number(val);
        if (field.type === 'boolean') val = val === 'true' || val === true;
        result[field.name.trim()] = val ?? '';
      }
    });
    return result;
  };

  useEffect(() => {
    if (watchedFields) {
      setJsonPreview(generateJson(watchedFields));
    }
  }, [watchedFields]);

  return (
    // <div className="p-5 flex flex-col md:flex-row gap-8 max-w-[1200px] mx-auto">
   <div className="p-5 max-w-[1400px] mx-auto bg-white shadow rounded-lg">
  <h2 className="text-2xl text-center font-bold mb-4">JSON Schema Builder</h2>

  <div className="flex flex-col md:flex-row gap-8">
    {/* Left Section: Fields Builder */}
    <div className="flex-1 min-w-[300px] bg-gray-50 p-4 rounded shadow-inner overflow-auto max-h-[80vh]">
      <h3 className="text-lg font-semibold mb-4">Build Fields</h3>

      {fields.map((field, index) => (
        <FieldRow
          key={field.id}
          nestIndex={index}
          control={control}
          register={register}
          parentName="fields"
          remove={remove}
        />
      ))}

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => append({ name: '', type: 'string', value: '', children: [] })}
      >
        Add Field
      </button>
    </div>

    {/* Right Section: JSON Preview */}
    <div className="flex-1 min-w-[300px] bg-gray-100 p-4 rounded shadow-inner overflow-auto max-h-[80vh]">
      <h3 className="text-lg font-semibold mb-2">Live JSON Preview</h3>
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(jsonPreview, null, 2)}</pre>
    </div>
  </div>
</div>

  );
};

export default SchemaBuilder;