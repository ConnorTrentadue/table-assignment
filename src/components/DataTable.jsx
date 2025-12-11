import { useMemo, useState } from "react";

export function DataTable({ data }) {
    const [columnOrder, setColumnOrder] = useState([
    'id',
    'firstName',
    'lastName',
    'fullName',
    'email',
    'city',
    'registeredDate',
    'dsr'
  ]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Define columns
  const columns = useMemo(
    () => ({
      id: { label: 'ID', width: 80 },
      firstName: { label: 'First Name', width: 120 },
      lastName: { label: 'Last Name', width: 120 },
      fullName: { label: 'Full Name', width: 180 },
      email: { label: 'Email', width: 250 },
      city: { label: 'City', width: 150 },
      registeredDate: { label: 'Registered Date', width: 150 },
      dsr: { label: 'DSR', width: 100 }
    }),
    []
  );

  // Get cell value including computed columns
  const getCellValue = (row, columnKey) => {
    switch (columnKey) {
      case 'fullName':
        return `${row.firstName} ${row.lastName}`;
      case 'dsr':
        const now = new Date();
        const registered = new Date(row.registeredDate);
        return Math.floor((now - registered) / (1000 * 60 * 60 * 24));
      case 'registeredDate':
        return new Date(row.registeredDate);
      default:
        return row[columnKey];
    }
  };

  // Format cell display
  const formatCell = (row, columnKey) => {
    const value = getCellValue(row, columnKey);
    
    if (columnKey === 'registeredDate') {
      return value.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    if (columnKey === 'dsr') {
      return `${value} days`;
    }
    
    return value;
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = getCellValue(a, sortConfig.key);
      const bValue = getCellValue(b, sortConfig.key);

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Handle column sort
  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Handle drag and drop
  const handleDragStart = (e, columnKey) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    
    if (draggedColumn && targetColumn && draggedColumn !== targetColumn) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetColumn);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);
      
      setColumnOrder(newOrder);
    }
    
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  return (
    <div style={{ 
      maxHeight: '700px', 
      overflow: 'auto', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead style={{ 
          position: 'sticky', 
          top: 0, 
          background: '#f5f5f5',
          zIndex: 10
        }}>
          <tr>
            {columnOrder.map((columnKey) => (
              <th
                key={columnKey}
                draggable
                onDragStart={(e) => handleDragStart(e, columnKey)}
                onDragOver={(e) => handleDragOver(e, columnKey)}
                onDrop={(e) => handleDrop(e, columnKey)}
                onDragEnd={handleDragEnd}
                style={{
                  padding: '12px 8px',
                  background: dragOverColumn === columnKey ? '#e3f2fd' : 
                             draggedColumn === columnKey ? '#e0e0e0' : '#f5f5f5',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd',
                  cursor: 'grab',
                  userSelect: 'none',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#999' }}>⋮⋮</span>
                  <span 
                    onClick={() => handleSort(columnKey)}
                    style={{ flex: 1, cursor: 'pointer' }}
                  >
                    {columns[columnKey].label}
                    {sortConfig.key === columnKey && (
                      <span>{sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'}</span>
                    )}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr 
              key={row.id}
              style={{ 
                background: idx % 2 === 0 ? '#fff' : '#fafafa',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0f7ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafafa'}
            >
              {columnOrder.map((columnKey) => (
                <td 
                  key={columnKey}
                  style={{ 
                    padding: '12px 8px', 
                    borderBottom: '1px solid #eee',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formatCell(row, columnKey)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}