import { useEffect, useRef } from 'react';
import { Modal, InputNumber, Input, Button, Form, Tag } from 'antd';
import useDrillStore from '../store/useDrillStore';
import { useActiveArea } from '../hooks/useDrillSelectors';

/**
 * Modal for inputting drill hole depth measurement.
 * On mobile, renders as a bottom sheet.
 */
const HoleModal = () => {
  const selectedHoleId = useDrillStore((s) => s.selectedHoleId);
  const selectHole = useDrillStore((s) => s.selectHole);
  const saveHoleMeasurement = useDrillStore((s) => s.saveHoleMeasurement);
  const resetHole = useDrillStore((s) => s.resetHole);
  const area = useActiveArea();

  const [form] = Form.useForm();
  const depthRef = useRef(null);
  const hole = area && selectedHoleId ? area.holes[selectedHoleId] : null;
  const isOpen = !!hole;

  useEffect(() => {
    if (hole) {
      form.setFieldsValue({
        depth: hole.depth,
        notes: hole.notes || '',
      });
      // Auto-focus depth input
      setTimeout(() => {
        depthRef.current?.focus();
      }, 200);
    }
  }, [hole, form]);

  const handleSave = () => {
    const values = form.getFieldsValue();
    saveHoleMeasurement(selectedHoleId, {
      depth: values.depth,
      notes: values.notes || '',
    });
  };

  const handleReset = () => {
    resetHole(selectedHoleId);
    selectHole(null);
  };

  const handleClose = () => {
    selectHole(null);
  };

  const statusColors = {
    empty: { color: '#475569', label: 'Empty' },
    completed: { color: '#10b981', label: 'Completed' },
    pending: { color: '#eab308', label: 'Pending Sync' },
    error: { color: '#ef4444', label: 'Error' },
  };

  const statusInfo = hole ? statusColors[hole.status] || statusColors.empty : statusColors.empty;

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <span className="text-lg font-bold text-amber-400">{hole?.id}</span>
          </div>
          <div>
            <span className="text-slate-100 font-semibold">Hole {hole?.id}</span>
            <div className="mt-0.5">
              <Tag color={statusInfo.color} style={{ margin: 0, fontSize: 11 }}>
                {statusInfo.label}
              </Tag>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <Button
            id="btn-hole-reset"
            danger
            type="text"
            onClick={handleReset}
            disabled={hole?.status === 'empty'}
          >
            Reset Hole
          </Button>
          <div className="flex gap-2">
            <Button id="btn-hole-cancel" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              id="btn-hole-save"
              type="primary"
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                borderColor: 'transparent',
                fontWeight: 600,
              }}
            >
              Save Measurement
            </Button>
          </div>
        </div>
      }
      width={420}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" className="mt-2">
        {/* Depth input — the most important field */}
        <Form.Item
          name="depth"
          label={
            <span className="text-slate-300 font-medium">
              Depth Measurement (meters)
            </span>
          }
        >
          <InputNumber
            ref={depthRef}
            id="input-depth"
            placeholder="Enter depth in meters"
            min={0}
            max={100}
            step={0.1}
            precision={1}
            size="large"
            style={{ width: '100%', height: 48 }}
            addonAfter={<span className="text-slate-400">m</span>}
          />
        </Form.Item>

        {/* Notes */}
        <Form.Item
          name="notes"
          label={
            <span className="text-slate-300 font-medium">
              Notes <span className="text-slate-600">(optional)</span>
            </span>
          }
        >
          <Input.TextArea
            id="input-notes"
            placeholder="Add any notes about this hole..."
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        {/* Last update info */}
        {hole?.updatedAt && (
          <div className="rounded-lg bg-slate-900/50 px-3 py-2 border border-slate-700/50">
            <p className="text-[11px] text-slate-500">
              Last updated: {new Date(hole.updatedAt).toLocaleString()}
            </p>
            {hole.updatedBy && (
              <p className="text-[11px] text-slate-500">
                By: {hole.updatedBy}
              </p>
            )}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default HoleModal;
