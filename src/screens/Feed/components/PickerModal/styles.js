import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { isX, paddingX } from 'kitsu/utils/isX';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';

export const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Height is different for android because the modal doesn't cover the status bar
    // If it does in the future then the height would be the nav bar height + Status bar height
    height: navigationBarHeight + (isX ? paddingX : 0) + Platform.select({
      ios: statusBarHeight,
      android: 0,
    }),
    paddingTop: Platform.select({ ios: statusBarHeight, android: 0 }) + (isX ? paddingX : 0),
    backgroundColor: colors.listBackPurple,
  },
  modalButton: {
    flex: 1,
  },
  modalRightButton: {
    alignItems: 'flex-end',
  },
  modalTitle: {
    flex: 2,
    alignItems: 'center',
  },

  pickerRow: {
    backgroundColor: '#FFFFFF',
    padding: scenePadding,
  },

  pickerIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerIconCircle__isPicked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },

  pickerIcon: {
    fontSize: 28,
    backgroundColor: 'transparent',
    paddingTop: 4,
  },

  rowPickerSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGrey,
  },
});
