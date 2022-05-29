import { assetIds, assignmentIds } from './id.constants'

const {
  ASSET_INPUT_NAME,
  ASSET_SELECT_ASSET_CATEGORY,
  ASSET_TEXTAREA_ASSET_SPECIFICATION,
  ASSET_DATEPICKER_ASSET_INSTALLED_DATE,
  ASSET_RADIOGROUP_ASSET_STATE,
} = assetIds

const {
  ASSIGNMENT_INPUT_SEARCH_USER,
  ASSIGNMENT_INPUT_SEARCH_ASSET,
  ASSIGNMENT_DATEPICKER_ASSIGNED_DATE,
  ASSIGNMENT_TEXTAREA_NOTE,
} = assignmentIds

export const dataFormItemUser = [
  {
    type: 'input',
    name: 'First Name',
    error: 'first_name',
  },
  {
    type: 'input',
    name: 'Last Name',
    error: 'last_name',
  },
  {
    type: 'date',
    name: 'Date Of Birth',
    error: 'birthday',
  },
  {
    type: 'radio',
    name: 'Gender',
    error: 'gender',
  },
  {
    type: 'date',
    name: 'Joined Date',
    error: 'joined_date',
  },
  {
    type: 'select',
    name: 'Role Id',
    error: 'role_id',
  },
]

export const dataFormItemAssignment = [
  {
    label: 'User',
    type: 'assignment_input_search',
    name: 'assigned_to',
    id: ASSIGNMENT_INPUT_SEARCH_USER,
    placeholder: 'search user',
  },
  {
    label: 'Asset',
    type: 'assignment_input_search',
    name: 'asset_id',
    id: ASSIGNMENT_INPUT_SEARCH_ASSET,
    placeholder: 'search asset',
  },
  {
    label: 'Assigned Date',
    type: 'date',
    name: 'assign_date',
    id: ASSIGNMENT_DATEPICKER_ASSIGNED_DATE,
    placeholder: 'choose assigned date',
  },
  {
    label: 'Note',
    type: 'textarea',
    name: 'assign_note',
    id: ASSIGNMENT_TEXTAREA_NOTE,
    placeholder: 'input note',
  },
]

const assetRadioList = [
  { label: 'Available', value: 'AVAILABLE', isShowInCreate: true },
  { label: 'Not Available', value: 'NOT_AVAILABLE', isShowInCreate: true },
  {
    label: 'Waiting for recycling',
    value: 'WAITING_FOR_RECYCLING',
    isShowInCreate: false,
  },
  {
    label: 'Recycled',
    value: 'RECYCLED',
    isShowInCreate: false,
  },
]

export const dataFormItemAsset = [
  {
    type: 'input',
    label: 'Name',
    name: 'asset_name',
    id: ASSET_INPUT_NAME,
    placeholder: 'input asset name',
  },
  {
    type: 'asset_select',
    label: 'Category',
    name: 'category',
    id: ASSET_SELECT_ASSET_CATEGORY,
    placeholder: 'select asset category',
  },
  {
    type: 'textarea',
    label: 'Specification',
    name: 'specific',
    id: ASSET_TEXTAREA_ASSET_SPECIFICATION,
    placeholder: 'input asset specification',
  },
  {
    type: 'date',
    label: 'Installed Date',
    name: 'installed_date',
    id: ASSET_DATEPICKER_ASSET_INSTALLED_DATE,
    placeholder: 'choose installed date',
  },
  {
    type: 'radio',
    label: 'State',
    name: 'state',
    id: ASSET_RADIOGROUP_ASSET_STATE,
    placeholder: 'choose asset state',
    radioList: assetRadioList,
  },
]
