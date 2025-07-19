import React from 'react';
import { Input, Select, Switch, Button, Space, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useFieldArray, Controller, useWatch } from 'react-hook-form';

const { Option } = Select;

function FieldRow({ nestIndex, control, register, remove, parentName }) {
  const fieldPath = `${parentName}[${nestIndex}]`;

  const type = useWatch({
    control,
    name: `${fieldPath}.type`
  });

  const { fields, append, remove: removeNested } = useFieldArray({
    control,
    name: `${fieldPath}.children`
  });

  return (
    <Card size="small" style={{ marginTop: 8 }}>
      <Space style={{ display: 'flex', alignItems: 'center'}}>
        <Input {...register(`${fieldPath}.name`)} placeholder="Field Name" style={{ width: 200 }} />
        <Controller
          control={control}
          name={`${fieldPath}.type`}
          render={({ field }) => (
            <Select {...field} style={{ width: 150 }}>
              <Option value="string">String</Option>
              <Option value="number">Number</Option>
              <Option value="nested">Nested</Option>
              <Option value="objectId">ObjectId</Option>
              <Option value="float">Float</Option>
              <Option value="boolean">Boolean</Option>
            </Select>
          )}
        />
        <Switch />
        <MinusCircleOutlined onClick={() => remove(nestIndex)} />
      </Space>

      {type === 'nested' && (
        <div style={{ marginLeft: 24, marginTop: 8 }}>
          {fields.map((item, index) => (
            <FieldRow
              key={item.id}
              nestIndex={index}
              control={control}
              register={register}
              remove={removeNested}
              parentName={`${fieldPath}.children`}
            />
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => append({ name: '', type: 'string', children: [] })}
            style={{ marginTop: 8 }}
          >
            Add Nested Item
          </Button>
        </div>
      )}
    </Card>
  );
}

export default FieldRow;
