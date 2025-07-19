import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FieldRow from './FieldRow';

function SchemaBuilder() {
  const { control, register, watch } = useForm({
    defaultValues: { fields: [] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  });

  const watchFields = watch('fields');

  const [jsonPreview, setJsonPreview] = useState({});

  useEffect(() => {
    const buildSchema = (arr) => {
      const schema = {};
      arr.forEach((f) => {
        if (!f.name) return;
        if (f.type === 'nested' && Array.isArray(f.children)) {
          schema[f.name] = buildSchema(f.children);
        } else {
          schema[f.name] = f.type || '';
        }
      });
      return schema;
    };

    setJsonPreview(buildSchema(watchFields || []));
  }, [watchFields]);

  return (
    <Row gutter={16}>
      <Col span={12}>
        {fields.map((item, index) => (
          <FieldRow
            key={item.id}
            nestIndex={index}
            control={control}
            register={register}
            remove={remove}
            parentName="fields"
          />
        ))}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => append({ name: '', type: 'string', children: [] })}
          style={{ marginTop: 16 }}
        >
          Add Item
        </Button>
      </Col>
      <Col span={12}>
        <pre>{JSON.stringify(jsonPreview, null, 2)}</pre>
      </Col>
    </Row>
  );
}

export default SchemaBuilder;
