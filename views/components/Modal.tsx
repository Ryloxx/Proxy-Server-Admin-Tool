import { Button as Btn, Center, Input, Modal as Mod, Text } from 'native-base';
import React, { FC, useRef } from 'react';
import Button from './Button';

type WithFooterProps = {
  foot?: Element;
};
type WidthHeaderProps = {
  head?: string;
};
type WithCloseButtonProps = {
  closeButton?: boolean;
};
type WithSizeProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

interface ModalProps
  extends WithFooterProps,
    WidthHeaderProps,
    WithCloseButtonProps,
    WithSizeProps {
  open: boolean;
  onClose: (...any: any[]) => void;
}

interface InputModalProps
  extends Omit<
    ModalProps,
    | keyof WithCloseButtonProps
    | keyof WithFooterProps
    | keyof WithSizeProps
    | keyof WidthHeaderProps
  > {
  defaultValue: string;
  onClose: (result: string) => void;
}
interface ConfirmationModalProps
  extends Omit<
    ModalProps,
    keyof WithCloseButtonProps | keyof WithFooterProps | keyof WithSizeProps
  > {
  onClose: () => void;
  text: string;
  neutral?: boolean;
  dangerouse?: boolean;
  onConfirmation: (accepted: boolean) => void;
}

const Modal: FC<ModalProps> = ({
  children,
  onClose,
  open,
  foot,

  head,
  closeButton,
  size,
}) => (
  <Mod isOpen={open} onClose={onClose} size={size}>
    <Mod.Content>
      {!!closeButton && <Mod.CloseButton />}
      {!!head && <Mod.Header>{head}</Mod.Header>}
      <Mod.Body mt={2}>{children}</Mod.Body>
      {!!foot && <Mod.Footer>{foot}</Mod.Footer>}
    </Mod.Content>
  </Mod>
);

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  onClose,
  open,
  text,
  dangerouse,
  neutral,
  head = 'Confirm',
  onConfirmation,
}) => {
  const isNeutral = neutral && !dangerouse;
  const YesButton = dangerouse ? Button.Dangerouse : Button.Info;
  return (
    <Modal
      head={head}
      open={open}
      closeButton
      onClose={onClose}
      foot={
        <Btn.Group space={6} isAttached>
          <Button.Info
            onPress={() => {
              onClose();
              onConfirmation(false);
            }}
            shallow={!isNeutral}
          >
            No
          </Button.Info>

          <YesButton
            onPress={() => {
              onClose();
              onConfirmation(true);
            }}
          >
            Yes
          </YesButton>
        </Btn.Group>
      }
    >
      <Text>{text}</Text>
    </Modal>
  );
};

const InputModal: FC<InputModalProps> = ({ defaultValue, open, onClose }) => {
  const input = useRef(defaultValue);
  const close = (result: string) => {
    input.current = result;
    onClose(input.current);
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        close(defaultValue);
      }}
      foot={
        <Center>
          <Btn.Group isAttached>
            <Button.Info
              onPress={() => {
                close(defaultValue);
              }}
            >
              Cancel
            </Button.Info>
            <Button.Info
              onPress={() => {
                close(input.current);
              }}
            >
              Done
            </Button.Info>
          </Btn.Group>
        </Center>
      }
    >
      <Input
        variant="filled"
        defaultValue={input.current}
        onChangeText={(text) => {
          input.current = text;
        }}
      />
    </Modal>
  );
};

const Base = Modal;
export default { InputModal, ConfirmationModal, Base };
