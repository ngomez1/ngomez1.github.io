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
 */
function initSupabase() {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');
    return supabaseClient;
}


/**
 * Submit RSVP data to Supabase
 * @param {Object} rsvpData - The RSVP data to submit
 * @return {Promise<boolean>} Whether the submission was successful
 */
async function submitRSVPToSupabase(rsvpData) {
    try {
        if (!supabaseClient) {
            initSupabase();
        }
        
        // Transform data to match the schema
        const dataForInsert = {
            first_name: rsvpData.name.split(' ')[0],
            last_name: rsvpData.name.split(' ').slice(1).join(' '),
            email: rsvpData.email,
            phone: rsvpData.phone || null,
            attending: rsvpData.attending,
            guest_count: rsvpData.guest_count,
            meal_preference: rsvpData.meal_preference,
            dietary_restrictions: rsvpData.dietary_restrictions,
            song_requests: rsvpData.song_request,
            notes: rsvpData.notes
        };
        
        // Insert data into the rsvps table
        const { data, error } = await supabaseClient
            .from('rsvps')
            .insert(dataForInsert)
            .select(); // Add .select() to get the inserted record with its ID
        
        if (error) {
            console.error('Error submitting RSVP:', error);
            return false;
        }
        
        // If there are additional guests, insert them into the guests table
        if (rsvpData.guests && rsvpData.guests.length > 0 && data && data.length > 0) {
            const rsvpId = data[0].id;
            
            // Prepare guest data for insertion
            const guestsForInsert = rsvpData.guests.map(guest => ({
                rsvp_id: rsvpId,
                first_name: guest.first_name,
                last_name: guest.last_name,
                meal_preference: guest.meal_preference || 'None specified',
                dietary_restrictions: guest.dietary_restrictions || 'None specified'
            }));
            
            // Insert guests data
            const { error: guestsError } = await supabaseClient
                .from('guests')
                .insert(guestsForInsert);
            
            if (guestsError) {
                console.error('Error submitting guests:', guestsError);
                // We don't return false here as the main RSVP was successful
            }
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