import { useState } from 'react';
import { Modal, Input, InputNumber, DatePicker, Form, Button } from 'antd';
import useDrillStore from '../store/useDrillStore';

/**
 * Modal to create a new blasting area with row/col configuration.
 */
const CreateAreaModal = ({ open, onClose }) => {
  const createArea = useDrillStore((s) => s.createArea);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      createArea({
        name: values.name.trim(),
        rows: values.rows,
        cols: values.cols,
        location: values.location?.trim() || '',
        date: values.date ? values.date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
      });

      form.resetFields();
      onClose();
    } catch (err) {
      // Validation failed
    } finally {
      setLoading(false);
    }
  };

  // Preview
  const rows = Form.useWatch('rows', form);
  const cols = Form.useWatch('cols', form);
  const previewTotal = (rows || 0) * (cols || 0);
  const previewFirstId = rows && cols ? 'A1' : '—';
  const previewLastId =
    rows && cols
      ? `${String.fromCharCode(64 + Math.min(rows, 26))}${cols}`
      : '—';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span>Create Blasting Area</span>
        </div>
      }
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button onClick={onClose} className="!w-full sm:!w-auto">Cancel</Button>
          <Button
            id="btn-confirm-create"
            type="primary"
            loading={loading}
            onClick={handleCreate}
            className="!w-full sm:!w-auto"
            style={{
              background: 'linear-gradient(135deg, #d97706, #f59e0b)',
              borderColor: 'transparent',
              fontWeight: 600,
            }}
          >
            Create Area
          </Button>
        </div>
      }
      width="95%"
      style={{ maxWidth: '1200px' }}
      wrapClassName="responsive-modal-wrap"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-1 md:mt-3">
        {/* Left Side: Form */}
        <div className="flex-1">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ rows: 4, cols: 4 }}
          >
            <Form.Item
              name="name"
              label={<span className="text-slate-300 font-medium">Area Name</span>}
              rules={[{ required: true, message: 'Please enter the area name' }]}
            >
              <Input
                id="input-area-name"
                placeholder="e.g. Pit West Block A"
                size="large"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="rows"
                label={<span className="text-slate-300 font-medium">Rows (A–Z)</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  id="input-rows"
                  min={1}
                  max={26}
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="e.g. 4"
                />
              </Form.Item>
              <Form.Item
                name="cols"
                label={<span className="text-slate-300 font-medium">Columns (1–N)</span>}
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  id="input-cols"
                  min={1}
                  max={50}
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="e.g. 4"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="location"
              label={<span className="text-slate-300 font-medium">Location <span className="text-slate-600">(optional)</span></span>}
            >
              <Input
                id="input-location"
                placeholder="e.g. Pit West, Block A, Level 2"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="date"
              label={<span className="text-slate-300 font-medium">Operation Date <span className="text-slate-600">(optional)</span></span>}
            >
              <DatePicker
                id="input-date"
                size="large"
                style={{ width: '100%' }}
                placeholder="Select date"
              />
            </Form.Item>
          </Form>
        </div>

        {/* Right Side: Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider m-0">Grid Preview</h3>
              <div className="text-xs text-slate-500 font-medium">
                Total: <span className="text-amber-400 font-bold">{previewTotal}</span> holes
              </div>
            </div>

            {previewTotal > 0 ? (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '250px' }}>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {Array.from({ length: rows || 0 }, (_, r) => {
                    const rowLabel = String.fromCharCode(65 + r);
                    return (
                      <div key={rowLabel} className="relative pl-6 sm:pl-8 py-1 border-b border-slate-800/50 last:border-0">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 font-bold text-slate-500 text-sm">
                          {rowLabel}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: cols || 0 }, (_, c) => {
                            const id = `${rowLabel}${c + 1}`;
                            return (
                              <div
                                key={id}
                                className="hole-card hole-card--empty !min-h-[40px] sm:!min-h-[50px] !w-[40px] sm:!w-[50px] !p-1"
                              >
                                <span className="text-xs font-bold text-slate-300 leading-none">{id}</span>
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 leading-none mt-1">Empty</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
                Enter rows and columns to see preview
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAreaModal;
