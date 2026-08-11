import { ChevronDown } from 'lucide-react';

function ToolbarButton({ item, disabled }) {
  const Icon = item.icon;
  const title = item.shortcut ? `${item.label} (${item.shortcut})` : item.label;

  return (
    <button
      type="button"
      onClick={item.onClick}
      disabled={disabled || item.isDisabled}
      title={title}
      aria-label={item.label}
      aria-pressed={item.isActive ? 'true' : 'false'}
      className={[
        'rte-toolbar-btn',
        item.isActive ? 'rte-toolbar-btn-active' : '',
      ].join(' ')}
    >
      <Icon size={16} strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
}

function ToolbarSelect({ item, disabled }) {
  const SelectIcon = item.icon;

  return (
    <div className="rte-toolbar-select-wrap">
      {SelectIcon && (
        <SelectIcon size={14} className="rte-toolbar-select-icon" aria-hidden="true" />
      )}
      <select
        value={item.value}
        onChange={(event) => item.onChange(event.target.value)}
        disabled={disabled}
        aria-label={item.label}
        className="rte-toolbar-select"
      >
        {item.options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="rte-toolbar-select-chevron" aria-hidden="true" />
    </div>
  );
}

function ToolbarColorPicker({ item, disabled }) {
  return (
    <label
      className={[
        'rte-toolbar-color',
        item.isActive ? 'rte-toolbar-btn-active' : '',
      ].join(' ')}
      title={item.label}
    >
      <span className="sr-only">{item.label}</span>
      <input
        type="color"
        value={item.value}
        disabled={disabled}
        onChange={(event) => item.onChange(event.target.value)}
        className="rte-toolbar-color-input"
      />
      <span
        className="rte-toolbar-color-swatch"
        style={{ backgroundColor: item.value }}
        aria-hidden="true"
      />
    </label>
  );
}

function ToolbarItem({ item, disabled }) {
  switch (item.type) {
    case 'button':
      return <ToolbarButton item={item} disabled={disabled} />;
    case 'select':
      return <ToolbarSelect item={item} disabled={disabled} />;
    case 'color':
      return <ToolbarColorPicker item={item} disabled={disabled} />;
    default:
      return null;
  }
}

function ToolbarGroup({ group, disabled, showDivider }) {
  return (
    <>
      {showDivider && <div className="rte-toolbar-divider" role="separator" />}
      <div className="rte-toolbar-group" role="group" aria-label={group.id}>
        {group.items.map((item) => (
          <ToolbarItem key={item.id} item={item} disabled={disabled} />
        ))}
      </div>
    </>
  );
}

/**
 * Reusable rich-text toolbar — presentation only.
 * Pass `groups` from `useEditorToolbar(editor)` to keep logic separate.
 */
export default function EditorToolbar({ groups = [], disabled = false, className = '' }) {
  if (!groups.length) return null;

  return (
    <div
      className={['rte-toolbar', className].filter(Boolean).join(' ')}
      role="toolbar"
      aria-label="Text formatting"
    >
      <div className="rte-toolbar-scroll">
        {groups.map((group, index) => (
          <ToolbarGroup
            key={group.id}
            group={group}
            disabled={disabled}
            showDivider={index > 0}
          />
        ))}
      </div>
    </div>
  );
}
