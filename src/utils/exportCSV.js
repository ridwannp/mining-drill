/**
 * Export blasting area data as CSV report.
 */
export const exportToCSV = (area) => {
  if (!area) return;

  const holes = Object.values(area.holes).sort((a, b) => {
    if (a.row !== b.row) return a.row.localeCompare(b.row);
    return a.col - b.col;
  });

  const headers = ['Hole ID', 'Row', 'Column', 'Depth (m)', 'Status', 'Notes', 'Updated At', 'Updated By'];

  const rows = holes.map((h) => [
    h.id,
    h.row,
    h.col,
    h.depth !== null ? h.depth : '',
    h.status,
    h.notes || '',
    h.updatedAt ? new Date(h.updatedAt).toLocaleString() : '',
    h.updatedBy || '',
  ]);

  const totalHoles = holes.length;
  const completed = holes.filter((h) => h.status === 'completed').length;
  const pending = holes.filter((h) => h.status === 'pending').length;
  const errored = holes.filter((h) => h.status === 'error').length;
  const empty = holes.filter((h) => h.status === 'empty').length;

  // Build CSV content
  const lines = [];

  // Header section
  lines.push('DRILL HOLE OPERATIONAL REPORT');
  lines.push(`Area Name,${area.name}`);
  lines.push(`Grid Size,${area.rows} rows x ${area.cols} columns`);
  lines.push(`Location,${area.location || 'N/A'}`);
  lines.push(`Operation Date,${area.date || 'N/A'}`);
  lines.push(`Generated At,${new Date().toLocaleString()}`);
  lines.push('');

  // Summary
  lines.push('SUMMARY');
  lines.push(`Total Holes,${totalHoles}`);
  lines.push(`Completed,${completed}`);
  lines.push(`Pending,${pending}`);
  lines.push(`Error,${errored}`);
  lines.push(`Empty,${empty}`);
  lines.push(`Completion,${totalHoles > 0 ? Math.round((completed / totalHoles) * 100) : 0}%`);
  lines.push('');

  // Data table
  lines.push(headers.join(','));
  rows.forEach((row) => {
    lines.push(row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','));
  });

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `DrillOps_${area.name.replace(/\s+/g, '_')}_${area.date || 'report'}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
