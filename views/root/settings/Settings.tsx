import { Box, Button, Center, Divider, Switch, VStack } from 'native-base';
import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import appState from '../../../classes';
import { actions, selectors } from '../../../store/stateReducer';
import { useRequest } from '../../hooks';
import { StackNavigationRouteProps } from '../../type';
import { SettingsStackParamList } from './type';
import Modal from '../../components/Modal';
import ListItem from '../../components/ListItem';
import Error from '../../components/Error';

const updateMessage =
  'This action will erase all registered task lists and unschedule them, do you want to proceed?';

const Settings: FC<
  StackNavigationRouteProps<SettingsStackParamList, 'Settings'>
> = ({ navigation }) => {
  const settings = useSelector(selectors.selectSettings);
  const dispatch = useDispatch();
  const {
    error,
    loading,
    send: updt,
  } = useRequest(async () => {
    const { update } = await appState;
    return update();
  });

  const [modalOpen, setMoadlOpen] = useState<'apiUrl' | 'update' | null>();
  const closeModal = () => setMoadlOpen(null);
  const openModal = (name: typeof modalOpen) => setMoadlOpen(name);
  const isOpen = (name: typeof modalOpen) => name === modalOpen;

  const items = [
    <ListItem.Large
      key="api url"
      onPress={() => {
        openModal('apiUrl');
      }}
      main="Api url"
      sub={settings.apiUrl}
    />,
    <ListItem.Large
      key="stopOnError"
      main="Stop on error"
      sub="Whether or not ignore error during task list run"
    >
      <Switch
        isChecked={settings.stopTaskListOnError}
        onToggle={() => {
          dispatch(
            actions.updateSettings({
              ...settings,
              stopTaskListOnError: !settings.stopTaskListOnError,
            })
          );
        }}
      />
    </ListItem.Large>,
    <ListItem.Large key="version" main="Version" sub={settings.version} />,
  ];

  return (
    <VStack>
      <VStack flex={1} divider={<Divider />}>
        {items}
      </VStack>
      <Divider />
      <Button
        onPress={() => {
          navigation.navigate('Auth', {
            screen: 'Login',
          });
        }}
      >
        Set Login Info
      </Button>
      <Box>
        <Button
          isLoading={loading}
          onPress={() => {
            openModal('update');
          }}
        >
          Update
        </Button>
        <Center>
          <Error.ErrorText>{error}</Error.ErrorText>
        </Center>
      </Box>
      <Modal.ConfirmationModal
        dangerouse
        head="Are you sure?"
        onClose={closeModal}
        open={isOpen('update')}
        text={updateMessage}
        onConfirmation={(accepted) => {
          if (accepted) {
            updt();
          }
        }}
      />
      <Modal.InputModal
        open={isOpen('apiUrl')}
        defaultValue={settings.apiUrl}
        onClose={(text) => {
          closeModal();
          dispatch(actions.updateSettings({ ...settings, apiUrl: text }));
        }}
      />
    </VStack>
  );
};

export default Settings;
