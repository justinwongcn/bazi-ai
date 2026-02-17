export const TableStyles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '0 0 15px 15px'
  },
  scrollWrapper: {
    padding: 0
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    tableLayout: 'fixed' as const
  },
  col: {
    width: 124
  },
  colAlt: {
    width: 124
  },
  headerRow: {
    backgroundColor: 'white'
  },
  headerCell: {
    height: 52,
    textAlign: 'center' as const,
    fontSize: 14,
    color: 'rgb(161, 161, 161)',
    fontWeight: 500,
    backgroundColor: 'white'
  },
  bodyCell: {
    padding: '5px 0',
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const
  },
  pillarCell: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center'
  },
  pillarText: {
    fontSize: 28,
    fontWeight: 700
  },
  icon: {
    width: 28,
    height: 28
  }
} as const;

export const InfoCardStyles = {
  container: {
    maxWidth: 1170,
    margin: '0 auto',
    padding: '24px 13px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  name: {
    fontSize: 30,
    fontWeight: 600,
    color: 'rgb(178, 149, 93)'
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginTop: 4
  },
  infoHighlight: {
    color: 'rgb(178, 149, 93)'
  },
  tabsWrapper: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap' as const
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    backgroundColor: 'white',
    borderRadius: 10,
    cursor: 'pointer',
    border: '1px solid rgb(242, 242, 242)'
  },
  tabActive: {
    border: '1px solid rgb(178, 149, 93)',
    backgroundColor: 'rgba(178, 149, 93, 0.08)'
  },
  tabText: {
    fontSize: 14,
    color: 'rgb(68, 68, 68)'
  }
} as const;
