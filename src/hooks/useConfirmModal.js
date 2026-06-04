import { App } from 'antd';

/**
 * Hook untuk menampilkan modal konfirmasi Ant Design (menggantikan window.confirm).
 */
export function useConfirmModal() {
  const { modal } = App.useApp();

  const confirm = ({
    title,
    content,
    okText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    onOk,
  }) => {
    modal.confirm({
      title,
      content,
      okText,
      cancelText,
      centered: true,
      width: {
        xs: '100%',
        sm: '100%',
        md: 480,
      },
      rootClassName: 'confirm-modal-root',
      wrapClassName: 'confirm-modal-wrap',
      okButtonProps: danger ? { danger: true } : undefined,
      onOk,
    });
  };

  return { confirm };
}
