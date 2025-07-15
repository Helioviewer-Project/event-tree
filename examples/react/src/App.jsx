import { useState } from 'react'
import './App.css'
import HelioviewerEventTree from '@helioviewer/event-tree'
import { fixTitle } from '@helioviewer/event-tree/src/NodeLabel.jsx'

function App() {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date('2023-01-01T12:00:00Z'));
  const [hoveredEventIds, setHoveredEventIds] = useState([]);

  const handleEventsUpdate = (events, source) => {
    console.log('Selected events:', events);
    setSelectedEvents(prevEvents => {
      const filteredEvents = prevEvents.filter(event => event.source !== source);
      const newEvents = events.map(event => ({ ...event, source }));
      return [...filteredEvents, ...newEvents];
    });
  };

  const handleHoveredEventsUpdate = (eventIds) => {
    console.log('Hovered events:', eventIds);
    console.log('Selected events for comparison:', selectedEvents.map(e => ({ id: e.id })));
    setHoveredEventIds(eventIds);
  };

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const isEventHovered = (event) => {
    // Check if this event is currently being hovered in the tree
    const eventId = event.id;
    const isHovered = hoveredEventIds.includes(eventId);
    console.log('Checking event:', eventId, 'against hoveredIds:', hoveredEventIds, 'result:', isHovered);
    return isHovered;
  };

  return (
    <>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
          <img 
            src="helioviewer-logo.png" 
            alt="Helioviewer Project" 
            style={{ width: '60px', height: '60px' }}
          />
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>Helioviewer Event Tree</h1>
        </div>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '800px', margin: '0 auto 20px' }}>
          A React component for displaying and managing hierarchical solar event data from various sources. 
          This interactive tree interface allows you to browse, select, and manage events with features like 
          hierarchical selection, expand/collapse functionality, and persistent state management.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <a 
            href="https://github.com/Helioviewer-Project/event-tree" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              textDecoration: 'none',
              color: '#333',
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <img 
              src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" 
              alt="GitHub" 
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ fontWeight: '500' }}>GitHub Repository</span>
          </a>
          
          <a 
            href="https://www.npmjs.com/package/@helioviewer/event-tree" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              textDecoration: 'none',
              color: '#333',
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <img 
              src="https://static-production.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png" 
              alt="npm" 
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ fontWeight: '500' }}>NPM Package</span>
          </a>
        </div>
        
        <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <label style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Select Date & Time (UTC):
          </label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => {
              const timeValue = selectedDate.toISOString().split('T')[1].substring(0, 5);
              setSelectedDate(new Date(e.target.value + 'T' + timeValue + ':00Z'));
            }}
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: '#333',
              colorScheme: 'light'
            }}
          />
          <input
            type="time"
            value={selectedDate.toISOString().split('T')[1].substring(0, 5)}
            onChange={(e) => {
              const dateValue = selectedDate.toISOString().split('T')[0];
              setSelectedDate(new Date(dateValue + 'T' + e.target.value + ':00Z'));
            }}
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              color: '#333',
              colorScheme: 'light'
            }}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', padding: '20px', height: 'calc(100vh - 200px)', minWidth: 0, width: '100%' }}>
        {/* Left Side - Stacked Event Trees */}
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <div style={{ 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              padding: '10px',
              flex: '1',
              overflow: 'auto'
            }}>
              <HelioviewerEventTree
                source="HEK"
                eventsDate={selectedDate}
                onEventsUpdate={(events) => handleEventsUpdate(events, 'HEK')}
                onHoveredEventsUpdate={handleHoveredEventsUpdate}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <div style={{ 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              padding: '10px',
              flex: '1',
              overflow: 'auto'
            }}>
              <HelioviewerEventTree
                source="CCMC"
                eventsDate={selectedDate}
                onEventsUpdate={(events) => handleEventsUpdate(events, 'CCMC')}
                onHoveredEventsUpdate={handleHoveredEventsUpdate}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <div style={{ 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              padding: '10px',
              flex: '1',
              overflow: 'auto'
            }}>
              <HelioviewerEventTree
                source="RHESSI"
                eventsDate={selectedDate}
                onEventsUpdate={(events) => handleEventsUpdate(events, 'RHESSI')}
                onHoveredEventsUpdate={handleHoveredEventsUpdate}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Selected Events */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            padding: '20px',
            flex: '1',
            overflow: 'auto',
            backgroundColor: '#f0f0f0',
            minWidth: 0
          }}>
            {selectedEvents.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No events selected</p>
            ) : (
              <div>
                {selectedEvents.map((event, index) => (
                  <div key={`${event.source}-${event.id || index}`} style={{ 
                    marginBottom: '15px',
                    padding: '15px',
                    backgroundColor: isEventHovered(event) ? '#fff3cd' : 'white',
                    borderRadius: '8px',
                    boxShadow: isEventHovered(event) ? '0 4px 8px rgba(255,193,7,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    border: isEventHovered(event) ? '2px solid #ffc107' : '1px solid transparent',
                    transition: 'all 0.2s ease-in-out'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: event.source === 'HEK' ? '#1976d2' : event.source === 'CCMC' ? '#388e3c' : '#f57c00',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>
                          {event.source}
                        </span>
                        <strong style={{ fontSize: '16px', color: '#333' }}>
                          {fixTitle(event.event_data?.short_label || event.event_data?.label || event.label || 'Unknown Event')}
                        </strong>
                      </div>
                      <button 
                        onClick={() => toggleEventExpansion(`${event.source}-${event.id || index}`)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: '#333',
                          color: 'white',
                          border: '1px solid #333',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {expandedEvents[`${event.source}-${event.id || index}`] ? 'Hide JSON' : 'Show JSON'}
                      </button>
                    </div>
                    
                    {expandedEvents[`${event.source}-${event.id || index}`] && (
                      <div style={{ 
                        marginTop: '10px',
                        padding: '16px',
                        backgroundColor: '#f6f8fa',
                        borderRadius: '6px',
                        border: '1px solid #d0d7de',
                        maxWidth: '100%',
                        overflow: 'hidden'
                      }}>
                        <pre style={{ 
                          fontSize: '12px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          margin: 0,
                          maxHeight: '300px',
                          overflow: 'auto',
                          color: '#1f2328',
                          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                          lineHeight: '1.45',
                          backgroundColor: '#f6f8fa',
                          textAlign: 'left'
                        }}>
{JSON.stringify(event.event_data || event, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
