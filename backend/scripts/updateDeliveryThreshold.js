require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('delivery_settings')
    .update({ free_above: 1000 })
    .eq('id', 1);
  
  if (error) {
    console.error('Error updating delivery settings:', error);
  } else {
    console.log('Successfully updated free_above to 1000.');
  }
}

run();
