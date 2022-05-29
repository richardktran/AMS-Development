export const assignmentListColumns = [
  {
    title: 'No',
    dataIndex: 'id',
    sorter: {},
    defaultSortOrder: 'ascend',
    isSearchField: false,
    isDate: false,
  },
  {
    title: 'Asset code',
    dataIndex: 'asset_code',
    sorter: {},
    isSearchField: true,
    isDate: false,
  },
  {
    title: 'Asset name',
    dataIndex: 'asset_name',
    sorter: {},
    isSearchField: true,
    isDate: false,
  },
  {
    title: 'Assigned to',
    dataIndex: 'to_username',
    sorter: {},
    isSearchField: true,
    isDate: false,
  },
  {
    title: 'Assigned by',
    dataIndex: 'by_username',
    sorter: {},
    isSearchField: false,
    isDate: false,
  },
  {
    title: 'Assigned Date',
    dataIndex: 'assign_date',
    sorter: {},
    isSearchField: false,
    isDate: true,
  },
  {
    title: 'State',
    dataIndex: 'state_name',
    sorter: {},
    isSearchField: false,
    isDate: false,
  },
]

export const assignmentUserColumns = [
  {
    title: 'Staff code',
    dataIndex: 'staff_code',
    sorter: {},
    defaultSortOrder: 'descend',
    isSearchField: true,
    isDate: false,
  },
  {
    title: 'Full Name',
    dataIndex: 'full_name',
    sorter: {},
    isSearchField: true,
    isDate: false,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    sorter: {},
    isSearchField: false,
    isDate: false,
  },
]

export const assignmentAssetColumns = [
  {
    title: 'Asset code',
    dataIndex: 'asset_code',
    sorter: {},
    defaultSortOrder: 'descend',
    isSearchField: true,
    isDate: false,
  },
  {
    title: 'Asset Name',
    dataIndex: 'asset_name',
    sorter: {},
    isSearchField: true,
    isDate: false,
  },
  {
    title: 'Category',
    dataIndex: 'category_name',
    sorter: {},
    isSearchField: false,
    isDate: false,
  },
]
