import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import {NativeModules} from 'react-native';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
NativeModules.ImagePickerManager = {
    showImagePicker: jest.fn(),
    launchCamera: jest.fn(),
    launchImageLibrary: jest.fn(),
  }