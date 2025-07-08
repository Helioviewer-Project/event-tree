# Helioviewer Event Tree

A React component for displaying and managing hierarchical solar event data from various sources (HEK, CCMC, RHESSI, etc.). This component provides an interactive tree interface with checkboxes for selecting events and fetches data from the Helioviewer API.

## Installation

```bash
npm install @helioviewer/event-tree
```

## Quick Start

For a complete working example, see the [React example project](./examples/react/) which demonstrates how to integrate the component into a React application with Vite.

## Usage

### Basic Example

```jsx
import React, { useState } from 'react';
import HelioviewerEventTree from '@helioviewer/event-tree';

function App() {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [hoveredEvents, setHoveredEvents] = useState([]);

  const handleEventsUpdate = (events) => {
    setSelectedEvents(events);
    console.log('Selected events:', events);
  };

  const handleHoveredEventsUpdate = (eventIds) => {
    setHoveredEvents(eventIds);
    console.log('Hovered events:', eventIds);
  };

  return (
    <div>
      <HelioviewerEventTree
        source="HEK"
        eventsDate={new Date()}
        onEventsUpdate={handleEventsUpdate}
        onHoveredEventsUpdate={handleHoveredEventsUpdate}
      />
    </div>
  );
}
```

### Advanced Example with All Props

```jsx
import React, { useState } from 'react';
import HelioviewerEventTree from '@helioviewer/event-tree';

function AdvancedExample() {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [hoveredEvents, setHoveredEvents] = useState([]);
  const [selections, setSelections] = useState(null);
  const [visibility, setVisibility] = useState(true);
  const [labelVisibility, setLabelVisibility] = useState(true);

  return (
    <HelioviewerEventTree
      source="HEK"
      eventsDate={new Date('2023-01-01')}
      onEventsUpdate={setSelectedEvents}
      onHoveredEventsUpdate={setHoveredEvents}
      onSelectionsUpdate={(selections, events) => {
        console.log('Selections changed:', selections, events);
      }}
      visibility={visibility}
      labelVisibility={labelVisibility}
      onToggleVisibility={() => setVisibility(!visibility)}
      onToggleLabelVisibility={() => setLabelVisibility(!labelVisibility)}
      forcedSelections={selections}
      onLoad={() => console.log('Component loaded')}
      onError={(error) => console.error('Error loading events:', error)}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `source` | `string` | ✓ | - | Event source identifier (e.g., "HEK", "CCMC", "RHESSI") |
| `eventsDate` | `Date` | ✓ | - | Date for which to fetch events |
| `onEventsUpdate` | `function` | ✓ | - | Callback when selected events change `(events) => void` |
| `onHoveredEventsUpdate` | `function` | ✓ | - | Callback when hovered events change `(eventIds) => void` |
| `onSelectionsUpdate` | `function` | ✗ | `null` | Callback when selections change `(selections, events) => void` |
| `visibility` | `boolean` | ✗ | `true` | Initial value to control events visibility |
| `labelVisibility` | `boolean` | ✗ | `true` | Initial value to control events label visibility |
| `onToggleVisibility` | `function` | ✗ | `null` | Callback to handle visibility changes for selected events |
| `onToggleLabelVisibility` | `function` | ✗ | `null` | Callback to handle label visibility changes for selected events |
| `forcedSelections` | `array` | ✗ | `null` | Initial selections |
| `apiURL` | `string` | ✗ | `"https://api.helioviewer.org"` | Helioviewer API base URL |
| `onLoad` | `function` | ✗ | `null` | Callback executed when the component loads |
| `onError` | `function` | ✗ | `console.error` | Callback to handle if any errors occurred, `(error) => void` |

## Event Data Structure

Selected events returned by `onEventsUpdate` have the following structure:

```javascript
{
  event_data: {
    // Original event data from API
    id: "event_id",
    label: "Event Label",
    short_label: "Short Label",
    // ... other event properties
    // Please see https://api.helioviewer.org/docs/v2/api/api_groups/solar_features_and_events.html for more information 
  },
  label: "Display Label",
  id: "tree_node_id"
}
```

## Features

### Hierarchical Selection
- Selecting a parent node selects all its children
- Mixed selections show an "undecided" state
- Three-state checkboxes: checked, unchecked, undecided

### Expand/Collapse
- Tree nodes can be expanded/collapsed to show/hide children
- Expansion state is maintained during selection changes

### Empty Branch Filtering
- Option to show/hide branches that contain no events
- Controlled via the UI toggle in the source header

### Persistent State
- User selections and preferences are automatically saved to localStorage
- State is restored when the component remounts with the same source

### Hover Events
- Provides hover feedback for event highlighting
- Useful for coordinating with other visualization components

## API Integration

The component fetches data from the Helioviewer API using the following endpoint format:
```
{apiURL}?startTime={ISO_DATE}&action=events&sources={SOURCE}
```

### API Configuration

You need to configure the API URL for your specific deployment. You can use the public Helioviewer API or your own instance:

**Option 1: Public API (with CORS setup required)**
- Use `apiURL="https://api.helioviewer.org"`
- **Important**: Contact the Helioviewer team to whitelist your domain for CORS, otherwise you'll encounter CORS errors

**Option 2: Local/Custom API**
- Point to your own Helioviewer API instance
- Example: `apiURL="http://your-api-server.com:8081"`

```jsx
<HelioviewerEventTree
  source="HEK"
  eventsDate={new Date()}
  onEventsUpdate={handleEventsUpdate}
  onHoveredEventsUpdate={handleHoveredEventsUpdate}
  apiURL="https://api.helioviewer.org"  // Configure as needed
/>
```

Expected API response structure:
```javascript
[
  {
    name: "Source Name",
    groups: [
      {
        name: "Group Name",
        groups: [...] // Nested groups
      },
      {
        name: "Event Group",
        data: [
          {
            id: "event_id",
            label: "Event Label",
            short_label: "Short Label",
            // ... other event properties
          }
        ]
      }
    ]
  }
]
```

## Styling

The component includes inline styles and expects a dark theme. Key CSS classes:
- `.event-tree-container-loader` - Loading state container

## Error Handling

The component includes built-in error handling:
- API request failures are caught and passed to `onError`
- Malformed localStorage data is handled gracefully
- Aborted requests (component unmount) are ignored

## Development

This is a React component library. To use in development:

1. Install dependencies in your project
2. Import and use the component as shown in examples
3. Ensure your API endpoint returns data in the expected format

### Running the Example

To run the included React example:

```bash
cd examples/react
npm install
npm run dev
```

This will start a development server at `http://localhost:5173` with a working implementation of the event tree component.

## Browser Support

- Modern browsers with ES6+ support
- Requires localStorage for state persistence
- Uses React hooks (React 16.8+)

## License

Apache-2.0

## Contributing

This component is part of the Helioviewer Project. For issues and contributions, please visit:
https://github.com/Helioviewer-Project/event-tree
