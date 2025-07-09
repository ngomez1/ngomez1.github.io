/**
 * Wedding Website - Supabase Integration
 * Handles connection to Supabase and API calls
 */

// Supabase configuration
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://pecgouevxbqehytdacnz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlY2dvdWV2eGJxZWh5dGRhY256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDMwMzYsImV4cCI6MjA2NzQ3OTAzNn0.s7qVl2qF5aKfZPUydV3pKziwADEMBOcJDkdwBAmo1Cw';

// Initialize Supabase client (this is a placeholder - actual implementation will use the Supabase JS client)
let supabaseClient = null;

/**
 * Initialize Supabase client
 * This function would normally use the Supabase JS client library
 * For now, we're creating a placeholder implementation
 */
function initSupabase() {
    // In a real implementation, this would be:
    // supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // For now, we'll create a mock client with the necessary methods
    supabaseClient = {
        from: (table) => ({
            insert: async (data) => {
                console.log(`Inserting into ${table}:`, data);
                // Simulate successful API call
                return { 
                    data: { ...data, id: generateUUID() }, 
                    error: null 
                };
            },
            select: async (columns) => {
                console.log(`Selecting ${columns || '*'} from ${table}`);
                // Simulate successful API call with mock data
                return { 
                    data: getMockData(table), 
                    error: null 
                };
            }
        })
    };
    
    console.log('Supabase client initialized (mock implementation)');
    return supabaseClient;
}

/**
 * Submit RSVP data to Supabase
 * @param {Object} rsvpData - The RSVP data to submit
 * @return {Promise<boolean>} Whether the submission was successful
 */
async function submitRSVPToSupabase(rsvpData) {
    try {
        // Initialize Supabase client if not already initialized
        if (!supabaseClient) {
            initSupabase();
        }
        
        // Add timestamp
        const dataWithTimestamp = {
            ...rsvpData,
            created_at: new Date().toISOString()
        };
        
        // Insert data into the rsvp_submissions table
        const { data, error } = await supabaseClient
            .from('rsvp_submissions')
            .insert(dataWithTimestamp);
        
        if (error) {
            console.error('Error submitting RSVP:', error);
            return false;
        }
        
        console.log('RSVP submitted successfully:', data);
        return true;
    } catch (error) {
        console.error('Error in submitRSVPToSupabase:', error);
        return false;
    }
}

/**
 * Fetch RSVP submissions from Supabase (admin function)
 * @return {Promise<Array>} Array of RSVP submissions
 */
async function fetchRSVPSubmissions() {
    try {
        // Initialize Supabase client if not already initialized
        if (!supabaseClient) {
            initSupabase();
        }
        
        // Fetch all RSVP submissions
        const { data, error } = await supabaseClient
            .from('rsvp_submissions')
            .select('*');
        
        if (error) {
            console.error('Error fetching RSVP submissions:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error in fetchRSVPSubmissions:', error);
        return [];
    }
}

/**
 * Generate a UUID (for mock implementation)
 * @return {string} A UUID
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get mock data for testing (for mock implementation)
 * @param {string} table - The table to get mock data for
 * @return {Array} Array of mock data
 */
function getMockData(table) {
    if (table === 'rsvp_submissions') {
        return [
            {
                id: generateUUID(),
                created_at: '2025-06-01T12:00:00Z',
                name: 'John Doe',
                email: 'john@example.com',
                attending: true,
                guest_count: 2,
                meal_preference: 'Chicken',
                song_request: 'Perfect by Ed Sheeran',
                plus_one_name: 'Jane Doe',
                plus_one_meal: 'Vegetarian'
            },
            {
                id: generateUUID(),
                created_at: '2025-06-02T14:30:00Z',
                name: 'Alice Smith',
                email: 'alice@example.com',
                attending: true,
                guest_count: 1,
                meal_preference: 'Vegetarian',
                song_request: '',
                plus_one_name: '',
                plus_one_meal: ''
            },
            {
                id: generateUUID(),
                created_at: '2025-06-03T09:15:00Z',
                name: 'Bob Johnson',
                email: 'bob@example.com',
                attending: false,
                guest_count: 0,
                meal_preference: '',
                song_request: '',
                plus_one_name: '',
                plus_one_meal: ''
            }
        ];
    }
    
    return [];
}

// Initialize Supabase when the script loads
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a page that needs Supabase
    if (document.getElementById('rsvp-form')) {
        initSupabase();
    }
});