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
    <div style={{ padding: '20px' }}>
      <h2>JSON Schema Builder</h2>

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

      <button onClick={() => append({ name: '', type: 'string', value: '', children: [] })}>
        Add Field
      </button>

      <h3>Live JSON Preview</h3>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(jsonPreview, null, 2)}
      </pre>
    </div>
  );
};

export default SchemaBuilder;