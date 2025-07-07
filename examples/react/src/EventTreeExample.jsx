import React, { useState } from 'react';
import HelioviewerEventTree from '@helioviewer/event-tree';

const EventTreeExample = () => {
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
    <div style={{ padding: '20px' }}>
      <h2>Helioviewer Event Tree Example</h2>
      <p>This component displays solar events in a hierarchical tree structure.</p>
      
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        padding: '10px', 
        marginBottom: '20px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        <HelioviewerEventTree
          source="HEK"
          eventsDate={new Date('2023-01-01')}
          onEventsUpdate={handleEventsUpdate}
          onHoveredEventsUpdate={handleHoveredEventsUpdate}
          apiURL="http://ec2-44-219-199-246.compute-1.amazonaws.com:8081"
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Selected Events ({selectedEvents.length})</h3>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {selectedEvents.length === 0 ? (
            <p>No events selected</p>
          ) : (
            <ul>
              {selectedEvents.map((event, index) => (
                <li key={index}>
                  <strong>{event.label || event.event_data?.short_label || event.event_data?.id}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventTreeExample;