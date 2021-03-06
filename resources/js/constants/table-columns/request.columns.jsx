export const requestListColumns = [
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
    title: 'Requested by',
    dataIndex: 'requested_by_username',
    sorter: {},
    isSearchField: true,
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
    title: 'Accepted by',
    dataIndex: 'accepted_by_username',
    sorter: {},
    isSearchField: false,
    isDate: false,
  },
  {
    title: 'Returned Date',
    dataIndex: 'returned_date',
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
