import eventBus from './event-bus';

// Enhanced fetch that triggers events on successful responses
const originalFetch = fetch;

const enhancedFetch = async (url, options = {}) => {
  try {
    const response = await originalFetch(url, options);

    // Check if this is a successful ticket creation
    if (response.ok && response.headers.get('X-Trigger-Update') === 'ticket_created') {
      const ticketDataHeader = response.headers.get('X-Ticket-Data');

      if (ticketDataHeader) {
        try {
          const ticketData = JSON.parse(ticketDataHeader);
          console.log('🎯 Fetch interceptor: Triggering immediate update for ticket:', ticketData);

          // Trigger the event bus immediately
          eventBus.emit('ticket_created', ticketData);
        } catch (parseError) {
          console.error('Error parsing ticket data from header:', parseError);
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Enhanced fetch error:', error);
    throw error;
  }
};

// Replace global fetch if in browser
if (typeof window !== 'undefined') {
  window.fetch = enhancedFetch;
}

export default enhancedFetch;