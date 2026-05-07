import { useState } from 'react';
import { Box, TextInput, UnstyledButton } from '@mantine/core';
import { useFujinTheme } from '../components/FujinThemeProvider';
import { ToolShell } from '../components/ToolShell';
import { SectionHeader } from '../components/SectionHeader';
import { DataCard } from '../components/DataCard';
import { StatusBadge } from '../components/StatusBadge';
import { ActionMenu } from '../components/ActionMenu';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { FormShell } from '../components/FormShell';
import { DataTable } from '../components/DataTable';
import { useToast } from '../components/FujinToastProvider';
import tokens from '../tokens.json';

export function App() {
  const { toggle } = useFujinTheme();
  const { show } = useToast();

  const [step1Valid, setStep1Valid] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [jobName, setJobName] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(undefined);
    setTimeout(() => {
      setFormLoading(false);
      setFormError('Mock server error: Unable to create job.');
    }, 1500);
  };

  const tableRows = Array.from({ length: 8 }).map((_, i) => ({
    id: `JOB-${1000 + i}`,
    name: `Data Sync ${i + 1}`,
    status: ['success', 'danger', 'warning', 'info', 'neutral'][i % 5] as any,
    duration: `${(Math.random() * 10).toFixed(1)}m`,
    created: new Date(Date.now() - i * 10000000).toISOString().split('T')[0],
  }));

  const plainBtnStyle: React.CSSProperties = {
    color: 'var(--fujin-text-primary)',
    fontFamily: tokens.typography.fontFamily.base,
    fontSize: tokens.typography.fontSize.sm,
    cursor: 'pointer',
  };

  return (
    <ToolShell
      logo={<span style={{ fontWeight: tokens.typography.fontWeight.bold, color: 'var(--fujin-text-primary)' }}>Fujin UI</span>}
      navItems={[
        { label: 'Dashboard', icon: '⊞', active: true },
        { label: 'Reports', icon: '≡' },
        { label: 'Settings', icon: '⚙' },
      ]}
      footer={
        <UnstyledButton onClick={toggle} style={plainBtnStyle}>
          Toggle Theme
        </UnstyledButton>
      }
      header={({ toggleMobile, mobileOpen }) => (
        <UnstyledButton
          onClick={toggleMobile}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        tokens.spacing.scale.xs,
            color:      'var(--fujin-text-secondary)',
            fontFamily: tokens.typography.fontFamily.base,
            fontSize:   tokens.typography.fontSize.lg,
            padding:    `0 ${tokens.spacing.scale.sm}px`,
            cursor:     'pointer',
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </UnstyledButton>
      )}
    >
      <Box style={{ padding: tokens.spacing.scale.xl, display: 'flex', flexDirection: 'column', gap: tokens.spacing.scale.xl }}>
        
        {/* Section 1 */}
        <Box>
          <SectionHeader 
            title="Active Jobs" 
            description="Showing last 24h" 
            action={<UnstyledButton style={plainBtnStyle}>+ New</UnstyledButton>} 
          />
          <Box style={{ marginTop: tokens.spacing.scale.md }}>
            <DataCard
              title="Job #1042"
              badge={<StatusBadge status="success" label="Running" />}
              detail={
                <span style={{ color: 'var(--fujin-text-secondary)', fontSize: tokens.typography.fontSize.sm, fontFamily: tokens.typography.fontFamily.base }}>
                  This is a secondary description providing more detailed information about the job execution, including parameters and environment variables used during the run.
                </span>
              }
              actions={[
                { label: 'Restart', onClick: () => {} },
                { label: 'Logs', onClick: () => {} },
                { label: 'Edit', onClick: () => {} },
                { label: 'Delete', danger: true, onClick: () => {} },
              ]}
            >
              <div style={{ color: 'var(--fujin-text-primary)', fontSize: tokens.typography.fontSize.sm, fontFamily: tokens.typography.fontFamily.base }}>
                <strong>Target:</strong> Production DB<br />
                <strong>Rows Processed:</strong> 1,240,500
              </div>
            </DataCard>
          </Box>
        </Box>

        {/* Section 2 */}
        <Box>
          <SectionHeader title="Status Badges" />
          <Box style={{ marginTop: tokens.spacing.scale.md, display: 'flex', gap: tokens.spacing.scale.sm }}>
            <StatusBadge status="success" label="Success" />
            <StatusBadge status="danger" label="Danger" />
            <StatusBadge status="warning" label="Warning" />
            <StatusBadge status="info" label="Info" />
            <StatusBadge status="neutral" label="Neutral" />
          </Box>
        </Box>

        {/* Section 3 */}
        <Box>
          <SectionHeader title="Action Menu" />
          <Box style={{ marginTop: tokens.spacing.scale.md }}>
            <ActionMenu 
              items={[
                { label: 'Edit', onClick: () => {} },
                { label: 'Duplicate', onClick: () => {} },
                { label: 'Delete', danger: true, onClick: () => {} },
              ]} 
            />
          </Box>
        </Box>

        {/* Section 4 */}
        <Box>
          <SectionHeader title="Workflow Stepper" />
          <Box style={{ marginTop: tokens.spacing.scale.md }}>
            <WorkflowStepper
              steps={[
                {
                  label: 'Validation',
                  description: 'Check preconditions',
                  content: (
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.scale.sm }}>
                      <span style={{ color: 'var(--fujin-text-primary)', fontSize: tokens.typography.fontSize.sm, fontFamily: tokens.typography.fontFamily.base }}>Validate settings to proceed.</span>
                      <UnstyledButton 
                        onClick={() => setStep1Valid(!step1Valid)}
                        style={{
                          ...plainBtnStyle,
                          padding: `${tokens.spacing.scale.xs}px ${tokens.spacing.scale.sm}px`,
                          border: '1px solid var(--fujin-border-subtle)',
                          borderRadius: tokens.radius.default,
                          background: step1Valid ? 'var(--fujin-interactive-default)' : 'var(--fujin-bg-surface)',
                          width: 'fit-content'
                        }}
                      >
                        {step1Valid ? 'Valid (Click to invalidate)' : 'Invalid (Click to validate)'}
                      </UnstyledButton>
                    </Box>
                  ),
                  validate: () => step1Valid || 'Validation failed. Please toggle the button.',
                },
                {
                  label: 'Configuration',
                  content: <span style={{ color: 'var(--fujin-text-primary)', fontSize: tokens.typography.fontSize.sm, fontFamily: tokens.typography.fontFamily.base }}>Configure your options here.</span>,
                },
                {
                  label: 'Confirmation',
                  content: <span style={{ color: 'var(--fujin-text-primary)', fontSize: tokens.typography.fontSize.sm, fontFamily: tokens.typography.fontFamily.base }}>Review and finalize.</span>,
                }
              ]}
            />
          </Box>
        </Box>

        {/* Section 5 */}
        <Box>
          <SectionHeader title="Form Shell" />
          <Box style={{ marginTop: tokens.spacing.scale.md, maxWidth: 400 }}>
            <FormShell 
              onSubmit={handleFormSubmit}
              loading={formLoading}
              error={formError}
              submitLabel="Create Job"
              actions={<UnstyledButton style={plainBtnStyle}>Cancel</UnstyledButton>}
            >
              <TextInput 
                label="Job Name" 
                placeholder="Enter job name"
                radius={tokens.radius.default}
                value={jobName}
                onChange={(e) => setJobName(e.currentTarget.value)}
                disabled={formLoading}
                styles={{
                  input: {
                    borderRadius: tokens.radius.default,
                    border: '1px solid var(--fujin-border-subtle)',
                    background: 'var(--fujin-bg-base)',
                    color: 'var(--fujin-text-primary)',
                    fontFamily: tokens.typography.fontFamily.base,
                    fontSize: tokens.typography.fontSize.sm,
                  },
                  label: {
                    color: 'var(--fujin-text-secondary)',
                    fontFamily: tokens.typography.fontFamily.base,
                    fontSize: tokens.typography.fontSize.xs,
                    fontWeight: tokens.typography.fontWeight.medium,
                    marginBottom: tokens.spacing.base
                  }
                }}
              />
            </FormShell>
          </Box>
        </Box>

        {/* Section 6 */}
        <Box>
          <SectionHeader title="Data Table" />
          <Box style={{ marginTop: tokens.spacing.scale.md }}>
            <DataTable
              columns={[
                { key: 'id', label: 'ID', sortable: true },
                { key: 'name', label: 'Name', sortable: true },
                { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} label={r.status} /> },
                { key: 'duration', label: 'Duration' },
                { key: 'created', label: 'Created', sortable: true },
              ]}
              rows={tableRows}
              rowKey="id"
              pageSize={5}
              rowActions={(r) => (
                <ActionMenu 
                  items={[
                    { label: 'Edit', onClick: () => {} },
                    { label: 'Duplicate', onClick: () => {} },
                    { label: 'Delete', danger: true, onClick: () => {} },
                  ]} 
                />
              )}
            />
          </Box>
        </Box>

        {/* Section 7 — Toast */}
        <Box>
          <SectionHeader title="Toast Notifications" />
          <Box style={{ marginTop: tokens.spacing.scale.md, display: 'flex', gap: tokens.spacing.scale.sm, flexWrap: 'wrap' }}>
            {(['success', 'info', 'warning', 'danger'] as const).map((status) => (
              <UnstyledButton
                key={status}
                onClick={() => show({
                  status,
                  title:   status.charAt(0).toUpperCase() + status.slice(1),
                  message: `This is a ${status} notification.`,
                })}
                style={{
                  fontFamily:   tokens.typography.fontFamily.base,
                  fontSize:     tokens.typography.fontSize.sm,
                  color:        'var(--fujin-text-primary)',
                  padding:      `${tokens.spacing.scale.xs}px ${tokens.spacing.scale.sm}px`,
                  border:       `1px solid var(--fujin-border-subtle)`,
                  borderRadius: tokens.radius.default,
                  cursor:       'pointer',
                  background:   'transparent',
                }}
              >
                {status}
              </UnstyledButton>
            ))}
            <UnstyledButton
              onClick={() => show({
                status:   'info',
                message:  'This toast persists until dismissed.',
                duration: false,
              })}
              style={{
                fontFamily:   tokens.typography.fontFamily.base,
                fontSize:     tokens.typography.fontSize.sm,
                color:        'var(--fujin-text-muted)',
                padding:      `${tokens.spacing.scale.xs}px ${tokens.spacing.scale.sm}px`,
                border:       `1px solid var(--fujin-border-subtle)`,
                borderRadius: tokens.radius.default,
                cursor:       'pointer',
                background:   'transparent',
              }}
            >
              persistent
            </UnstyledButton>
          </Box>
        </Box>

      </Box>
    </ToolShell>
  );
}
