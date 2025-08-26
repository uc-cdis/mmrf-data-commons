import React, { ReactNode } from "react";
import { ContextModalProps } from '@mantine/modals';
import { hideModal, useCoreDispatch } from "@gen3/core";
import { Button, Modal } from "@mantine/core";
import { theme } from "../../../tailwind.config";

interface ButtonOptions {
  onClick?: () => void;
  hideModalOnClick?: boolean;
  title: string;
  dataTestId: string;
}

const isNonNullRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isButtonOptions = (button: unknown): button is ButtonOptions => {
  if (!isNonNullRecord(button)) return false;
  return !!(typeof button === "object" && 'title' in button && button?.title);
};

interface Props {
  openModal: boolean;
  title: ReactNode;
  size?: string | number;
  children: ReactNode;
  buttons?: Array<ButtonOptions | JSX.Element>;
  withCloseButton?: boolean;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Base Modal component that can be used to create modals with custom buttons
 * @param openModal - boolean to open or close the modal
 * @param title - title of the modal
 * @param size - size of the modal
 * @param children - content of the modal
 * @param buttons - array of buttons to be rendered in the modal
 * @param withCloseButton - boolean to show or hide the close button
 * @param onClose - function to be called when the modal is closed
 * @param closeOnClickOutside - boolean to close the modal when clicked outside
 * @param closeOnEscape - boolean to close the modal when escape key is pressed
 *
 * @category Components
 */

export const BaseModal: React.FC<Props> = ({
  openModal,
  title,
  size,
  children,
  buttons,
  withCloseButton,
  onClose,
  closeOnClickOutside,
  closeOnEscape,
}: Props) => {
  const dispatch = useCoreDispatch();
  return (
    <Modal
      opened={openModal}
      title={title}
      zIndex={400}
      onClose={() => {
        dispatch(hideModal());
        if (onClose) {
          onClose();
        }
      }}
      styles={{
        header: {
          marginBottom: "5px",
        },
        close: {
          color: theme.extend.colors["gdc-grey"].darkest,
        },
      }}
      withCloseButton={withCloseButton ?? true}
      closeOnClickOutside={closeOnClickOutside ?? true}
      closeOnEscape={closeOnEscape ?? true}
      size={size && size}
    >
      {children}
      {buttons && (
        <div className="flex justify-end mt-2.5 gap-2">
          {buttons.map((button) => {
            if (isButtonOptions(button)) {
              const { onClick, title, hideModalOnClick, dataTestId } = button;

              return (
                <Button
                  data-testid={dataTestId}
                  key={title}
                  onClick={() => {
                    if (onClick) {
                      onClick();

                      if (hideModalOnClick) {
                        dispatch(hideModal());
                      }
                    } else {
                      dispatch(hideModal());
                    }
                  }}
                  className="!bg-primary hover:!bg-primary-darker"
                >
                  {title}
                </Button>
              );
            } else return button;
          })}
        </div>
      )}
    </Modal>
  );
};



export const BaseContextModal = ({
                     context,
                     id,
                     innerProps,
                   }: ContextModalProps<Props>) => {
                    const { children, buttons } = innerProps;
                      return (
                     <>
                       {children}
                       {buttons && (
                         <div className="flex justify-end mt-2.5 gap-2">
                           {buttons.map((button) => {
                             if (isButtonOptions(button)) {
                               const { onClick, title, hideModalOnClick, dataTestId } = button;

                               return (
                                 <Button
                                   data-testid={dataTestId}
                                   key={title}
                                   onClick={() => {
                                     if (onClick) {
                                       onClick();

                                       if (hideModalOnClick) {
                                         context.closeModal(id);
                                       }
                                     } else {
                                       context.closeModal(id);
                                     }
                                   }}
                                   className="!bg-primary hover:!bg-primary-darker"
                                 >
                                   {title}
                                 </Button>
                               );
                             } else return button;
                           })}
                         </div>)}
                     </>);}
